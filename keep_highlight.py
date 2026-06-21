import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# 1. Add ignoreSearchChangeRef
ref_addition = '''  const [searchTerm, setSearchTerm] = useState("");
  const searchTermRef = useRef("");
  const ignoreSearchChangeRef = useRef(false);'''

content = content.replace('  const [searchTerm, setSearchTerm] = useState("");\n  const searchTermRef = useRef("");', ref_addition)

# 2. Update useEffect for search
old_effect = '''  useEffect(() => {
    searchTermRef.current = searchTerm;
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }'''

new_effect = '''  useEffect(() => {
    searchTermRef.current = searchTerm;
    if (ignoreSearchChangeRef.current) {
        ignoreSearchChangeRef.current = false;
        return;
    }
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }'''

content = content.replace(old_effect, new_effect)

# 3. Update handleSearchSelect
old_handle = '''  const handleSearchSelect = (nodeId) => {
    const node = NODE_MAP[nodeId];
    if (node && globeRef.current) {
      globeRef.current.rotation.y = -(node.lon + 90) * (Math.PI / 180);
      globeRef.current.rotation.x = node.lat * (Math.PI / 180);
      setSelRoute(null);
    }
    setSearchTerm("");
    setSearchResults([]);
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
    } else {
      setSearchTerm("");
      setSearchResults([]);
    }
  };'''

content = content.replace(old_handle, new_handle)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
