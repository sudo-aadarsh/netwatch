import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# 1. Update the stats in the header to include Nodes and Routes
# Replace the old stats array
old_stats = '''          {[
            ["PACKETS", totalRef.current.toLocaleString(), "#f8f5fa"],
            ["AVG RTT", `${avgLat}ms`, latStr(avgLat)],
            ["LIVE PKTS", packetPool.current.length, "#a855f7"],
            [
              "ANOMALIES",
              anomCntRef.current,
              anomCntRef.current > 0 ? "#f43f5e" : "rgba(0,0,0,0.3)",
            ],
          ].map(([l, v, c]) => ('''

new_stats = '''          {[
            ["NODES", NODES.length, "#00e5cc"],
            ["ROUTES", ROUTES.length, "#3b82f6"],
            ["PACKETS", totalRef.current.toLocaleString(), "#f8f5fa"],
            ["AVG RTT", `${avgLat}ms`, latStr(avgLat)],
            [
              "ANOMALIES",
              anomCntRef.current,
              anomCntRef.current > 0 ? "#f43f5e" : "rgba(255,255,255,0.3)",
            ],
          ].map(([l, v, c]) => ('''
content = content.replace(old_stats, new_stats)

# 2. Change Left Panel (BGP Feed) to just be the Latency Legend
old_left_panel = '''      <div
        className="glass-panel"
        style={{
          position: "absolute",
          top: 104,
          left: 24,
          bottom: 24,
          width: 340,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          padding: "0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            background: "rgba(255,255,255,0.4)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              opacity: 0.9,
            }}
          >
            LIVE BGP STREAM
          </div>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 12,
          }}
        >
          {bgpFeed.length === 0 && (
            <div
              style={{
                textAlign: "center",
                opacity: 0.3,
                fontSize: 11,
                marginTop: 40,
                letterSpacing: 1,
                fontWeight: 500,
              }}
            >
              AWAITING BGP EVENTS...
            </div>
          )}
          {bgpFeed.map((e) => (
            <div
              key={e.id}
              className="feed-row"
              style={{
                padding: "14px 16px",
                marginBottom: 10,
                background: "rgba(255,255,255,0.03)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: e.type === "ANNOUNCE" ? "#ec4899" : "#f59e0b",
                    background:
                      e.type === "ANNOUNCE"
                        ? "rgba(236, 72, 153, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                    padding: "4px 10px",
                    borderRadius: 12,
                    letterSpacing: 1,
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {e.type}
                </span>
                <span
                  className="data-font"
                  style={{ opacity: 0.4, fontSize: 10 }}
                >
                  {e.ts}
                </span>
              </div>
              <div
                style={{
                  opacity: 0.9,
                  fontSize: 12,
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Peer {e.peer} <span style={{ opacity: 0.3 }}>·</span>{" "}
                <span className="data-font" style={{ color: "#d946ef" }}>
                  {e.peerAsn}
                </span>
              </div>
              {e.asPath && (
                <div
                  className="data-font"
                  style={{
                    color: "#8b5cf6",
                    opacity: 0.9,
                    fontSize: 11,
                    marginBottom: 8,
                    wordBreak: "break-all",
                    lineHeight: 1.5,
                  }}
                >
                  {e.asPath}
                </div>
              )}
              <div
                className="data-font"
                style={{
                  opacity: 0.6,
                  fontSize: 10,
                  wordBreak: "break-all",
                  lineHeight: 1.4,
                }}
              >
                {e.prefixes}
              </div>
            </div>
          ))}
        </div>
        <div
          className="glass-panel"
          style={{
            margin: 12,
            padding: "16px 20px",
            border: "none",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              opacity: 0.5,
              letterSpacing: 1.5,
              marginBottom: 14,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            LATENCY LEGEND
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              ["< 50ms", "#00e5cc"],
              ["50–100ms", "#10b981"],
              ["100–150ms", "#f59e0b"],
              ["> 150ms", "#f43f5e"],
            ].map(([l, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "calc(50% - 6px)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                    boxShadow: `0 0 10px ${c}`,
                  }}
                />
                <span
                  className="data-font"
                  style={{ color: c, fontSize: 11, fontWeight: 600 }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>'''

new_left_panel = '''      <div
        className="glass-panel"
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          width: 320,
          zIndex: 10,
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            opacity: 0.5,
            letterSpacing: 1.5,
            marginBottom: 14,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          LATENCY LEGEND
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[
            ["< 50ms", "#00e5cc"],
            ["50–100ms", "#10b981"],
            ["100–150ms", "#f59e0b"],
            ["> 150ms", "#f43f5e"],
          ].map(([l, c]) => (
            <div
              key={l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "calc(50% - 6px)",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: c,
                  boxShadow: `0 0 10px ${c}`,
                }}
              />
              <span
                className="data-font"
                style={{ color: c, fontSize: 11, fontWeight: 600 }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>'''
# Ensure it replaces properly
content = re.sub(r'<div\s+className="glass-panel"\s+style={{\s*position: "absolute",\s*top: 104,\s*left: 24,\s*bottom: 24,\s*width: 340,.*?AWAITING BGP EVENTS.*?</div>\s*</div>\s*</div>', new_left_panel, content, flags=re.DOTALL)

# 3. Change Right Panel width from 340 to 280, and remove the embedded ACTIVE NODES stats
content = content.replace('width: 340', 'width: 280')

stats_to_remove_regex = r'<div\s+style={{\s*padding: "20px 24px"[^>]*>.*?ACTIVE NODES.*?ROUTES.*?</div>\s*</div>\s*</div>'
content = re.sub(stats_to_remove_regex, '', content, flags=re.DOTALL)

content = content.replace('padding: "14px 24px"', 'padding: "10px 16px"')

# 4. Color Palette changes: Back to original Teal/Cyan Hacker aesthetic but highly polished
content = content.replace('color: "#d946ef"', 'color: "#00e5cc"')
content = content.replace('color: "#f8f5fa"', 'color: "#e2f1f8"')
content = content.replace('background: "#050211"', 'background: "#030b14"')
content = content.replace('rgba(20, 10, 45, 0.6)', 'rgba(10, 15, 25, 0.4)')
content = content.replace('rgba(255, 100, 200, 0.15)', 'rgba(0, 229, 204, 0.15)')
content = content.replace('rgba(255, 100, 200, 0.2)', 'rgba(0, 229, 204, 0.2)')
content = content.replace('rgba(255, 100, 200, 0.5)', 'rgba(0, 229, 204, 0.5)')
content = content.replace('#d946ef', '#00e5cc')
content = content.replace('#8b5cf6', '#3b82f6')
content = content.replace('#ec4899', '#10b981')
content = content.replace('rgba(217, 70, 239', 'rgba(0, 229, 204')
content = content.replace('rgba(236, 72, 153', 'rgba(16, 185, 129')

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
