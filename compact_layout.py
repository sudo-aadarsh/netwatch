import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Top Panel
content = content.replace('top: 24,', 'top: 12,', 1)  # Assuming the first top: 24 is the top panel
content = content.replace('padding: "12px 32px",', 'padding: "8px 24px",')
content = content.replace('width: "90%",', 'width: "94%",')

# Both Left and Right panels
content = content.replace('top: 104,', 'top: 76,')
content = content.replace('bottom: 24,', 'bottom: 12,')

# Left Panel specifically
content = content.replace('left: 24,', 'left: 12,')
content = content.replace('width: 320,', 'width: 270,')

# Right Panel specifically
content = content.replace('right: 24,', 'right: 12,')
content = content.replace('width: 280,', 'width: 270,')

# Left Panel inner padding tweaks for compactness
content = content.replace('padding: "24px",', 'padding: "16px",')
content = content.replace('padding: "14px 16px",', 'padding: "10px 12px",')
content = content.replace('marginBottom: 10,', 'marginBottom: 6,')
content = content.replace('marginBottom: 8,', 'marginBottom: 4,')

# Right panel inner padding tweaks for compactness
content = content.replace('padding: "10px 16px",', 'padding: "8px 12px",')

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
