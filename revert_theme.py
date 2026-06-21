import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Make the app text light again
content = content.replace('color: "#1e293b"', 'color: "#f8f5fa"')
content = content.replace('color: "#334155"', 'color: "#e2f1f8"')
content = content.replace('color: "#0f172a"', 'color: "#fff"')

# Revert glass-panel background to deep violet frosted glass
content = content.replace('background: rgba(255, 255, 255, 0.75);', 'background: rgba(20, 10, 45, 0.6);')
content = content.replace('border: 1px solid rgba(255, 255, 255, 0.6);', 'border: 1px solid rgba(255, 100, 200, 0.15);')
content = content.replace('box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);', 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);')

# Subtle vignette / background overlay
content = content.replace('rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.08)')
content = content.replace('radial-gradient(circle at center, transparent 40%, rgba(255, 255, 255, 0.08) 100%)', 'radial-gradient(circle at center, transparent 40%, rgba(5, 2, 17, 0.75) 100%)')

# Headers background inside panels
content = content.replace('background: "rgba(255,255,255,0.4)"', 'background: "rgba(0,0,0,0.2)"')
content = content.replace('background: "rgba(255,255,255,0.5)"', 'background: "rgba(0,0,0,0.3)"')
content = content.replace('borderBottom: "1px solid rgba(0,0,0,0.05)"', 'borderBottom: "1px solid rgba(255,255,255,0.08)"')
content = content.replace('borderTop: "1px solid rgba(0,0,0,0.05)"', 'borderTop: "1px solid rgba(255,255,255,0.08)"')
content = content.replace('borderTop: "1px solid rgba(0,0,0,0.1)"', 'borderTop: "1px solid rgba(255,255,255,0.08)"')

# Feed row hover
content = content.replace('rgba(0,0,0,0.03)', 'rgba(255,255,255,0.03)')
content = content.replace('rgba(0,0,0,0.04)', 'rgba(255,255,255,0.04)')

# Primary colors adjustments
content = content.replace('#2563eb', '#d946ef') 
content = content.replace('#0ea5e9', '#8b5cf6') 
content = content.replace('rgba(37, 99, 235', 'rgba(217, 70, 239')
content = content.replace('rgba(14, 165, 233', 'rgba(139, 92, 246')

# Announce back to pink
content = content.replace('#10b981', '#ec4899') 
content = content.replace('rgba(16, 185, 129', 'rgba(236, 72, 153')

# Cyan back to #00e5cc
content = content.replace('#0284c7', '#00e5cc')
content = content.replace('rgba(2,132,199', 'rgba(0,229,204')
content = content.replace('rgba(2, 132, 199', 'rgba(0, 229, 204')

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
