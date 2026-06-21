import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Update handleSearchSelect
old_handle = '''  const handleSearchSelect = (nodeId) => {
    const node = NODE_MAP[nodeId];
    if (node && globeRef.current) {
      globeRef.current.rotation.y = -(node.lon + 90) * (Math.PI / 180);
      globeRef.current.rotation.x = node.lat * (Math.PI / 180);
      setSelRoute(null);
      ignoreSearchChangeRef.current = true;
      setSearchTerm(node.name);
      setSearchResults([]);
    } else {
      setSearchTerm("");
      setSearchResults([]);
    }
  };'''

new_handle = '''  const handleSearchSelect = (nodeId) => {
    const node = NODE_MAP[nodeId];
    if (node && globeRef.current) {
      globeRef.current.rotation.y = -(node.lon + 90) * (Math.PI / 180);
      globeRef.current.rotation.x = node.lat * (Math.PI / 180);
      setSelRoute(null);
      ignoreSearchChangeRef.current = true;
      setSearchTerm(node.name);
      setSearchResults([]);

      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        setSearchTerm("");
      }, 5000);
    } else {
      setSearchTerm("");
      setSearchResults([]);
    }
  };'''

# Use string replace directly to be perfectly safe
content = content.replace(old_handle, new_handle)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
