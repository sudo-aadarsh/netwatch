import sys

with open('src/App.jsx', 'r') as f:
    content = f.read()

with open('/tmp/nodes.js', 'r') as f:
    nodes_str = f.read()

# 1. Insert ALL_NODES
if "const ALL_NODES" not in content:
    content = content.replace('const NODES = [', nodes_str + '\n\nconst NODES = [\n  ...ALL_NODES,')

# 2. State
state_str = """  const [wsState,     setWsState]     = useState("CONNECTING");
  const [dataMode,    setDataMode]    = useState("DISCONNECTED");
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const tooltipRef    = useRef(null);
  const [searchTerm, setSearchTerm]   = useState("");
  const [searchResults, setSearchResults] = useState([]);"""

content = content.replace("""  const [wsState,     setWsState]     = useState("CONNECTING");
  const [dataMode,    setDataMode]    = useState("DISCONNECTED");
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const tooltipRef    = useRef(null);""", state_str)

# 3. useEffect for search and handleSearchSelect
search_logic = """  const selRouteData = selRoute ? ROUTE_MAP[selRoute] : null;

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const q = searchTerm.toLowerCase();
    setSearchResults(NODES.filter(n => 
      n.name.toLowerCase().includes(q) || 
      (n.country && n.country.toLowerCase().includes(q)) ||
      n.id.toLowerCase().includes(q)
    ).slice(0, 8));
  }, [searchTerm]);

  const handleSearchSelect = (nodeId) => {
    const node = NODE_MAP[nodeId];
    if (node && globeRef.current) {
      globeRef.current.rotation.y = -(node.lon + 90) * (Math.PI / 180);
      globeRef.current.rotation.x = node.lat * (Math.PI / 180);
      setSelRoute(null);
    }
    setSearchTerm("");
    setSearchResults([]);
  };
"""

content = content.replace("  const selRouteData = selRoute ? ROUTE_MAP[selRoute] : null;", search_logic)

# 4. UI
ui_str = """          <span style={{fontSize:7,opacity:0.28,paddingLeft:10,borderLeft:"1px solid #0b2c3e",letterSpacing:2}}>
            3D · RIPE ATLAS · REAL BGP
          </span>
          <div style={{position:"relative", marginLeft: 20}}>
            <input 
              type="text" 
              placeholder="SEARCH COUNTRY/NODE..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: "rgba(0, 229, 204, 0.05)", border: "1px solid #0b2c3e",
                color: "#00e5cc", padding: "4px 8px", fontSize: 9, outline: "none",
                width: 160, letterSpacing: 1
              }}
            />
            {searchResults.length > 0 && (
              <div style={{
                position:"absolute", top:"100%", left:0, width:"100%",
                background:"rgba(1,8,13,0.95)", border:"1px solid #0b2c3e",
                maxHeight: 200, overflowY:"auto", zIndex: 100
              }}>
                {searchResults.map(res => (
                  <div key={res.id} 
                    onClick={() => handleSearchSelect(res.id)}
                    style={{padding:"6px 8px", fontSize: 8, cursor:"pointer", borderBottom:"1px solid #05141b"}}>
                    <div style={{color:"#00e5cc", fontWeight:"bold", marginBottom:2}}>{res.country}</div>
                    <div style={{opacity:0.7}}>{res.name} ({res.id})</div>
                  </div>
                ))}
              </div>
            )}
          </div>"""

content = content.replace("""          <span style={{fontSize:7,opacity:0.28,paddingLeft:10,borderLeft:"1px solid #0b2c3e",letterSpacing:2}}>
            3D · RIPE ATLAS · REAL BGP
          </span>""", ui_str)

with open('src/App.jsx', 'w') as f:
    f.write(content)
print("Patched App.jsx successfully!")
