import re

with open('main.py', 'r') as f:
    content = f.read()

# Replace simulate_bgp_loop
new_sim = '''async def simulate_bgp_loop():
    """Fallback loop to simulate BGP events if the stream is quiet."""
    while True:
        try:
            await asyncio.sleep(1)
            event = {
                "type": random.choices(["ANNOUNCE", "WITHDRAW"], weights=[0.8, 0.2])[0],
                "peer": f"{random.randint(10,200)}.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}",
                "peer_asn": f"AS{random.randint(1000, 300000)}",
                "as_path": " → ".join(str(random.randint(1000, 60000)) for _ in range(random.randint(2, 5))),
                "prefixes": f"{random.randint(1,200)}.{random.randint(0,255)}.{random.randint(0,255)}.0/{random.randint(22,24)}",
                "ts": datetime.now(timezone.utc).isoformat(),
            }
            await broadcast({"type": "bgp_event", "event": event})
        except Exception as e:
            logging.error(f"simulate_bgp_loop error: {e}")
            await asyncio.sleep(5)'''

content = re.sub(r'async def simulate_bgp_loop\(\):.*?except Exception as e:.*?log\.warning\("BGP simulation error: %s", e\)', new_sim, content, flags=re.DOTALL)

with open('main.py', 'w') as f:
    f.write(content)
