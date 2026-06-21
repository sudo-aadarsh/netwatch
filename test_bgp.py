import asyncio
import json
import aiohttp

async def main():
    ris_url = "wss://ris-live.ripe.net/v1/ws/"
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(ris_url) as ws:
            await ws.send_json({
                "type": "ris_subscribe",
                "data": {"host": "rrc00", "type": "UPDATE", "socketOptions": {"includeRaw": False}}
            })
            for _ in range(3):
                msg = await ws.receive()
                if msg.type == aiohttp.WSMsgType.TEXT:
                    print("Msg:", msg.data)

asyncio.run(main())
