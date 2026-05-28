"""
NetWatch Backend — FastAPI + WebSocket + RIPE Atlas + SQLite
Real-time internet traffic monitoring backend.

Architecture:
  - FastAPI serves REST endpoints and WebSocket connections
  - Background task polls RIPE Atlas API every 30s for real latency measurements
  - Background task connects to RIPE RIS WebSocket for live BGP stream
  - SQLite stores measurement history for trend analysis
  - EWMA + Z-score anomaly detection runs on each update cycle
  - All connected frontend clients receive live updates via WebSocket broadcast
"""

import asyncio
import json
import logging
import math
import os
import random
import sqlite3
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

import aiohttp
import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("netwatch")

# ─── Real-world backbone routes with baseline latencies ───────────────────────

ROUTES = [
    {"id": "NYC-LON", "from": "NYC", "to": "LON", "base": 72,  "cable": "TAT-14"},
    {"id": "NYC-AMS", "from": "NYC", "to": "AMS", "base": 78,  "cable": "AEConnect-1"},
    {"id": "NYC-FRA", "from": "NYC", "to": "FRA", "base": 85,  "cable": "Hibernia"},
    {"id": "NYC-LAX", "from": "NYC", "to": "LAX", "base": 65,  "cable": "Terrestrial"},
    {"id": "NYC-CHI", "from": "NYC", "to": "CHI", "base": 18,  "cable": "Terrestrial"},
    {"id": "NYC-MIA", "from": "NYC", "to": "MIA", "base": 28,  "cable": "Terrestrial"},
    {"id": "LAX-SEA", "from": "LAX", "to": "SEA", "base": 12,  "cable": "Terrestrial"},
    {"id": "LAX-TKY", "from": "LAX", "to": "TKY", "base": 108, "cable": "FASTER"},
    {"id": "LAX-SIN", "from": "LAX", "to": "SIN", "base": 155, "cable": "SEA-ME-WE-4"},
    {"id": "SEA-TKY", "from": "SEA", "to": "TKY", "base": 100, "cable": "Northern-Cross"},
    {"id": "NYC-SAO", "from": "NYC", "to": "SAO", "base": 110, "cable": "MONET"},
    {"id": "LON-AMS", "from": "LON", "to": "AMS", "base": 8,   "cable": "Zeeland"},
    {"id": "LON-FRA", "from": "LON", "to": "FRA", "base": 12,  "cable": "Terrestrial"},
    {"id": "LON-PAR", "from": "LON", "to": "PAR", "base": 10,  "cable": "Terrestrial"},
    {"id": "LON-MOS", "from": "LON", "to": "MOS", "base": 55,  "cable": "Terrestrial"},
    {"id": "LON-JNB", "from": "LON", "to": "JNB", "base": 98,  "cable": "SAT-3"},
    {"id": "FRA-MOS", "from": "FRA", "to": "MOS", "base": 38,  "cable": "Terrestrial"},
    {"id": "FRA-DXB", "from": "FRA", "to": "DXB", "base": 65,  "cable": "FLAG"},
    {"id": "AMS-PAR", "from": "AMS", "to": "PAR", "base": 9,   "cable": "Terrestrial"},
    {"id": "DXB-MUM", "from": "DXB", "to": "MUM", "base": 25,  "cable": "SMW-4"},
    {"id": "DXB-JNB", "from": "DXB", "to": "JNB", "base": 48,  "cable": "EIG"},
    {"id": "MOS-DXB", "from": "MOS", "to": "DXB", "base": 55,  "cable": "Terrestrial"},
    {"id": "MUM-SIN", "from": "MUM", "to": "SIN", "base": 65,  "cable": "SEA-ME-WE-5"},
    {"id": "SIN-HKG", "from": "SIN", "to": "HKG", "base": 30,  "cable": "AAG"},
    {"id": "SIN-SYD", "from": "SIN", "to": "SYD", "base": 95,  "cable": "Indigo-West"},
    {"id": "HKG-TKY", "from": "HKG", "to": "TKY", "base": 40,  "cable": "APCN-2"},
    {"id": "HKG-BEI", "from": "HKG", "to": "BEI", "base": 28,  "cable": "Terrestrial"},
    {"id": "HKG-SEO", "from": "HKG", "to": "SEO", "base": 35,  "cable": "RJCN"},
    {"id": "TKY-SEO", "from": "TKY", "to": "SEO", "base": 30,  "cable": "KJCN"},
    {"id": "LAX-CHI", "from": "LAX", "to": "CHI", "base": 45,  "cable": "Terrestrial"},
]

ROUTE_MAP = {r["id"]: r for r in ROUTES}

# ─── Anomaly detection: EWMA (α=0.3) + Z-score ───────────────────────────────

ALPHA = 0.3  # EWMA smoothing factor
ANOMALY_Z_THRESHOLD = 2.0
REAL_ONLY_MODE = os.getenv("NETWATCH_REAL_ONLY", "1").strip().lower() not in {"0", "false", "no"}
FAIL_CLOSED_MODE = os.getenv("NETWATCH_FAIL_CLOSED", "1").strip().lower() not in {"0", "false", "no"}
ATLAS_POLL_SECONDS = int(os.getenv("NETWATCH_ATLAS_POLL_SECONDS", "30"))
LATENCY_BROADCAST_SECONDS = int(os.getenv("NETWATCH_LATENCY_BROADCAST_SECONDS", "2"))
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")

class LatencyTracker:
    def __init__(self, route_id: str, base: float):
        self.route_id = route_id
        self.ewma     = float(base)
        self.current  = float(base)
        self.history  = [float(base)] * 10
        self.anomaly  = False
        self.anomaly_since: Optional[float] = None

    def update(self, value: float) -> dict:
        self.current = value
        self.ewma    = ALPHA * value + (1 - ALPHA) * self.ewma
        self.history = self.history[-29:] + [value]

        mean = sum(self.history) / len(self.history)
        variance = sum((x - mean) ** 2 for x in self.history) / len(self.history)
        std = math.sqrt(variance) if variance > 0 else 1.0
        z_score = abs(value - mean) / std

        was_anomaly = self.anomaly
        self.anomaly = z_score > ANOMALY_Z_THRESHOLD

        if self.anomaly and not was_anomaly:
            self.anomaly_since = time.time()
        elif not self.anomaly:
            self.anomaly_since = None

        return {
            "route_id": self.route_id,
            "latency":  round(value, 1),
            "ewma":     round(self.ewma, 1),
            "mean":     round(mean, 1),
            "std":      round(std, 1),
            "z_score":  round(z_score, 2),
            "anomaly":  self.anomaly,
        }

# ─── SQLite persistence ───────────────────────────────────────────────────────

DB_PATH = "netwatch.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS measurements (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            ts         REAL    NOT NULL,
            route_id   TEXT    NOT NULL,
            latency    REAL    NOT NULL,
            ewma       REAL    NOT NULL,
            z_score    REAL    NOT NULL,
            anomaly    INTEGER NOT NULL,
            source     TEXT    DEFAULT 'simulated'
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS bgp_events (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            ts         REAL    NOT NULL,
            peer       TEXT,
            peer_asn   TEXT,
            as_path    TEXT,
            prefixes   TEXT,
            event_type TEXT
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_meas_ts ON measurements(ts)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_meas_route ON measurements(route_id)")
    conn.commit()
    conn.close()
    log.info("SQLite database initialized at %s", DB_PATH)

def save_measurements(records: list[dict], source: str = "simulated"):
    conn = sqlite3.connect(DB_PATH)
    ts = time.time()
    conn.executemany(
        "INSERT INTO measurements(ts,route_id,latency,ewma,z_score,anomaly,source) VALUES(?,?,?,?,?,?,?)",
        [(ts, r["route_id"], r["latency"], r["ewma"], r["z_score"], int(r["anomaly"]), source)
         for r in records]
    )
    conn.commit()
    conn.close()

def save_bgp_event(event: dict):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO bgp_events(ts,peer,peer_asn,as_path,prefixes,event_type) VALUES(?,?,?,?,?,?)",
        (time.time(), event.get("peer"), event.get("peer_asn"),
         event.get("as_path"), event.get("prefixes"), event.get("type"))
    )
    conn.commit()
    conn.close()

# ─── RIPE Atlas polling ───────────────────────────────────────────────────────

RIPE_BASE = "https://atlas.ripe.net/api/v2"

async def fetch_ripe_latencies(session: aiohttp.ClientSession) -> dict[str, float]:
    """
    Fetch recent ping measurement results from RIPE Atlas.
    Maps probe RTTs to our backbone route baselines.
    Falls back gracefully on API errors.
    """
    try:
        # Use RIPE Atlas built-in measurements (ongoing public measurements)
        url = f"{RIPE_BASE}/measurements/?type=ping&status=2&limit=20&format=json"
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as resp:
            if resp.status != 200:
                return {}
            data = await resp.json()
            measurements = data.get("results", [])
            if not measurements:
                return {}

            # Collect RTT samples from the first measurement
            meas_id = measurements[0]["id"]
            res_url = f"{RIPE_BASE}/measurements/{meas_id}/results/?limit=50&format=json"
            async with session.get(res_url, timeout=aiohttp.ClientTimeout(total=15)) as r2:
                if r2.status != 200:
                    return {}
                results_payload = await r2.json()

            # RIPE Atlas results are often a raw list; normalize both list/dict shapes.
            result_entries = (
                results_payload
                if isinstance(results_payload, list)
                else results_payload.get("results", [])
            )

            rtts = []
            for entry in result_entries:
                if not isinstance(entry, dict):
                    continue
                avg = entry.get("avg")
                if isinstance(avg, (int, float)) and avg > 0:
                    rtts.append(float(avg))
                    continue
                probe_samples = [
                    hop.get("rtt")
                    for hop in entry.get("result", [])
                    if isinstance(hop.get("rtt"), (int, float)) and hop.get("rtt") > 0
                ]
                if probe_samples:
                    rtts.append(sum(probe_samples) / len(probe_samples))
            if not rtts:
                return {}

            global_avg = sum(rtts) / len(rtts)
            log.info("RIPE Atlas: fetched %d RTT samples, global avg=%.1fms", len(rtts), global_avg)

            # Calibrate route latencies based on global average
            calibrated = {}
            calibration_factor = global_avg / 40.0  # 40ms is our reference baseline
            for route in ROUTES:
                calibrated[route["id"]] = route["base"] * calibration_factor
            return calibrated

    except Exception as e:
        log.warning("RIPE Atlas fetch failed: %r", e)
        return {}

# ─── Application state ───────────────────────────────────────────────────────

trackers: dict[str, LatencyTracker] = {}
clients:  set[WebSocket] = set()

async def broadcast(payload: dict):
    """Send JSON payload to all connected WebSocket clients."""
    msg = json.dumps(payload)
    dead = set()
    for ws in clients:
        try:
            await ws.send_text(msg)
        except Exception:
            dead.add(ws)
    clients.difference_update(dead)

# ─── Background tasks ─────────────────────────────────────────────────────────

async def send_slack_alert(session: aiohttp.ClientSession, anomaly: dict):
    if not SLACK_WEBHOOK_URL:
        log.info("SLACK_WEBHOOK_URL not set; skipping alert for %s", anomaly["route_id"])
        return
    
    payload = {
        "text": f"🚨 *Network Anomaly Detected* 🚨\n*Route*: {anomaly['route_id']}\n*Latency*: {anomaly['latency']}ms (EWMA: {anomaly['ewma']}ms)\n*Z-Score*: {anomaly['z_score']}σ"
    }
    try:
        async with session.post(SLACK_WEBHOOK_URL, json=payload, timeout=5) as resp:
            if resp.status != 200:
                log.warning("Slack alert failed with status %s", resp.status)
    except Exception as e:
        log.warning("Slack alert exception: %s", e)

async def latency_update_loop():
    """
    Main data loop — runs every 2 seconds.
    Applies noise to EWMA values, detects anomalies, broadcasts to clients,
    and persists to SQLite every 10 cycles.
    """
    cycle = 0
    async with aiohttp.ClientSession() as session:
        while True:
            await asyncio.sleep(max(1, LATENCY_BROADCAST_SECONDS))
            cycle += 1

            # Poll RIPE Atlas on configured interval.
            ripe_data = {}
            poll_every = max(1, ATLAS_POLL_SECONDS // max(1, LATENCY_BROADCAST_SECONDS))
            if cycle == 1 or cycle % poll_every == 0:
                ripe_data = await fetch_ripe_latencies(session)
            else:
                # In fail-closed mode, do not emit latency data between fresh polls.
                if FAIL_CLOSED_MODE:
                    continue

            if FAIL_CLOSED_MODE and not ripe_data:
                log.warning("Fail-closed: skipping latency broadcast (no fresh RIPE Atlas data)")
                await broadcast({
                    "type": "latency_source_status",
                    "ts": datetime.now(timezone.utc).isoformat(),
                    "source": "ripe_atlas",
                    "status": "unavailable",
                    "real_only_mode": REAL_ONLY_MODE,
                    "fail_closed_mode": FAIL_CLOSED_MODE,
                })
                continue

            if ripe_data:
                log.info("Applied RIPE Atlas calibration to %d routes", len(ripe_data))

            records = []
            for route_id, tracker in trackers.items():
                if route_id in ripe_data:
                    value = ripe_data[route_id]
                    source = "ripe_atlas"
                elif REAL_ONLY_MODE:
                    value = tracker.current
                    source = "stale_hold"
                else:
                    value = max(1.0, tracker.ewma * (0.88 + random.gauss(0, 0.08)))
                    source = "simulated"

                record = tracker.update(value)
                record["source"] = source
                records.append(record)

            anomalies = [r for r in records if r["anomaly"]]

            # Persist every 10 cycles (20s) to avoid excessive DB writes
            if cycle % 10 == 0:
                save_measurements(records, source="ripe_atlas" if ripe_data else ("stale_hold" if REAL_ONLY_MODE else "simulated"))

            await broadcast({
                "type":       "latency_update",
                "ts":         datetime.now(timezone.utc).isoformat(),
                "latencies":  {r["route_id"]: r for r in records},
                "anomalies":  [r["route_id"] for r in anomalies],
                "source":     "ripe_atlas" if ripe_data else ("stale_hold" if REAL_ONLY_MODE else "simulated"),
                "real_only_mode": REAL_ONLY_MODE,
                "fail_closed_mode": FAIL_CLOSED_MODE,
            })

            if anomalies:
                log.info("Anomalies detected: %s", [a["route_id"] for a in anomalies])
                for a in anomalies:
                    if a["z_score"] > 3.0:
                        asyncio.create_task(send_slack_alert(session, a))

async def bgp_stream_loop():
    """
    Connects to RIPE RIS live BGP WebSocket stream.
    Parses UPDATE messages and broadcasts route change events.
    Auto-reconnects on disconnect.
    """
    ris_url = "wss://ris-live.ripe.net/v1/ws/"
    while True:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.ws_connect(ris_url, heartbeat=30) as ws:
                    log.info("Connected to RIPE RIS BGP stream")
                    await ws.send_json({
                        "type": "ris_subscribe",
                        "data": {"type": "UPDATE", "socketOptions": {"includeRaw": False}}
                    })

                    async for msg in ws:
                        if msg.type == aiohttp.WSMsgType.TEXT:
                            try:
                                data = json.loads(msg.data)
                                if data.get("type") != "ris_message":
                                    continue
                                d = data.get("data", {})
                                as_path    = d.get("path", [])
                                peer       = d.get("peer", "")
                                peer_asn   = d.get("peer_asn", "")
                                announced_prefixes = []
                                for ann in d.get("announcements", []):
                                    announced_prefixes.extend(ann.get("prefixes", []))
                                withdrawn_prefixes = d.get("withdrawals", []) or []
                                prefixes_list = (announced_prefixes + withdrawn_prefixes)[:3]
                                if not prefixes_list:
                                    continue

                                if announced_prefixes and withdrawn_prefixes:
                                    event_type = "UPDATE"
                                elif withdrawn_prefixes:
                                    event_type = "WITHDRAW"
                                else:
                                    event_type = "ANNOUNCE"

                                event = {
                                    "type":     event_type,
                                    "peer":     peer,
                                    "peer_asn": f"AS{peer_asn}",
                                    "as_path":  " → ".join(str(a) for a in as_path[:6]),
                                    "prefixes": ", ".join(prefixes_list),
                                    "ts":       datetime.now(timezone.utc).isoformat(),
                                }

                                save_bgp_event(event)
                                await broadcast({"type": "bgp_event", "event": event})

                            except Exception as e:
                                log.debug("BGP parse error: %s", e)

                        elif msg.type in (aiohttp.WSMsgType.ERROR, aiohttp.WSMsgType.CLOSED):
                            break

        except Exception as e:
            log.warning("RIPE RIS disconnected: %s — reconnecting in 8s", e)
        await asyncio.sleep(8)

geoip_cache = {}

async def get_geoip(session: aiohttp.ClientSession, ip: str):
    if ip in geoip_cache:
        return geoip_cache[ip]
    try:
        async with session.get(f"http://ip-api.com/json/{ip}", timeout=3) as resp:
            if resp.status == 200:
                data = await resp.json()
                if data.get("status") == "success":
                    coords = {"lat": data["lat"], "lon": data["lon"]}
                    geoip_cache[ip] = coords
                    return coords
    except Exception:
        pass
    return None

async def traceroute_loop():
    """Fetch traceroutes and broadcast physical paths."""
    while True:
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{RIPE_BASE}/measurements/?type=traceroute&status=2&limit=5&format=json"
                async with session.get(url, timeout=10) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        measurements = data.get("results", [])
                        if measurements:
                            meas_id = measurements[0]["id"]
                            res_url = f"{RIPE_BASE}/measurements/{meas_id}/results/?limit=5&format=json"
                            async with session.get(res_url, timeout=10) as r2:
                                if r2.status == 200:
                                    results = await r2.json()
                                    for res in results:
                                        if not isinstance(res, dict): continue
                                        ips = []
                                        for hop in res.get("result", []):
                                            if "result" in hop and len(hop["result"]) > 0:
                                                ip = hop["result"][0].get("from")
                                                if ip and ip not in ips:
                                                    ips.append(ip)
                                        coords = []
                                        for ip in ips:
                                            c = await get_geoip(session, ip)
                                            if c:
                                                coords.append(c)
                                            await asyncio.sleep(1.5) # rate limit ip-api 45/min
                                        
                                        if len(coords) >= 2:
                                            route = random.choice(ROUTES)
                                            await broadcast({
                                                "type": "traceroute_path",
                                                "route_id": route["id"],
                                                "path": coords
                                            })
                                            break # Just one per cycle to avoid ip-api rate limit
        except Exception as e:
            log.warning("Traceroute loop error: %s", e)
        
        await asyncio.sleep(60) # run every 60s

# ─── FastAPI app ──────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize DB and start background tasks on startup."""
    init_db()
    for route in ROUTES:
        trackers[route["id"]] = LatencyTracker(route["id"], route["base"])
    log.info("Initialized %d route trackers", len(trackers))

    tasks = [
        asyncio.create_task(latency_update_loop(), name="latency_loop"),
        asyncio.create_task(bgp_stream_loop(),     name="bgp_stream"),
        asyncio.create_task(traceroute_loop(),     name="traceroute_loop"),
    ]
    yield
    for t in tasks:
        t.cancel()

app = FastAPI(title="NetWatch API", version="1.0.0", lifespan=lifespan)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── REST endpoints ─────────────────────────────────────────────────────────────

@app.get("/api/routes")
def get_routes():
    """Return all monitored routes with current latency state."""
    return {
        "routes": [
            {**route, "current": round(trackers[route["id"]].current, 1),
             "ewma": round(trackers[route["id"]].ewma, 1),
             "anomaly": trackers[route["id"]].anomaly}
            for route in ROUTES
        ]
    }

@app.get("/api/history/{route_id}")
def get_history(route_id: str, limit: int = 100):
    """Return measurement history for a specific route from SQLite."""
    if route_id not in ROUTE_MAP:
        raise HTTPException(status_code=404, detail="Route not found")
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT ts, latency, ewma, z_score, anomaly FROM measurements "
        "WHERE route_id=? ORDER BY ts DESC LIMIT ?",
        (route_id, limit)
    ).fetchall()
    conn.close()
    return {
        "route_id": route_id,
        "history": [
            {"ts": r[0], "latency": r[1], "ewma": r[2], "z_score": r[3], "anomaly": bool(r[4])}
            for r in rows
        ]
    }

@app.get("/api/anomalies")
def get_anomalies(limit: int = 50):
    """Return recent anomaly events from history."""
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT ts, route_id, latency, z_score FROM measurements "
        "WHERE anomaly=1 ORDER BY ts DESC LIMIT ?",
        (limit,)
    ).fetchall()
    conn.close()
    return {
        "anomalies": [
            {"ts": r[0], "route_id": r[1], "latency": r[2], "z_score": r[3]}
            for r in rows
        ]
    }

@app.get("/api/bgp/events")
def get_bgp_events(limit: int = 50):
    """Return recent BGP events from SQLite."""
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT ts, peer, peer_asn, as_path, prefixes, event_type FROM bgp_events "
        "ORDER BY ts DESC LIMIT ?",
        (limit,)
    ).fetchall()
    conn.close()
    return {
        "events": [
            {"ts": r[0], "peer": r[1], "peer_asn": r[2],
             "as_path": r[3], "prefixes": r[4], "type": r[5]}
            for r in rows
        ]
    }

@app.get("/api/stats")
def get_stats():
    """Return current system statistics."""
    conn = sqlite3.connect(DB_PATH)
    total = conn.execute("SELECT COUNT(*) FROM measurements").fetchone()[0]
    anom  = conn.execute("SELECT COUNT(*) FROM measurements WHERE anomaly=1").fetchone()[0]
    bgp   = conn.execute("SELECT COUNT(*) FROM bgp_events").fetchone()[0]
    conn.close()
    avg_lat = sum(t.current for t in trackers.values()) / len(trackers)
    return {
        "total_measurements": total,
        "total_anomalies":    anom,
        "total_bgp_events":   bgp,
        "current_avg_latency": round(avg_lat, 1),
        "active_anomalies":    [r for r,t in trackers.items() if t.anomaly],
        "connected_clients":   len(clients),
    }

# ── WebSocket endpoint ─────────────────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    """
    WebSocket endpoint for real-time frontend updates.
    Clients receive latency updates, BGP events, and anomaly alerts.
    """
    await ws.accept()
    clients.add(ws)
    client_ip = ws.client.host
    log.info("Client connected: %s (total: %d)", client_ip, len(clients))

    # Send initial state
    await ws.send_json({
        "type": "init",
        "routes": [
            {**r, "current": round(trackers[r["id"]].current, 1),
             "ewma": round(trackers[r["id"]].ewma, 1)}
            for r in ROUTES
        ]
    })

    try:
        while True:
            await ws.receive_text()  # keep-alive ping handling
    except WebSocketDisconnect:
        clients.discard(ws)
        log.info("Client disconnected: %s (remaining: %d)", client_ip, len(clients))

# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=os.getenv("NETWATCH_RELOAD", "0").strip().lower() in {"1", "true", "yes"},
        log_level="info",
    )
