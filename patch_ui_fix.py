import sys

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

start_idx = content.find('\n  return (\n    <div')

if start_idx == -1:
    print("Could not find start index")
    sys.exit(1)

new_jsx = """
  return (
    <div style={{width:"100vw",height:"100vh",background:"#030b14",overflow:"hidden",
      fontFamily:"'Inter', sans-serif",color:"#e2f1f8",position:"relative",userSelect:"none"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar {width:4px;}
        ::-webkit-scrollbar-track {background: transparent;}
        ::-webkit-scrollbar-thumb {background: rgba(0, 229, 204, 0.2); border-radius: 4px;}
        ::-webkit-scrollbar-thumb:hover {background: rgba(0, 229, 204, 0.5);}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
        @keyframes floatIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
        @keyframes anomPulse{0%,100%{background:transparent;}50%{background:rgba(255,34,68,0.15);}}
        .feed-row{animation:floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);}
        .anom-row{animation:anomPulse 1s ease infinite;}
        .glass-panel {
          background: rgba(10, 20, 30, 0.45);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .data-font { font-family: 'JetBrains Mono', monospace; }
        .gradient-text {
          background: linear-gradient(90deg, #00e5cc, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Three.js canvas */}
      <div ref={mountRef} style={{position:"absolute",inset:0,cursor:"grab"}}/>

      {/* Subtle vignette/gradient overlay */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:4,
        background:"radial-gradient(circle at center, transparent 40%, rgba(1, 6, 15, 0.75) 100%)"}}/>

      {/* ── HEADER PILL ── */}
      <div className="glass-panel" style={{position:"absolute",top:24,left:"50%",transform:"translateX(-50%)",zIndex:20,
        padding:"12px 32px",display:"flex",alignItems:"center",justifyContent:"space-between", gap: 40,
        width: "90%", maxWidth: 1300, borderRadius: 24 }}>
        
        {/* LOGO & TITLE */}
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#00e5cc",
                boxShadow:"0 0 10px #00e5cc",animation:`blink ${1+i*0.35}s ${i*0.22}s infinite`}}/>
            ))}
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,letterSpacing:3}} className="gradient-text">NETWATCH</div>
            <div style={{fontSize:9,opacity:0.5,letterSpacing:2,marginTop:2,fontWeight:500}}>GLOBAL BGP MONITOR</div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={{position:"relative", flex: 1, maxWidth: 360}}>
          <input 
            type="text" 
            placeholder="Search country or node..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#e2f1f8", padding: "10px 20px", fontSize: 13, outline: "none",
              borderRadius: 30, width: "100%", transition: "all 0.3s ease", fontWeight:500
            }}
            onFocus={e => { e.target.style.borderColor = "rgba(0, 229, 204, 0.5)"; e.target.style.background = "rgba(0, 229, 204, 0.05)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.target.style.background = "rgba(255, 255, 255, 0.04)"; }}
          />
          {searchResults.length > 0 && (
            <div className="glass-panel" style={{
              position:"absolute", top:"calc(100% + 10px)", left:0, width:"100%",
              maxHeight: 300, overflowY:"auto", zIndex: 100, padding: 8, borderRadius: 16
            }}>
              {searchResults.map(res => (
                <div key={res.id} 
                  onClick={() => handleSearchSelect(res.id)}
                  style={{padding:"12px 16px", borderRadius: 10, cursor:"pointer", transition: "all 0.2s"}}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0, 229, 204, 0.1)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{color:"#00e5cc", fontWeight:600, fontSize: 13, marginBottom:4}}>{res.country}</div>
                  <div style={{opacity:0.6, fontSize: 11, fontWeight:500}}>{res.name} <span className="data-font" style={{opacity:0.8}}>({res.id})</span></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATS */}
        <div style={{display:"flex",gap:32,alignItems:"center"}}>
          {[
            ["PACKETS",totalRef.current.toLocaleString(),"#e2f1f8"],
            ["AVG RTT",`${avgLat}ms`,latStr(avgLat)],
            ["LIVE PKTS",packetPool.current.length,"#10b981"],
            ["ANOMALIES",anomCntRef.current,anomCntRef.current>0?"#f43f5e":"rgba(255,255,255,0.3)"],
          ].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"right"}}>
              <div style={{opacity:0.5,fontSize:9,letterSpacing:1.5,marginBottom:4,fontWeight:600}}>{l}</div>
              <div className="data-font" style={{color:c,fontSize:16,fontWeight:700}}>{v}</div>
            </div>
          ))}
          
          <div style={{display:"flex", flexDirection: "column", alignItems: "flex-end", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 24}}>
             <div style={{display: "flex", alignItems: "center", gap: 6, marginBottom: 4}}>
                <div style={{width: 8, height: 8, borderRadius: "50%", background: wsState==="LIVE"?"#10b981":"#f43f5e", boxShadow: `0 0 10px ${wsState==="LIVE"?"#10b981":"#f43f5e"}`}}/>
                <div style={{color:wsState==="LIVE"?"#10b981":"#f43f5e",fontSize:10,fontWeight:700,letterSpacing:1}}>
                  {wsState}
                </div>
             </div>
             <div className="data-font" style={{opacity:0.4,fontSize:11,fontWeight:500}}>
               {clock}
             </div>
          </div>
        </div>
      </div>

      {/* ── LEFT PANEL: BGP LIVE FEED ── */}
      <div className="glass-panel" style={{position:"absolute",top:104,left:24,bottom:24,width:340,zIndex:10,
        display:"flex",flexDirection:"column", padding: "0", overflow: "hidden"}}>
        <div style={{padding:"24px", borderBottom:"1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)"}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:2, opacity:0.9}}>LIVE BGP STREAM</div>
          <div style={{fontSize:11, opacity:0.5, marginTop: 6, fontWeight:500}}>REAL-TIME ROUTING EVENTS</div>
        </div>
        <div style={{flex:1,overflow:"auto", padding: 12}}>
          {bgpFeed.length===0 && (
            <div style={{textAlign:"center",opacity:0.3,fontSize:11,marginTop:40,letterSpacing:1, fontWeight:500}}>
              AWAITING BGP EVENTS...
            </div>
          )}
          {bgpFeed.map(e=>(
            <div key={e.id} className="feed-row" style={{padding:"14px 16px", marginBottom: 10, background: "rgba(255,255,255,0.03)", borderRadius: 14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8, alignItems: "center"}}>
                <span style={{
                  color:e.type==="ANNOUNCE"?"#10b981":"#f59e0b",
                  background: e.type==="ANNOUNCE"?"rgba(16, 185, 129, 0.15)":"rgba(245, 158, 11, 0.15)",
                  padding: "4px 10px", borderRadius: 12,
                  letterSpacing:1,fontSize:9, fontWeight: 700
                }}>
                  {e.type}
                </span>
                <span className="data-font" style={{opacity:0.4,fontSize:10}}>{e.ts}</span>
              </div>
              <div style={{opacity:0.9,fontSize:12,marginBottom:8, fontWeight: 600}}>
                Peer {e.peer} <span style={{opacity: 0.3}}>·</span> <span className="data-font" style={{color:"#00e5cc"}}>{e.peerAsn}</span>
              </div>
              {e.asPath && (
                <div className="data-font" style={{color:"#3b82f6",opacity:0.9,fontSize:11,marginBottom:8,wordBreak:"break-all",lineHeight:1.5}}>
                  {e.asPath}
                </div>
              )}
              {e.prefixes && (
                <div className="data-font" style={{opacity:0.5,fontSize:10,wordBreak:"break-all"}}>{e.prefixes}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL: ROUTE LATENCIES ── */}
      <div className="glass-panel" style={{position:"absolute",top:104,right:24,bottom:24,width:340,zIndex:10,
        display:"flex",flexDirection:"column", padding: "0", overflow: "hidden"}}>
        <div style={{padding:"24px", borderBottom:"1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)"}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:2, opacity:0.9}}>GLOBAL LATENCY MAP</div>
          <div style={{fontSize:11, opacity:0.5, marginTop: 6, fontWeight:500}}>LIVE & ESTIMATED RTT</div>
        </div>
        <div style={{flex:1,overflow:"auto", padding: "12px 0"}}>
          {sortedRoutes.map(([id,lat])=>{
            const route = ROUTE_MAP[id];
            const isAnom = anomSet.has(id);
            const isSel  = selRoute===id;
            return (
              <div key={id} onClick={()=>setSelRoute(isSel?null:id)}
                className={isAnom?"anom-row":""}
                style={{padding:"14px 24px", cursor:"pointer", transition:"all 0.2s",
                  background:isSel?"rgba(0,229,204,0.1)":"transparent",
                  borderLeft: isSel ? "4px solid #00e5cc" : "4px solid transparent"
                }}
                onMouseEnter={e => !isSel && (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => !isSel && (e.currentTarget.style.background = "transparent")}
              >
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13, fontWeight: 600, color:isAnom?"#f43f5e":"#e2f1f8",letterSpacing:0.5}}>
                    {id.replace("-"," › ")}{isAnom?" ⚡":""}
                  </span>
                  <span className="data-font" style={{fontSize:14,fontWeight:"bold",color:isAnom?"#f43f5e":latStr(lat)}}>{lat} ms</span>
                </div>
                <div style={{fontSize:11,opacity:0.4,marginTop:6, fontWeight:500}}>{route?.cable || "Global Mesh"}</div>
              </div>
            );
          })}
        </div>
        <div style={{padding:"14px 24px",borderTop:"1px solid rgba(255,255,255,0.08)",fontSize:10,opacity:0.5,letterSpacing:1, fontWeight:600, background: "rgba(0,0,0,0.2)"}}>
          {dataMode==="BACKEND_RIPE_ATLAS"
            ? "● BACKEND · RIPE ATLAS"
            : dataMode==="BACKEND_UNAVAILABLE"
                ? "● BACKEND · UNAVAILABLE"
            : dataMode==="BACKEND_STALE_HOLD"
              ? "● BACKEND · STALE HOLD"
            : dataMode==="BACKEND_SIMULATED"
              ? "● SIMULATED FALLBACK"
              : "● DISCONNECTED"}
        </div>
      </div>

      {/* ── LEGEND ── */}
      <div className="glass-panel" style={{position:"absolute",bottom:24,left:384,zIndex:10,
        padding:"20px 24px"}}>
        <div style={{opacity:0.5,letterSpacing:1.5,marginBottom:14,fontSize:11, fontWeight: 700}}>LATENCY LEGEND</div>
        <div style={{display: "flex", gap: 24}}>
          {[["< 50ms","#00e5cc"],["50–100ms","#10b981"],["100–150ms","#f59e0b"],["> 150ms","#f43f5e"]].map(([l,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:c,boxShadow:`0 0 10px ${c}`}}/>
              <span className="data-font" style={{color:c, fontSize: 12, fontWeight: 600}}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── GLOBE STATS ── */}
      <div className="glass-panel" style={{position:"absolute",top:104,left:384,zIndex:10,
        padding:"20px 28px"}}>
        <div style={{opacity:0.5,fontSize:11,letterSpacing:1.5,marginBottom:8, fontWeight: 700}}>ACTIVE GLOBE NODES</div>
        <div className="data-font" style={{fontSize:32,color:"#00e5cc",fontWeight: 700}}>{NODES.length}</div>
        <div style={{opacity:0.4,fontSize:11,marginTop:6, fontWeight: 600}}>{ROUTES.length} ROUTES WORLDWIDE</div>
      </div>

      {/* ── SELECTED ROUTE: AS PATH PANEL ── */}
      {selRoute && selRouteData && (
        <div className="glass-panel" style={{position:"absolute",bottom:104,left:"50%",transform:"translateX(-50%)",
          padding:"28px",zIndex:30,minWidth:560,maxWidth:640}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:18,color:"#fff",fontWeight: 700,letterSpacing:1,marginBottom:8}}>
                {selRouteData.from} → {selRouteData.to}
              </div>
              <div style={{fontSize:12,opacity:0.6,marginBottom:20,letterSpacing:0.5, fontWeight:500}}>
                CABLE: <span style={{color:"#00e5cc"}}>{selRouteData.cable}</span> &nbsp;·&nbsp; BASE RTT: {selRouteData.base}ms
              </div>
              <div style={{fontSize:11,opacity:0.5,letterSpacing:1.5,marginBottom:10, fontWeight: 700}}>BGP AS PATH</div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                {((routeAsPaths[selRoute]?.split(" → ").filter(Boolean)) || AS_PATHS[selRoute] || [
                  NODE_MAP[selRouteData.from]?.asn,
                  "AS3356",
                  NODE_MAP[selRouteData.to]?.asn,
                ]).map((as,i,arr)=>(
                  <span key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                    <span className="data-font" style={{padding:"6px 12px",borderRadius: 10,
                      fontSize:12,color:"#00e5cc",background:"rgba(0,229,204,0.1)", border: "1px solid rgba(0,229,204,0.2)", fontWeight:600}}>{as}</span>
                    {i<arr.length-1 && <span style={{opacity:0.3,fontSize:14}}>→</span>}
                  </span>
                ))}
              </div>
              <div style={{marginTop:24}}>
                <LatencyChart routeId={selRoute} />
              </div>
            </div>
            <div style={{textAlign:"right",marginLeft:36,flexShrink:0}}>
              <div className="data-font" style={{color:latStr(lats[selRoute]||selRouteData.base),fontSize:42,fontWeight:"bold",lineHeight:1}}>
                {lats[selRoute]||selRouteData.base}<span style={{fontSize: 20}}>ms</span>
              </div>
              <div style={{fontSize:12,opacity:0.5,marginTop:8,letterSpacing:0.5, fontWeight: 600}}>
                {latLabel(lats[selRoute]||selRouteData.base)}
              </div>
              {anomSet.has(selRoute) && (
                <div style={{color:"#f43f5e",fontSize:12,marginTop:14,fontWeight: 700,letterSpacing:1,animation:"blink 0.7s infinite"}}>⚡ ANOMALY DETECTED</div>
              )}
            </div>
          </div>
          <div onClick={()=>setSelRoute(null)}
            style={{position:"absolute",top:20,right:24,cursor:"pointer",opacity:0.4,fontSize:20,transition:"opacity 0.2s"}}
            onMouseEnter={e=>e.target.style.opacity=1} onMouseLeave={e=>e.target.style.opacity=0.4}
            >✕</div>
        </div>
      )}

      {/* ── NODE TOOLTIP ── */}
      {hoveredNodeId && NODE_MAP[hoveredNodeId] && (
        <div className="glass-panel" ref={tooltipRef} style={{
          position: "absolute", zIndex: 100, pointerEvents: "none",
          padding: "16px 20px", minWidth: "220px", borderRadius: 16
        }}>
          <div style={{fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#fff"}}>
            {NODE_MAP[hoveredNodeId].country}
          </div>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 8}}>
            <span style={{fontSize: 12, opacity: 0.6, fontWeight: 500}}>City</span>
            <span style={{fontSize: 12, fontWeight: 600}}>{NODE_MAP[hoveredNodeId].name}</span>
          </div>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 8}}>
            <span style={{fontSize: 12, opacity: 0.6, fontWeight: 500}}>Region</span>
            <span style={{fontSize: 12, fontWeight: 600}}>{NODE_MAP[hoveredNodeId].region}</span>
          </div>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 14}}>
            <span style={{fontSize: 12, opacity: 0.6, fontWeight: 500}}>ASN</span>
            <span className="data-font" style={{fontSize: 12, color: "#00e5cc", fontWeight: 600}}>{NODE_MAP[hoveredNodeId].asn}</span>
          </div>
          <div style={{borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <span style={{fontSize: 11, opacity: 0.5, fontWeight: 500}}>Connected Routes</span>
            <span className="data-font" style={{fontSize: 14, color: "#00e5cc", fontWeight: "bold"}}>
              {ROUTES.filter(r => r.from === hoveredNodeId || r.to === hoveredNodeId).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
"""

content = content[:start_idx] + new_jsx

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)

print("Fixed UI parsing error")
