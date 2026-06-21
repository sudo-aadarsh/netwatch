import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Fix borders and dividers inside glass panels
content = content.replace('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)')
content = content.replace('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)')
content = content.replace('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)')
content = content.replace('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)')
content = content.replace('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)')

# Cyan adjustments for better contrast on light mode
content = content.replace('#00e5cc', '#0284c7')
content = content.replace('rgba(0,229,204', 'rgba(2,132,199')
content = content.replace('rgba(0, 229, 204', 'rgba(2, 132, 199')

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
