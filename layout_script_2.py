import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Fix stray colors from the sky-blue/light theme transition
content = content.replace('#0ea5e9', '#00e5cc')
content = content.replace('rgba(14, 165, 233', 'rgba(0, 229, 204')
content = content.replace('#f8f5fa', '#e2f1f8') # Ensure text color is standard cool white

# Ensure Right Panel background headers match the dark cyan theme
content = content.replace('background: "rgba(0,0,0,0.4)"', 'background: "rgba(0,0,0,0.2)"')

# Make Latency Legend on the left smaller to match the "give more space" requirement
content = content.replace('width: 320,', 'width: 260,')
content = content.replace('width: "calc(50% - 6px)",', 'width: "100%",') # Stack legend items to make it narrow

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
