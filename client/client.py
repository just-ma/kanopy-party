import asyncio
import websockets
import requests 
from pynput import keyboard
from pynput.keyboard import Key, Controller

PATH = "://kanopy-party.herokuapp.com/"
URL = "http" + PATH
URI = "ws" + PATH
HEARTBEAT = "ping"
TOGGLE_KEY = 'p'
KEY_CODES = {'a':'left', 's':'space', 'd':'right'}

kb = Controller()
listening = True

async def connect():
  async with websockets.connect(URI) as websocket:
    async def push(key):
      print("sent: %s" % key)
      await websocket.send(key)

    def on_press(key):
      try:
        k = key.char
        global listening
        if listening and k in KEY_CODES.keys():
          asyncio.run(push(KEY_CODES[k]))
        elif k == TOGGLE_KEY:
          listening = not listening
          print("listening: %s" % listening)
      except:
        return
    
    keyboard.Listener(on_press = on_press).start()

    while True:
      rec = await websocket.recv()
      if rec == HEARTBEAT: 
        print("---heartbeat---")
        requests.get(url = URL, params = {})
        continue
      if listening:
        print("received: %s" % rec)
        kb.press(Key[rec])
        kb.release(Key[rec])

asyncio.get_event_loop().run_until_complete(connect())
