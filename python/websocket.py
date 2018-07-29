'''
requirements.txt
'''
import asyncio
import json
import uuid
import websockets


async def receives(uri, payload):
    """Starts infinite websocket connection"""
    async with websockets.connect(uri) as websocket:
        await websocket.send(payload)
        while True:
            response = await websocket.recv()
            print(response)


if __name__ == "__main__":
    """
    you may construct payload whatever you want to subscribe.
    PAYLOAD is constant payload now.
    """
    PAYLOAD = json.dumps(
        [
            {'ticket': str(uuid.uuid4())},
            {'type': 'ticker', 'codes': ['KRW-BTC', 'BTC-ADA']}
        ])
    asyncio.get_event_loop().run_until_complete(
        receives('wss://api.upbit.com/websocket/v1', PAYLOAD))
