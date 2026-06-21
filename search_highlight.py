import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# 1. Add searchTermRef
ref_addition = '''  const [searchTerm, setSearchTerm] = useState("");
  const searchTermRef = useRef("");
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);'''

content = content.replace('  const [searchTerm, setSearchTerm] = useState("");', ref_addition)

# 2. Add NODE_MAP reference to window so it can be accessed if needed, but it's already a global CONSTANT!
# Wait, NODE_MAP is a top-level constant, so we can access it inside the animation loop.

# 3. Update the nodeGroup.children.forEach loop in animate
old_loop = '''      // Pulse node halos
      nodeGroup.children.forEach((m) => {
        if (m.userData.isHalo) {
          m.userData.phase += dt * 2.2;
          m.material.opacity = 0.1 + Math.sin(m.userData.phase) * 0.12;
          const s = 1 + Math.sin(m.userData.phase * 0.7) * 0.55;
          m.scale.setScalar(s);
        }
      });'''

new_loop = '''      // Pulse node halos & Handle Search Highlight
      const q = searchTermRef.current.toLowerCase();
      nodeGroup.children.forEach((m) => {
        if (m.userData.isHalo) {
          m.userData.phase += dt * 2.2;
          m.material.opacity = 0.1 + Math.sin(m.userData.phase) * 0.12;
          let s = 1 + Math.sin(m.userData.phase * 0.7) * 0.55;
          
          // If searching, dim non-matching halos
          if (q) {
             const n = NODE_MAP[m.userData.nodeId]; // wait, halo doesn't have nodeId, core does!
          }
          m.scale.setScalar(s);
        } else if (m.userData.nodeId) {
          const n = NODE_MAP[m.userData.nodeId];
          const isMatch = q && (
            n.name.toLowerCase().includes(q) ||
            (n.country && n.country.toLowerCase().includes(q)) ||
            n.id.toLowerCase().includes(q)
          );
          
          if (isMatch) {
             m.scale.setScalar(3.0 + Math.sin(ts / 150) * 0.5); // Pulse big
             m.material.color.setHex(0xff00ff); // Highlight color (Neon Pink)
          } else {
             m.scale.setScalar(1.0);
             m.material.color.setHex(0xe0fffc); // Original color
          }
        }
      });'''

content = content.replace(old_loop, new_loop)

# 4. Wait, the halo doesn't have `userData.nodeId`? 
# Let's check `App.jsx` for halo creation:
#       halo.position.copy(pos);
#       halo.userData.phase = Math.random() * Math.PI * 2;
#       halo.userData.isHalo = true;
# It doesn't have nodeId. Let's fix halo creation to have nodeId too.
content = content.replace('halo.userData.isHalo = true;', 'halo.userData.isHalo = true; halo.userData.nodeId = n.id;')

# 5. Let's make the halo also change color/size when matched!
new_loop_fixed = '''      // Pulse node halos & Handle Search Highlight
      const q = searchTermRef.current ? searchTermRef.current.toLowerCase() : "";
      nodeGroup.children.forEach((m) => {
        const n = NODE_MAP[m.userData.nodeId];
        const isMatch = q && n && (
          n.name.toLowerCase().includes(q) ||
          (n.country && n.country.toLowerCase().includes(q)) ||
          n.id.toLowerCase().includes(q)
        );

        if (m.userData.isHalo) {
          m.userData.phase += dt * 2.2;
          let baseOpacity = 0.1 + Math.sin(m.userData.phase) * 0.12;
          let s = 1 + Math.sin(m.userData.phase * 0.7) * 0.55;
          
          if (isMatch) {
             s *= 2.5; // Massive halo for searched node
             m.material.color.setHex(0xff00ff);
             m.material.opacity = baseOpacity * 2;
          } else {
             m.material.color.setHex(0x00e5cc);
             m.material.opacity = q ? baseOpacity * 0.2 : baseOpacity; // Dim if searching but not match
          }
          m.scale.setScalar(s);
        } else if (m.userData.nodeId) {
          if (isMatch) {
             m.scale.setScalar(4.0 + Math.sin(ts / 100) * 1.0); // Pulse big
             m.material.color.setHex(0xffffff); // Core turns bright white
          } else {
             m.scale.setScalar(1.0);
             m.material.color.setHex(0xe0fffc); // Original color
             if (q) {
                 m.material.color.setHex(0x0a2f42); // Dim non-matches
             }
          }
        }
      });'''

content = content.replace(new_loop, new_loop_fixed)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
