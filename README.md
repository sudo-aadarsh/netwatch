# 🛰 NetWatch — Real-Time Internet Traffic Visualizer

> A full-stack BGP routing monitor that ingests live data from the **RIPE Atlas API** and **RIPE RIS BGP stream**, visualizes 30 global backbone routes on a **Three.js 3D globe**, and detects latency anomalies using **EWMA + Z-score statistics**.

---

## What This Project Demonstrates

| Concept | Implementation |
|---|---|
| **Networking** | BGP routing, AS paths, submarine cable latencies, IXP nodes |
| **Real-time systems** | WebSocket streaming (RIPE RIS live BGP feed) |
| **Statistics** | EWMA (α=0.3) smoothing + Z-score anomaly detection |
| **Data engineering** | REST API polling, SQLite time-series storage, broadcast fanout |
| **3D visualization** | Three.js WebGL globe with procedural country borders |
| **Full-stack** | Python FastAPI backend + React frontend |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│  Three.js 3D Globe · Route Arcs · Packet Animation  │
│  BGP Event Feed · AS Path Panel · Anomaly Alerts    │
└────────────────────┬────────────────────────────────┘
                     │ WebSocket (/ws)
┌────────────────────▼────────────────────────────────┐
│                 BACKEND (FastAPI)                    │
│                                                     │
│  ┌─────────────────┐    ┌──────────────────────┐   │
│  │ Latency Loop    │    │ BGP Stream Loop       │   │
│  │ Every 2s:       │    │ wss://ris-live.ripe.  │   │
│  │ • EWMA update   │    │ net/v1/ws/            │   │
│  │ • Z-score check │    │ • Parse UPDATE msgs   │   │
│  │ • Broadcast     │    │ • Trigger anomalies   │   │
│  └────────┬────────┘    └──────────┬───────────┘   │
│           │                        │                │
│  ┌────────▼────────────────────────▼───────────┐   │
│  │              SQLite (netwatch.db)            │   │
│  │  measurements · bgp_events                  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         ↑                        ↑
  RIPE Atlas REST API      RIPE RIS WebSocket
  (latency calibration)    (live BGP stream)
```

---

## Tech Stack

- **Frontend**: React, Three.js (WebGL 3D globe), D3.js, TopoJSON
- **Backend**: Python 3.11+, FastAPI, aiohttp, uvicorn
- **Database**: SQLite (time-series measurements)
- **Real data sources**:
  - [RIPE Atlas API](https://atlas.ripe.net/docs/apis/) — global ping/traceroute measurements
  - [RIPE RIS Live](https://ris-live.ripe.net/) — real-time BGP stream (WebSocket)
- **Algorithms**: EWMA (Exponential Weighted Moving Average), Z-score anomaly detection

---

## Quick Start

### Backend

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend

```bash
# If using Create React App
npx create-react-app netwatch-frontend
cd netwatch-frontend
npm install three d3
# Replace src/App.jsx with NetWatch-3D.jsx
npm start
```

Or paste `NetWatch-3D.jsx` directly into [claude.ai](https://claude.ai) as a React artifact for an instant live preview.

---

## API Reference

| Endpoint | Description |
|---|---|
| `GET /api/routes` | All routes with current latency + EWMA state |
| `GET /api/history/{route_id}` | Measurement history for a route (SQLite) |
| `GET /api/anomalies` | Recent anomaly events (z-score > 2σ) |
| `GET /api/bgp/events` | Recent BGP UPDATE/WITHDRAW events |
| `GET /api/stats` | System stats: total measurements, anomaly count, connected clients |
| `WS  /ws` | Real-time broadcast stream (JSON events) |

### WebSocket Event Types

```json
{ "type": "latency_update", "latencies": { "NYC-LON": { "latency": 74.2, "ewma": 72.1, "z_score": 0.3, "anomaly": false } } }
{ "type": "bgp_event",      "event": { "peer": "80.81.194.1", "peer_asn": "AS1200", "as_path": "AS1200 → AS3356 → AS6939", "type": "ANNOUNCE" } }
```

---

## Anomaly Detection — How It Works

Each route maintains an **EWMA tracker** (α = 0.3) over a 30-sample sliding window.

```
EWMA(t) = α × current + (1 − α) × EWMA(t−1)
Z-score  = |current − mean(history)| / σ(history)
Anomaly  = Z-score > 2.0
```

A latency spike flags as an anomaly only when it deviates more than **2 standard deviations** from the route's recent baseline — eliminating false positives from random noise.

---

## Data Sources

| Source | Type | Refresh |
|---|---|---|
| RIPE Atlas REST API | Ping/RTT measurements from global probes | Every 30s |
| RIPE RIS WebSocket | Live BGP UPDATE/WITHDRAW stream | Real-time |

By default, backend runs in **real-only + fail-closed mode** (`NETWATCH_REAL_ONLY=1`, `NETWATCH_FAIL_CLOSED=1`):
- no synthetic latency generation
- no latency broadcast unless a **fresh** RIPE Atlas poll succeeds
- when Atlas is unavailable, backend emits status-only events and withholds latency updates

Configuration flags:

- `NETWATCH_REAL_ONLY=1` (default): disable synthetic latency generation.
- `NETWATCH_FAIL_CLOSED=1` (default): suppress latency broadcasts without fresh RIPE Atlas data.
- `NETWATCH_ATLAS_POLL_SECONDS=30` (default): RIPE Atlas refresh interval.
- `NETWATCH_LATENCY_BROADCAST_SECONDS=2` (default): WebSocket broadcast cadence.

---

## Features

- **3D WebGL Globe** — drag to rotate, scroll to zoom, procedural country borders from TopoJSON
- **30 backbone routes** — colored by latency (cyan → green → amber → red)
- **Animated packets** — travel along curved arc paths in real time
- **AS Path visualization** — click any route to see its BGP AS chain
- **BGP live feed** — real UPDATE/WITHDRAW events from RIPE RIS
- **Anomaly alerts** — EWMA + Z-score detection, routes flash red + event logged
- **SQLite history** — all measurements and BGP events stored for trend analysis
- **REST API** — fully queryable via `/docs` (Swagger UI)

---

## Resume Bullets (Use These)

```
• Built a real-time BGP routing visualizer ingesting live data from RIPE Atlas API
  and RIPE RIS WebSocket stream; Python/FastAPI backend broadcasts latency updates
  via WebSocket to 30+ simultaneous clients.

• Implemented EWMA (α=0.3) + Z-score anomaly detection on time-series latency data,
  flagging routing events with 2σ statistical confidence.

• Rendered a Three.js WebGL 3D globe with procedural TopoJSON country borders,
  animated packet arcs across 30 submarine cable routes, and BGP AS path visualization.

• Persisted measurement history in SQLite with time-series indexing; exposed
  REST API (FastAPI) with Swagger docs for route history, anomaly queries, and stats.
```

---

## Extending the Project

- **Traceroute hops**: Use RIPE Atlas traceroute measurements to animate actual hop-by-hop paths
- **Day/night terminator**: Add a sun position shader to the Three.js globe
- **Historical trends**: Add a Chart.js panel showing 24h latency graphs per route
- **Alerting**: Integrate Slack webhook or email when anomaly z-score > 3σ
- **Containerize**: Wrap in Docker + docker-compose for one-command deployment
- **Deploy**: Host backend on Railway/Render, frontend on Vercel — free tier works fine

---

## Project Structure

```
internet_traffic_vis/
├── main.py                  ← FastAPI app (WebSocket, RIPE Atlas, SQLite, anomaly detection)
├── requirements.txt
├── NetWatch-3D.jsx          ← React + Three.js 3D globe component
└── README.md
```

---

*Data sources: [RIPE NCC](https://www.ripe.net/) · [RIPE Atlas](https://atlas.ripe.net/) · [RIPE RIS](https://ris.ripe.net/)*
# internet_traffic_visualizer
