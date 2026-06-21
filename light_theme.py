import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Make the app text dark
content = content.replace('color: "#f8f5fa"', 'color: "#1e293b"')

# Change glass-panel background to light frosted glass
content = content.replace('background: rgba(20, 10, 45, 0.6);', 'background: rgba(255, 255, 255, 0.75);')
content = content.replace('border: 1px solid rgba(255, 100, 200, 0.15);', 'border: 1px solid rgba(255, 255, 255, 0.6);')
content = content.replace('box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);', 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);')

# Subtle vignette / background overlay
content = content.replace('rgba(5, 2, 17, 0.75)', 'rgba(255, 255, 255, 0.1)')

# Headers background inside panels
content = content.replace('background: "rgba(0,0,0,0.2)"', 'background: "rgba(255,255,255,0.4)"')
content = content.replace('background: "rgba(0,0,0,0.3)"', 'background: "rgba(255,255,255,0.5)"')
content = content.replace('borderBottom: "1px solid rgba(255,255,255,0.08)"', 'borderBottom: "1px solid rgba(0,0,0,0.05)"')
content = content.replace('borderTop: "1px solid rgba(255,255,255,0.08)"', 'borderTop: "1px solid rgba(0,0,0,0.05)"')

# General text color overrides
content = content.replace('color: "#f8f5fa"', 'color: "#1e293b"')
content = content.replace('color: "#e2f1f8"', 'color: "#334155"')
content = content.replace('color: "#fff"', 'color: "#0f172a"')
content = content.replace('color: "#ffffff"', 'color: "#0f172a"')

# Feed row hover
content = content.replace('rgba(255,255,255,0.03)', 'rgba(0,0,0,0.03)')
content = content.replace('rgba(255,255,255,0.04)', 'rgba(0,0,0,0.04)')

# Primary colors adjustments (from deep pink/violet to vibrant blue/teal for light mode)
content = content.replace('#d946ef', '#2563eb') # Violet to Blue
content = content.replace('#8b5cf6', '#0ea5e9') # Indigo to Sky Blue
content = content.replace('rgba(217, 70, 239', 'rgba(37, 99, 235')
content = content.replace('rgba(139, 92, 246', 'rgba(14, 165, 233')

# Pink/orange for anomalies can stay or be adjusted
content = content.replace('#ec4899', '#10b981') # Announce green
content = content.replace('rgba(236, 72, 153', 'rgba(16, 185, 129')

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
