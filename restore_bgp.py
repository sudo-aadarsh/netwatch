import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

bgp_panel = '''      <div
        className="glass-panel"
        style={{
          position: "absolute",
          top: 104,
          left: 24,
          bottom: 24,
          width: 320,
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
            borderBottom: "1px solid rgba(0,229,204,0.1)",
            background: "rgba(0,0,0,0.4)",
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
                    color: e.type === "ANNOUNCE" ? "#10b981" : "#f59e0b",
                    background:
                      e.type === "ANNOUNCE"
                        ? "rgba(16, 185, 129, 0.15)"
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
                <span className="data-font" style={{ color: "#00e5cc" }}>
                  {e.peerAsn}
                </span>
              </div>
              {e.asPath && (
                <div
                  className="data-font"
                  style={{
                    color: "#3b82f6",
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
                  width: "100%",
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

# Replace the tiny legend panel with the full BGP feed + Legend panel
regex = r'<div\s+className="glass-panel"\s+style={{\s*position: "absolute",\s*bottom: 24,\s*left: 24,\s*width: 260,.*?>.*?LATENCY LEGEND.*?</div>\s*</div>\s*</div>'
content = re.sub(regex, bgp_panel, content, flags=re.DOTALL)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
