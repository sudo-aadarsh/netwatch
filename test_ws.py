import asyncio
import json
import aiohttp

async def main():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect('ws://localhost:8001/ws') as ws:
            print("Connected to NetWatch backend")
            while True:
                msg = await ws.receive()
                if msg.type == aiohttp.WSMsgType.TEXT:
                    data = json.loads(msg.data)
                    if data["type"] == "bgp_event":
                        print("Got BGP Event:", data)
                        break
                    else:
                        print("Got msg type:", data["type"])
                else:
                    break

asyncio.run(main())
