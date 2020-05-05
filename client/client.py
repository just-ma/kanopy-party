import asyncio
import websockets
from pynput import keyboard
from pynput.keyboard import Key, Controller

kb = Controller()
uri = "ws://kanopy-party.herokuapp.com/"

async def connect():
  async with websockets.connect(uri) as websocket:
    async def push():
      await websocket.send("bump")

    def on_press(key):
      if str(key) == 'Key.space':
        print("space pressed")
        asyncio.run(push())
    
    listener = keyboard.Listener(on_press = on_press)
    listener.start()

    while await websocket.recv():
      print("space received")
      listener.stop()
      kb.press(Key.space)
      kb.release(Key.space)
      listener = keyboard.Listener(on_press = on_press)
      listener.start()

asyncio.get_event_loop().run_until_complete(connect())
