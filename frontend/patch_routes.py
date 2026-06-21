import math
import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Extract nodes
node_pattern = re.compile(r'\{\s*id\s*:\s*"([^"]+)",[^}]+lat\s*:\s*([-0-9.]+),\s*lon\s*:\s*([-0-9.]+)')
nodes = []
for match in node_pattern.finditer(content):
    nid = match.group(1)
    if "-" in nid: continue
    try:
        lat = float(match.group(2))
        lon = float(match.group(3))
        nodes.append({'id': nid, 'lat': lat, 'lon': lon})
    except:
        pass

# Deduplicate
seen = set()
unique_nodes = []
for n in nodes:
    if n['id'] not in seen:
        seen.add(n['id'])
        unique_nodes.append(n)
nodes = unique_nodes

def dist(n1, n2):
    return math.sqrt((n1['lat'] - n2['lat'])**2 + (n1['lon'] - n2['lon'])**2)

hubs = set(["NYC", "LON", "SIN", "FRA", "DXB", "SYD", "SAO", "JNB", "TKY"])

new_routes = []
existing_routes = set()

route_pattern = re.compile(r'from\s*:\s*"([^"]+)",\s*to\s*:\s*"([^"]+)"')
for match in route_pattern.finditer(content):
    u, v = match.group(1), match.group(2)
    existing_routes.add(f"{u}-{v}")
    existing_routes.add(f"{v}-{u}")

def add_route(u, v):
    r_id = f"{u}-{v}"
    if r_id in existing_routes or f"{v}-{u}" in existing_routes or u == v:
        return
    existing_routes.add(r_id)
    existing_routes.add(f"{v}-{u}")
    d = dist([n for n in nodes if n['id']==u][0], [n for n in nodes if n['id']==v][0])
    base_latency = int(max(15, min(180, d * 1.5)))
    new_routes.append(f'  {{ id:"{r_id}", from:"{u}", to:"{v}", base:{base_latency}, cable:"Global Mesh" }},')

# Generate routes
for n in nodes:
    nid = n['id']
    neighbors = sorted([m for m in nodes if m['id'] != nid], key=lambda m: dist(n, m))
    if len(neighbors) > 0:
        add_route(nid, neighbors[0]['id'])
    if len(neighbors) > 1:
        add_route(nid, neighbors[1]['id'])
    
    if nid not in hubs:
        hub_nodes = [m for m in nodes if m['id'] in hubs]
        if hub_nodes:
            nearest_hub = sorted(hub_nodes, key=lambda m: dist(n, m))[0]
            add_route(nid, nearest_hub['id'])

routes_str = "\n".join(new_routes)
if "Global Mesh" not in content:
    content = content.replace('const ROUTES = [', 'const ROUTES = [\n' + routes_str)

with open('src/App.jsx', 'w') as f:
    f.write(content)

print(f"Added {len(new_routes)} new routes.")
