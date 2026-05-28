import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import LatencyChart from "./LatencyChart";

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════════════

const R = 5;        // globe radius
const ARC_H = 1.0;  // max arc height above surface
const ATMO = 5.3;   // atmosphere radius

const NODES = [
  { id:"NYC", name:"New York",      lat:40.71,  lon:-74.0,   asn:"AS6939",  region:"NA" },
  { id:"LAX", name:"Los Angeles",   lat:34.05,  lon:-118.24, asn:"AS1257",  region:"NA" },
  { id:"SEA", name:"Seattle",       lat:47.61,  lon:-122.33, asn:"AS3561",  region:"NA" },
  { id:"CHI", name:"Chicago",       lat:41.88,  lon:-87.63,  asn:"AS209",   region:"NA" },
  { id:"MIA", name:"Miami",         lat:25.77,  lon:-80.19,  asn:"AS3549",  region:"NA" },
  { id:"LON", name:"London",        lat:51.51,  lon:-0.12,   asn:"AS5459",  region:"EU" },
  { id:"AMS", name:"Amsterdam",     lat:52.37,  lon:4.9,     asn:"AS1200",  region:"EU" },
  { id:"FRA", name:"Frankfurt",     lat:50.11,  lon:8.68,    asn:"AS3356",  region:"EU" },
  { id:"PAR", name:"Paris",         lat:48.86,  lon:2.35,    asn:"AS3215",  region:"EU" },
  { id:"MOS", name:"Moscow",        lat:55.75,  lon:37.62,   asn:"AS8359",  region:"EU" },
  { id:"DXB", name:"Dubai",         lat:25.2,   lon:55.27,   asn:"AS5384",  region:"ME" },
  { id:"MUM", name:"Mumbai",        lat:19.08,  lon:72.88,   asn:"AS9498",  region:"AS" },
  { id:"SIN", name:"Singapore",     lat:1.35,   lon:103.82,  asn:"AS7473",  region:"AS" },
  { id:"HKG", name:"Hong Kong",     lat:22.32,  lon:114.17,  asn:"AS4637",  region:"AS" },
  { id:"BEI", name:"Beijing",       lat:39.9,   lon:116.4,   asn:"AS4538",  region:"AS" },
  { id:"SEO", name:"Seoul",         lat:37.57,  lon:126.98,  asn:"AS4766",  region:"AS" },
  { id:"TKY", name:"Tokyo",         lat:35.69,  lon:139.69,  asn:"AS2497",  region:"AS" },
  { id:"SYD", name:"Sydney",        lat:-33.87, lon:151.21,  asn:"AS1221",  region:"OC" },
  { id:"SAO", name:"São Paulo",     lat:-23.55, lon:-46.63,  asn:"AS28573", region:"SA" },
  { id:"JNB", name:"Johannesburg",  lat:-26.2,  lon:28.04,   asn:"AS37100", region:"AF" },
];
const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]));

const ROUTES = [
  { id:"NYC-LON", from:"NYC", to:"LON", base:72,  cable:"TAT-14"        },
  { id:"NYC-AMS", from:"NYC", to:"AMS", base:78,  cable:"AEConnect-1"   },
  { id:"NYC-FRA", from:"NYC", to:"FRA", base:85,  cable:"Hibernia"      },
  { id:"NYC-LAX", from:"NYC", to:"LAX", base:65,  cable:"Terrestrial"   },
  { id:"NYC-CHI", from:"NYC", to:"CHI", base:18,  cable:"Terrestrial"   },
  { id:"NYC-MIA", from:"NYC", to:"MIA", base:28,  cable:"Terrestrial"   },
  { id:"LAX-SEA", from:"LAX", to:"SEA", base:12,  cable:"Terrestrial"   },
  { id:"LAX-CHI", from:"LAX", to:"CHI", base:45,  cable:"Terrestrial"   },
  { id:"LAX-TKY", from:"LAX", to:"TKY", base:108, cable:"FASTER"        },
  { id:"LAX-SIN", from:"LAX", to:"SIN", base:155, cable:"SEA-ME-WE-4"   },
  { id:"SEA-TKY", from:"SEA", to:"TKY", base:100, cable:"Northern-Cross" },
  { id:"NYC-SAO", from:"NYC", to:"SAO", base:110, cable:"MONET"         },
  { id:"LON-AMS", from:"LON", to:"AMS", base:8,   cable:"Zeeland"       },
  { id:"LON-FRA", from:"LON", to:"FRA", base:12,  cable:"Terrestrial"   },
  { id:"LON-PAR", from:"LON", to:"PAR", base:10,  cable:"Terrestrial"   },
  { id:"LON-MOS", from:"LON", to:"MOS", base:55,  cable:"Terrestrial"   },
  { id:"LON-JNB", from:"LON", to:"JNB", base:98,  cable:"SAT-3"         },
  { id:"FRA-MOS", from:"FRA", to:"MOS", base:38,  cable:"Terrestrial"   },
  { id:"AMS-PAR", from:"AMS", to:"PAR", base:9,   cable:"Terrestrial"   },
  { id:"FRA-DXB", from:"FRA", to:"DXB", base:65,  cable:"FLAG"          },
  { id:"DXB-MUM", from:"DXB", to:"MUM", base:25,  cable:"SMW-4"         },
  { id:"DXB-JNB", from:"DXB", to:"JNB", base:48,  cable:"EIG"           },
  { id:"MOS-DXB", from:"MOS", to:"DXB", base:55,  cable:"Terrestrial"   },
  { id:"MUM-SIN", from:"MUM", to:"SIN", base:65,  cable:"SEA-ME-WE-5"   },
  { id:"SIN-HKG", from:"SIN", to:"HKG", base:30,  cable:"AAG"           },
  { id:"SIN-SYD", from:"SIN", to:"SYD", base:95,  cable:"Indigo-West"   },
  { id:"HKG-TKY", from:"HKG", to:"TKY", base:40,  cable:"APCN-2"        },
  { id:"HKG-BEI", from:"HKG", to:"BEI", base:28,  cable:"Terrestrial"   },
  { id:"HKG-SEO", from:"HKG", to:"SEO", base:35,  cable:"RJCN"          },
  { id:"TKY-SEO", from:"TKY", to:"SEO", base:30,  cable:"KJCN"          },
];
const ROUTE_MAP = Object.fromEntries(ROUTES.map(r => [r.id, r]));

// Real-world AS path data for major routes
const AS_PATHS = {
  "NYC-LON": ["AS6939","AS1273","AS5459","LINX"],
  "NYC-AMS": ["AS6939","AS3356","AS1200","AMS-IX"],
  "NYC-FRA": ["AS6939","AS3356","AS3356","DE-CIX"],
  "LAX-TKY": ["AS1257","AS2914","AS2497","JPIX"],
  "LAX-SIN": ["AS1257","AS3491","AS7473","SGIX"],
  "SIN-HKG": ["AS7473","AS4637","AS4637","HKIX"],
  "HKG-TKY": ["AS4637","AS2914","AS2497","JPIX"],
  "NYC-SAO": ["AS6939","AS28573","AS28573","PTT-Metro"],
  "MUM-SIN": ["AS9498","AS4755","AS7473","SGIX"],
  "FRA-DXB": ["AS3356","AS5384","AS5384","UAE-IX"],
  "LON-MOS": ["AS5459","AS1273","AS8359","MSK-IX"],
};

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function ll2v3(lat, lon, r) {
  const phi   = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

function buildArcPoints(n1, n2, segs = 80) {
  const v1 = ll2v3(n1.lat, n1.lon, R);
  const v2 = ll2v3(n2.lat, n2.lon, R);
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const v = new THREE.Vector3().lerpVectors(v1, v2, t).normalize();
    const h = Math.sin(Math.PI * t) * ARC_H;
    pts.push(v.multiplyScalar(R + h));
  }
  return pts;
}

// EWMA-based anomaly detection (α = 0.3)
const ALPHA = 0.3;
const ANOMALY_Z_THRESHOLD = 2.0;
const ENABLE_SIM_FALLBACK = false;
function ewmaUpdate(prev, cur) { return ALPHA * cur + (1 - ALPHA) * prev; }
function stdDev(arr) {
  const m = arr.reduce((a,b)=>a+b,0)/arr.length;
  return Math.sqrt(arr.reduce((s,v)=>s+(v-m)**2,0)/arr.length);
}

function latHex(ms) {
  if (ms < 50)  return 0x00e5cc;
  if (ms < 100) return 0x84cc16;
  if (ms < 150) return 0xf59e0b;
  return 0xef4444;
}
function latStr(ms) {
  if (ms < 50)  return "#00e5cc";
  if (ms < 100) return "#84cc16";
  if (ms < 150) return "#f59e0b";
  return "#ef4444";
}
function latLabel(ms) {
  if (ms < 50)  return "EXCELLENT";
  if (ms < 100) return "GOOD";
  if (ms < 150) return "DEGRADED";
  return "HIGH";
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function App() {
  const mountRef      = useRef(null);
  const rendRef       = useRef(null);
  const sceneRef      = useRef(null);
  const camRef        = useRef(null);
  const globeRef      = useRef(null);   // rotating group
  const arcMeshes     = useRef({});     // routeId → THREE.Line
  const arcPts        = useRef({});     // routeId → Vector3[]
  const packetPool    = useRef([]);     // live packet objects
  const animRef       = useRef(null);
  const latRef        = useRef(Object.fromEntries(ROUTES.map(r=>[r.id,r.base])));
  const ewmaRef       = useRef(Object.fromEntries(ROUTES.map(r=>[r.id,r.base])));
  const histRef       = useRef(Object.fromEntries(ROUTES.map(r=>[r.id,[r.base,r.base,r.base]])));
  const totalRef      = useRef(0);
  const anomCntRef    = useRef(0);
  const dragging      = useRef(false);
  const prevMX        = useRef({x:0,y:0});
  const autoRot       = useRef(true);
  const topoScript    = useRef(null);

  const [lats,        setLats]        = useState(Object.fromEntries(ROUTES.map(r=>[r.id,r.base])));
  const [bgpFeed,     setBgpFeed]     = useState([]);
  const [anomSet,     setAnomSet]     = useState(new Set());
  const [routeAsPaths,setRouteAsPaths]= useState({});
  const [stats,       setStats]       = useState({total:0, anom:0, avg:75, active:0});
  const [selRoute,    setSelRoute]    = useState(null);
  const [selNode,     setSelNode]     = useState(null);
  const [clock,       setClock]       = useState("");
  const [wsState,     setWsState]     = useState("CONNECTING");
  const [dataMode,    setDataMode]    = useState("DISCONNECTED");

  // ── THREE.JS SETUP ───────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x010b10);
    el.appendChild(renderer.domElement);
    rendRef.current = renderer;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(48, W/H, 0.1, 500);
    camera.position.z = 14;
    camRef.current = camera;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const sun = new THREE.DirectionalLight(0xffffff, 2.0);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x00e5cc, 0.35);
    rim.position.set(-18, 0, -8);
    scene.add(rim);

    const updateSunPosition = () => {
      const now = new Date();
      const start = new Date(now.getUTCFullYear(), 0, 0);
      const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      
      // Solar declination (approximate)
      const declination = -23.44 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));
      
      // Sun longitude based on UTC time
      const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
      const sunLon = (12 - utcHours) * 15;
      
      const sunPos = ll2v3(declination, sunLon, 30);
      sun.position.copy(sunPos);
    };

    // ── Stars ──
    {
      const cnt = 3500;
      const pos = new Float32Array(cnt * 3);
      for (let i = 0; i < cnt; i++) {
        const t = Math.random()*Math.PI*2, p = Math.acos(2*Math.random()-1), r = 90+Math.random()*50;
        pos[i*3]   = r*Math.sin(p)*Math.cos(t);
        pos[i*3+1] = r*Math.cos(p);
        pos[i*3+2] = r*Math.sin(p)*Math.sin(t);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({color:0xffffff,size:0.22,transparent:true,opacity:0.65})));
    }

    // ── Globe group ──
    const globe = new THREE.Group();
    scene.add(globe);
    globeRef.current = globe;

    // Earth core
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.MeshPhongMaterial({ color:0x031520, emissive:0x010a0f, shininess:25, specular:0x002233 })
    ));

    // Atmosphere
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(ATMO, 32, 32),
      new THREE.MeshPhongMaterial({
        color:0x004060, emissive:0x001525, transparent:true, opacity:0.15,
        blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.FrontSide,
      })
    ));

    // Subtle glow shell
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(R+0.04, 32, 32),
      new THREE.MeshBasicMaterial({
        color:0x00e5cc, transparent:true, opacity:0.03,
        blending:THREE.AdditiveBlending, depthWrite:false,
      })
    ));

    // ── Pre-build arc point cache & arc meshes ──
    const arcGroup = new THREE.Group();
    globe.add(arcGroup);
    ROUTES.forEach(route => {
      const n1 = NODE_MAP[route.from], n2 = NODE_MAP[route.to];
      const pts = buildArcPoints(n1, n2);
      arcPts.current[route.id] = pts;

      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: latHex(route.base), transparent:true, opacity:0.32,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geo, mat);
      arcGroup.add(line);
      arcMeshes.current[route.id] = line;
    });

    // ── Packet group ──
    const pktGroup = new THREE.Group();
    globe.add(pktGroup);

    // ── Node markers ──
    const nodeGroup = new THREE.Group();
    globe.add(nodeGroup);
    NODES.forEach(n => {
      const pos = ll2v3(n.lat, n.lon, R);
      // Pulse halo
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 8, 8),
        new THREE.MeshBasicMaterial({ color:0x00e5cc, transparent:true, opacity:0.25, blending:THREE.AdditiveBlending })
      );
      halo.position.copy(pos);
      halo.userData.phase = Math.random()*Math.PI*2;
      halo.userData.isHalo = true;
      nodeGroup.add(halo);
      // Core
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        new THREE.MeshBasicMaterial({ color:0xe0fffc })
      );
      core.position.copy(pos);
      core.userData.nodeId = n.id;
      nodeGroup.add(core);
    });

    // ── Load topojson country borders ──
    const loadBorders = (world) => {
      if (!world || !window.topojson) return;
      try {
        const borders = window.topojson.mesh(world, world.objects.countries, (a,b)=>a!==b);
        const positions = [];
        borders.coordinates.forEach(ring => {
          for (let i = 0; i < ring.length-1; i++) {
            const [lo1,la1] = ring[i], [lo2,la2] = ring[i+1];
            const v1 = ll2v3(la1,lo1,R+0.015), v2 = ll2v3(la2,lo2,R+0.015);
            positions.push(v1.x,v1.y,v1.z, v2.x,v2.y,v2.z);
          }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        globe.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({color:0x0a2f42,transparent:true,opacity:0.75})));
      } catch(e) {}
    };
    const ts = document.createElement("script");
    ts.src = "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
    ts.onload = () =>
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(r=>r.json()).then(loadBorders).catch(()=>{});
    document.head.appendChild(ts);
    topoScript.current = ts;

    // ── Mouse interaction ──
    const onDown = e => { dragging.current=true; autoRot.current=false; prevMX.current={x:e.clientX,y:e.clientY}; };
    const onMove = e => {
      if (!dragging.current) return;
      const dx=e.clientX-prevMX.current.x, dy=e.clientY-prevMX.current.y;
      globe.rotation.y += dx*0.005;
      globe.rotation.x = Math.max(-1.1, Math.min(1.1, globe.rotation.x+dy*0.003));
      prevMX.current = {x:e.clientX,y:e.clientY};
    };
    const onUp = () => { dragging.current=false; setTimeout(()=>{ autoRot.current=true; }, 2500); };
    const onWheel = e => { camera.position.z = Math.max(8,Math.min(22,camera.position.z+e.deltaY*0.018)); };
    const onResize = () => {
      const W=el.clientWidth, H=el.clientHeight;
      renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix();
    };
    el.addEventListener("mousedown",onDown);
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseup",onUp);
    el.addEventListener("wheel",onWheel,{passive:true});
    window.addEventListener("resize",onResize);

    // ── Animation loop ──
    let last = 0;
    const animate = ts => {
      animRef.current = requestAnimationFrame(animate);
      const dt = Math.min((ts-last)/1000, 0.05);
      last = ts;

      if (autoRot.current) globe.rotation.y += 0.0012;
      
      updateSunPosition();

      // Pulse node halos
      nodeGroup.children.forEach(m => {
        if (m.userData.isHalo) {
          m.userData.phase += dt*2.2;
          m.material.opacity = 0.1+Math.sin(m.userData.phase)*0.12;
          const s = 1+Math.sin(m.userData.phase*0.7)*0.55;
          m.scale.setScalar(s);
        }
      });

      // Spawn packets
      if (Math.random() < dt*14) {
        const route = ROUTES[Math.floor(Math.random()*ROUTES.length)];
        const pts = arcPts.current[route.id];
        const lat = latRef.current[route.id]||route.base;
        const geo = new THREE.SphereGeometry(0.05,5,5);
        const mat = new THREE.MeshBasicMaterial({color:latHex(lat),transparent:true,opacity:0.92,blending:THREE.AdditiveBlending});
        const mesh = new THREE.Mesh(geo,mat);
        pktGroup.add(mesh);
        totalRef.current++;
        packetPool.current.push({ routeId:route.id, progress:0, speed:0.09+Math.random()*0.17, mesh, pts });
      }

      // Move packets
      packetPool.current = packetPool.current.filter(p => {
        p.progress += p.speed*dt;
        if (p.progress>=1) { pktGroup.remove(p.mesh); p.mesh.geometry.dispose(); p.mesh.material.dispose(); return false; }
        const rawIdx = p.progress*(p.pts.length-1);
        const i = Math.min(Math.floor(rawIdx), p.pts.length-2);
        const t = rawIdx-i;
        p.mesh.position.lerpVectors(p.pts[i], p.pts[i+1], t);
        return true;
      });

      renderer.render(scene,camera);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      el.removeEventListener("mousedown",onDown);
      window.removeEventListener("mousemove",onMove);
      window.removeEventListener("mouseup",onUp);
      el.removeEventListener("wheel",onWheel);
      window.removeEventListener("resize",onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      if (ts.parentNode) document.head.removeChild(ts);
    };
  }, []);

  // ── DATA LAYER: Backend WebSocket (/ws) + fallback simulation ─────────
  useEffect(() => {
    let backendWs = null;
    let wsRetryTimer = null;
    let driftTimer = null;
    let isUnmounted = false;

    const startFallbackSimulation = () => {
      if (driftTimer) return;
      setDataMode("SIMULATED");
      driftTimer = setInterval(() => {
        const newLat = {};
        let total = 0;
        ROUTES.forEach(r => {
          const cur = latRef.current[r.id] || r.base;
          const ewma = ewmaUpdate(ewmaRef.current[r.id]||r.base, cur);
          ewmaRef.current[r.id] = ewma;
          const noised = Math.max(5, Math.round(ewma*(0.88+Math.random()*0.24)));
          newLat[r.id] = noised;
          total += noised;

          const mesh = arcMeshes.current[r.id];
          if (mesh && mesh.material.color.getHex() !== 0xff2244) {
            mesh.material.color.setHex(latHex(noised));
          }
          packetPool.current.forEach(p => {
            if (p.routeId===r.id) p.mesh.material.color.setHex(latHex(noised));
          });
          histRef.current[r.id] = [...histRef.current[r.id].slice(-19), noised];
        });
        latRef.current = {...latRef.current, ...newLat};
        setLats(prev=>({...prev,...newLat}));
        setStats({total:totalRef.current, anom:anomCntRef.current, avg:Math.round(total/ROUTES.length), active:packetPool.current.length});
      }, 2000);
    };

    const stopFallbackSimulation = () => {
      if (!driftTimer) return;
      clearInterval(driftTimer);
      driftTimer = null;
    };

    const handleBackendMessage = (raw) => {
      let msg;
      try { msg = JSON.parse(raw.data); } catch (_) { return; }

      if (msg.type === "init") {
        const seed = {};
        (msg.routes || []).forEach(route => {
          seed[route.id] = route.current ?? route.base;
          latRef.current[route.id] = seed[route.id];
          ewmaRef.current[route.id] = route.ewma ?? route.base;
          histRef.current[route.id] = [...(histRef.current[route.id] || []), seed[route.id]].slice(-20);
        });
        if (Object.keys(seed).length) setLats(prev => ({...prev, ...seed}));
        return;
      }

      if (msg.type === "latency_update") {
        const payload = msg.latencies || {};
        const newLat = {};
        let total = 0;
        Object.entries(payload).forEach(([routeId, rec]) => {
          const latency = rec.latency ?? ROUTE_MAP[routeId]?.base;
          const ewma = rec.ewma ?? latency;
          if (typeof latency !== "number") return;
          newLat[routeId] = latency;
          total += latency;
          latRef.current[routeId] = latency;
          ewmaRef.current[routeId] = ewma;
          histRef.current[routeId] = [...(histRef.current[routeId] || []), latency].slice(-20);

          const mesh = arcMeshes.current[routeId];
          if (mesh && !msg.anomalies?.includes(routeId)) {
            mesh.material.color.setHex(latHex(latency));
            mesh.material.opacity = 0.32;
          }
        });

        if (Object.keys(newLat).length) {
          setLats(prev => ({...prev, ...newLat}));
          setStats({
            total: totalRef.current,
            anom: anomCntRef.current,
            avg: Math.round(total / Object.keys(newLat).length),
            active: packetPool.current.length,
          });
        }
        setAnomSet(new Set(msg.anomalies || []));
        if (msg.source === "ripe_atlas") {
          setDataMode("BACKEND_RIPE_ATLAS");
        } else if (msg.source === "stale_hold") {
          setDataMode("BACKEND_STALE_HOLD");
        } else {
          setDataMode("BACKEND_SIMULATED");
        }
        return;
      }

      if (msg.type === "latency_source_status") {
        if (msg.status === "unavailable") {
          setDataMode("BACKEND_UNAVAILABLE");
        }
        return;
      }

      if (msg.type === "bgp_event" && msg.event) {
        const event = msg.event;
        setBgpFeed(prev => [{
          id: Date.now()+Math.random(),
          ts: event.ts ? event.ts.slice(11,19) : new Date().toISOString().slice(11,19),
          peer: event.peer || "?",
          peerAsn: event.peer_asn || "AS?",
          asPath: event.as_path || "",
          prefixes: event.prefixes || "",
          type: event.type || "UPDATE",
        }, ...prev].slice(0,18));
        return;
      }

      if (msg.type === "traceroute_path" && msg.path && msg.route_id) {
        let curvePts = [];
        if (msg.path.length >= 2) {
           for (let i = 0; i < msg.path.length - 1; i++) {
              const segPts = buildArcPoints(
                 {lat: msg.path[i].lat, lon: msg.path[i].lon}, 
                 {lat: msg.path[i+1].lat, lon: msg.path[i+1].lon}, 
                 30
              );
              curvePts.push(...segPts);
           }
        }
        
        if (curvePts.length > 0) {
            const geo = new THREE.SphereGeometry(0.08, 6, 6);
            const mat = new THREE.MeshBasicMaterial({color: 0xffaaff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending});
            const mesh = new THREE.Mesh(geo, mat);
            pktGroup.add(mesh);
            packetPool.current.push({ routeId: msg.route_id, progress: 0, speed: 0.08, mesh, pts: curvePts });
        }
        return;
      }

      if (msg.type === "route_change" && msg.route_id) {
        triggerAnomaly(msg.route_id, msg.latency, true);
        const asPath = msg.bgp_event?.as_path;
        if (asPath) {
          setRouteAsPaths(prev => ({ ...prev, [msg.route_id]: asPath }));
        }
      }
    };

    const connectWithUrl = (url, onExhausted) => {
      try {
        backendWs = new WebSocket(url);
      } catch (_) {
        onExhausted();
        return;
      }

      backendWs.onopen = () => {
        setWsState("LIVE");
        stopFallbackSimulation();
        setDataMode("BACKEND_CONNECTED");
      };
      backendWs.onmessage = handleBackendMessage;
      backendWs.onerror = () => setWsState("ERROR");
      backendWs.onclose = () => {
        if (isUnmounted) return;
        onExhausted();
      };
    };

    const connectBackend = () => {
      const scheme = window.location.protocol === "https:" ? "wss" : "ws";
      const candidates = [
        `${scheme}://${window.location.host}/ws`,
        `${scheme}://localhost:8001/ws`,
      ];
      setWsState("CONNECTING");

      let idx = 0;
      const tryNext = () => {
        if (idx < candidates.length) {
          const url = candidates[idx++];
          connectWithUrl(url, tryNext);
          return;
        }
        setWsState("RECONNECTING");
        if (ENABLE_SIM_FALLBACK) startFallbackSimulation();
        else setDataMode("DISCONNECTED");
        wsRetryTimer = setTimeout(connectBackend, 5000);
      };
      tryNext();
    };
    connectBackend();
    if (ENABLE_SIM_FALLBACK) startFallbackSimulation();

    return () => {
      isUnmounted = true;
      stopFallbackSimulation();
      clearTimeout(wsRetryTimer);
      if (backendWs) backendWs.close();
    };
  }, []);

  // Anomaly trigger (EWMA-based: spike > 2σ from history baseline)
  const triggerAnomaly = (routeId, forcedLatency = null, force = false) => {
    const hist = histRef.current[routeId]||[];
    const sd = stdDev(hist);
    const spike = forcedLatency ?? Math.round((latRef.current[routeId]||ROUTE_MAP[routeId].base) * (2.5+Math.random()*2));
    latRef.current[routeId] = spike;
    setLats(prev => ({ ...prev, [routeId]: spike }));

    // Only flag if statistically significant (z-score > 2)
    const base = hist.reduce((a,b)=>a+b,0)/(hist.length || 1);
    const z = (spike-base)/(sd||10);
    if (!force && z < ANOMALY_Z_THRESHOLD) return;

    anomCntRef.current++;
    const mesh = arcMeshes.current[routeId];
    if (mesh) { mesh.material.color.setHex(0xff2244); mesh.material.opacity=0.85; }

    setAnomSet(p => new Set([...p,routeId]));

    const recovery = 7000 + Math.random()*10000;
    setTimeout(()=>{
      latRef.current[routeId] = ROUTE_MAP[routeId].base*(0.92+Math.random()*0.16);
      setAnomSet(p=>{ const n=new Set(p); n.delete(routeId); return n; });
      if (mesh) { mesh.material.color.setHex(latHex(latRef.current[routeId])); mesh.material.opacity=0.32; }
    }, recovery);
  };

  // ── CLOCK ─────────────────────────────────────────────────────────────
  useEffect(()=>{
    const t=setInterval(()=>setClock(new Date().toUTCString().slice(0,-4)),1000);
    return ()=>clearInterval(t);
  },[]);

  const sortedRoutes = Object.entries(lats).sort((a,b)=>b[1]-a[1]);
  const avgLat = Math.round(Object.values(lats).reduce((a,b)=>a+b,0)/Object.values(lats).length||0);
  const selRouteData = selRoute ? ROUTE_MAP[selRoute] : null;

  return (
    <div style={{width:"100vw",height:"100vh",background:"#010b10",overflow:"hidden",
      fontFamily:"'Share Tech Mono',monospace",color:"#00e5cc",position:"relative",userSelect:"none"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#00e5cc22;}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.15;}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}
        @keyframes anomPulse{0%,100%{background:transparent;}50%{background:rgba(255,34,68,0.08);}}
        .feed-row{animation:fadeSlide 0.3s ease;}
        .anom-row{animation:anomPulse 1s ease infinite;}
      `}</style>

      {/* Three.js canvas */}
      <div ref={mountRef} style={{position:"absolute",inset:0,cursor:"grab"}}/>

      {/* Scanline overlay */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:4,
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,229,204,0.009) 2px,rgba(0,229,204,0.009) 4px)"}}/>

      {/* ── HEADER ── */}
      <div style={{position:"absolute",top:0,left:0,right:0,zIndex:20,
        background:"rgba(1,8,13,0.94)",borderBottom:"1px solid #0b2c3e",
        padding:"7px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",
        backdropFilter:"blur(8px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{width:5,height:5,borderRadius:"50%",background:"#00e5cc",
                boxShadow:"0 0 6px #00e5cc",animation:`blink ${1+i*0.35}s ${i*0.22}s infinite`}}/>
            ))}
          </div>
          <span style={{fontSize:11,letterSpacing:4,color:"#dff9f5"}}>NETWATCH · GLOBAL BGP MONITOR</span>
          <span style={{fontSize:7,opacity:0.28,paddingLeft:10,borderLeft:"1px solid #0b2c3e",letterSpacing:2}}>
            3D · RIPE ATLAS · REAL BGP
          </span>
        </div>
        <div style={{display:"flex",gap:20,alignItems:"center",fontSize:8}}>
          {[
            ["PACKETS",totalRef.current.toLocaleString(),"#dff9f5"],
            ["AVG RTT",`${avgLat}ms`,latStr(avgLat)],
            ["LIVE PKTS",packetPool.current.length,"#84cc16"],
            ["ANOMALIES",anomCntRef.current,anomCntRef.current>0?"#ef4444":"#00e5cc44"],
          ].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"right"}}>
              <div style={{opacity:0.32,fontSize:7,letterSpacing:1,marginBottom:1}}>{l}</div>
              <div style={{color:c,fontSize:10}}>{v}</div>
            </div>
          ))}
          <div style={{padding:"2px 8px",border:`1px solid ${wsState==="LIVE"?"#00e5cc44":"#ff224444"}`,
            color:wsState==="LIVE"?"#00e5cc":"#ff2244",fontSize:7,letterSpacing:1}}>
            BGP·{wsState}
          </div>
          <div style={{opacity:0.22,fontSize:8,paddingLeft:10,borderLeft:"1px solid #0b2c3e"}}>
            {clock} UTC
          </div>
        </div>
      </div>

      {/* ── LEFT PANEL: BGP LIVE FEED ── */}
      <div style={{position:"absolute",top:44,left:0,bottom:0,width:252,zIndex:10,
        background:"rgba(1,6,10,0.9)",borderRight:"1px solid #0b2c3e",
        display:"flex",flexDirection:"column",backdropFilter:"blur(6px)"}}>
        <div style={{padding:"9px 14px",borderBottom:"1px solid #0b2c3e",flexShrink:0}}>
          <div style={{fontSize:7,letterSpacing:3,opacity:0.3,marginBottom:3}}>▸ BGP UPDATE STREAM</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:4,height:4,borderRadius:"50%",background:wsState==="LIVE"?"#00e5cc":"#ff2244",
              boxShadow:`0 0 4px ${wsState==="LIVE"?"#00e5cc":"#ff2244"}`,
              animation:"blink 1.2s infinite"}}/>
            <span style={{fontSize:7,opacity:0.4,letterSpacing:1}}>
              {wsState==="LIVE" ? "BACKEND WS LIVE" : (ENABLE_SIM_FALLBACK ? "FALLBACK SIMULATION" : "NO FALLBACK")}
            </span>
          </div>
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {bgpFeed.length===0 && (
            <div style={{textAlign:"center",opacity:0.18,fontSize:8,marginTop:36,letterSpacing:2}}>
              AWAITING BGP STREAM...
            </div>
          )}
          {bgpFeed.map(e=>(
            <div key={e.id} className="feed-row" style={{padding:"7px 14px",borderBottom:"1px solid #05141b",fontSize:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{color:e.type==="ANNOUNCE"?"#84cc16":"#f59e0b",letterSpacing:1,fontSize:7.5}}>
                  {e.type}
                </span>
                <span style={{opacity:0.3,fontSize:7}}>{e.ts}</span>
              </div>
              <div style={{opacity:0.4,fontSize:7,marginBottom:2}}>
                PEER {e.peer} · {e.peerAsn}
              </div>
              {e.asPath && (
                <div style={{color:"#00e5cc",opacity:0.65,fontSize:7,marginBottom:2,wordBreak:"break-all",lineHeight:1.5}}>
                  {e.asPath}
                </div>
              )}
              {e.prefixes && (
                <div style={{opacity:0.28,fontSize:6.5,wordBreak:"break-all"}}>{e.prefixes}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL: ROUTE LATENCIES ── */}
      <div style={{position:"absolute",top:44,right:0,bottom:0,width:222,zIndex:10,
        background:"rgba(1,6,10,0.9)",borderLeft:"1px solid #0b2c3e",
        display:"flex",flexDirection:"column",backdropFilter:"blur(6px)"}}>
        <div style={{padding:"9px 14px",borderBottom:"1px solid #0b2c3e",flexShrink:0}}>
          <div style={{fontSize:7,letterSpacing:3,opacity:0.3}}>▸ ROUTE LATENCIES</div>
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {sortedRoutes.map(([id,lat])=>{
            const route = ROUTE_MAP[id];
            const isAnom = anomSet.has(id);
            const isSel  = selRoute===id;
            return (
              <div key={id} onClick={()=>setSelRoute(isSel?null:id)}
                className={isAnom?"anom-row":""}
                style={{padding:"5px 14px",borderBottom:"1px solid #05141b",cursor:"pointer",
                  background:isSel?"rgba(0,229,204,0.06)":"transparent",transition:"background 0.2s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:8.5,color:isAnom?"#ff2244":latStr(lat),letterSpacing:0.5}}>
                    {id.replace("-"," › ")}{isAnom?" ⚡":""}
                  </span>
                  <span style={{fontSize:9,fontWeight:"bold",color:isAnom?"#ff2244":latStr(lat)}}>{lat}ms</span>
                </div>
                <div style={{fontSize:6.5,opacity:0.22,marginTop:1}}>{route?.cable}</div>
              </div>
            );
          })}
        </div>
        <div style={{padding:"7px 14px",borderTop:"1px solid #0b2c3e",fontSize:6.5,opacity:0.22,letterSpacing:1}}>
          {dataMode==="BACKEND_RIPE_ATLAS"
            ? "● BACKEND · RIPE ATLAS"
            : dataMode==="BACKEND_UNAVAILABLE"
                ? "● BACKEND · RIPE ATLAS UNAVAILABLE"
            : dataMode==="BACKEND_STALE_HOLD"
              ? "● BACKEND · STALE HOLD (REAL-ONLY)"
            : dataMode==="BACKEND_SIMULATED"
              ? "● BACKEND · SIMULATED FALLBACK"
              : "● DISCONNECTED (NO SIM FALLBACK)"}
        </div>
      </div>

      {/* ── LEGEND ── */}
      <div style={{position:"absolute",bottom:16,left:266,zIndex:10,
        background:"rgba(1,6,10,0.9)",border:"1px solid #0b2c3e",padding:"9px 13px",fontSize:8}}>
        <div style={{opacity:0.3,letterSpacing:2,marginBottom:7,fontSize:7}}>LATENCY</div>
        {[["< 50ms","#00e5cc"],["50–100ms","#84cc16"],["100–150ms","#f59e0b"],["> 150ms","#ef4444"],["ANOMALY","#ff2244"]].map(([l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <div style={{width:18,height:2,background:c,boxShadow:`0 0 4px ${c}`}}/>
            <span style={{color:c}}>{l}</span>
          </div>
        ))}
        <div style={{marginTop:8,opacity:0.22,fontSize:6.5,borderTop:"1px solid #0b2c3e",paddingTop:7,lineHeight:1.8}}>
          DRAG: ROTATE GLOBE<br/>SCROLL: ZOOM<br/>CLICK ROUTE: AS PATH
        </div>
      </div>

      {/* ── GLOBE STATS ── */}
      <div style={{position:"absolute",top:58,left:266,zIndex:10,
        background:"rgba(1,6,10,0.9)",border:"1px solid #0b2c3e",padding:"9px 13px"}}>
        <div style={{opacity:0.3,fontSize:7,letterSpacing:2,marginBottom:4}}>IXP NODES ONLINE</div>
        <div style={{fontSize:24,color:"#dff9f5",lineHeight:1}}>{NODES.length}</div>
        <div style={{opacity:0.22,fontSize:6.5,marginTop:3}}>{ROUTES.length} ROUTES · WORLDWIDE</div>
      </div>

      {/* ── SELECTED ROUTE: AS PATH PANEL ── */}
      {selRoute && selRouteData && (
        <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",
          background:"rgba(1,6,10,0.97)",border:"1px solid #00e5cc33",
          padding:"14px 20px",zIndex:30,minWidth:440,maxWidth:560,
          boxShadow:"0 0 40px rgba(0,229,204,0.12)",backdropFilter:"blur(10px)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"#dff9f5",letterSpacing:2,marginBottom:3}}>
                {selRouteData.from} → {selRouteData.to}
              </div>
              <div style={{fontSize:7,opacity:0.3,marginBottom:10,letterSpacing:1}}>
                CABLE: {selRouteData.cable} · BASE RTT: {selRouteData.base}ms · EWMA: {Math.round(ewmaRef.current[selRoute]||selRouteData.base)}ms
              </div>
              <div style={{fontSize:7,opacity:0.3,letterSpacing:2,marginBottom:7}}>AS PATH (BGP ROUTE)</div>
              <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                {((routeAsPaths[selRoute]?.split(" → ").filter(Boolean)) || AS_PATHS[selRoute] || [
                  NODE_MAP[selRouteData.from]?.asn,
                  "AS3356",
                  NODE_MAP[selRouteData.to]?.asn,
                ]).map((as,i,arr)=>(
                  <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{padding:"3px 9px",border:"1px solid #00e5cc2a",
                      fontSize:8,color:"#00e5cc",letterSpacing:1,background:"rgba(0,229,204,0.04)"}}>{as}</span>
                    {i<arr.length-1 && <span style={{opacity:0.25,fontSize:9}}>→</span>}
                  </span>
                ))}
              </div>
              <div style={{marginTop:10,fontSize:7,opacity:0.25,letterSpacing:1}}>
                ANOMALY DETECTION: EWMA α=0.3 · Z-SCORE THRESHOLD 2.0σ
              </div>
              <LatencyChart routeId={selRoute} />
            </div>
            <div style={{textAlign:"right",marginLeft:24,flexShrink:0}}>
              <div style={{color:latStr(lats[selRoute]||selRouteData.base),fontSize:26,fontWeight:"bold",lineHeight:1}}>
                {lats[selRoute]||selRouteData.base}ms
              </div>
              <div style={{fontSize:7,opacity:0.4,marginTop:3,letterSpacing:1}}>
                {latLabel(lats[selRoute]||selRouteData.base)}
              </div>
              {anomSet.has(selRoute) && (
                <div style={{color:"#ff2244",fontSize:7,marginTop:5,animation:"blink 0.7s infinite"}}>⚡ ANOMALY</div>
              )}
            </div>
          </div>
          <div onClick={()=>setSelRoute(null)}
            style={{position:"absolute",top:10,right:14,cursor:"pointer",opacity:0.3,fontSize:11,lineHeight:1}}>✕</div>
        </div>
      )}
    </div>
  );
}
