import threading
from xml.etree.ElementTree import tostring
from tuyapy import TuyaApi
import socket
import atexit

def OnClose():
  server.close()

atexit.register(OnClose)

api = TuyaApi()

key = open("key", "r").read()
try:
  api.init(key.split("\n")[0], key.split("\n")[1], "1", "tuya")
except(Exception):
  print("Please wait 60 seconds before authenticating again!")
deviceIDs = api.get_all_devices()
lights = dict(sorted(dict((i.name(),i) for i in deviceIDs if i.obj_type == 'light').items()))
lights['All Lights'] = list(lights.values())

def changeDeviceColor(device, h, s, v):
  device.set_color([h,s,v])

def changeColor(h, s, v):
  threads = []
  for i in lights["All Lights"]:
    threads.append(threading.Thread(target=changeDeviceColor, args=(i,h,s,v,)))
  for i in threads:
    i.start()
  for i in threads:
    i.join()

def changeDeviceStatus(device, status):
  if (status == True):
    device.turn_on()
  elif (status == False):
    device.turn_off()

def changeStatus(status):
  threads = []
  for i in lights["All Lights"]:
    threads.append(threading.Thread(target=changeDeviceStatus, args=(i,status,)))
  for i in threads:
    i.start()
  for i in threads:
    i.join()

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('localhost', 1337))
server.listen(1)

while True:
  print("Waiting for connection...")
  connection, client = server.accept()
  try:
    print("Connected to", client)
    while True:
      data = connection.recv(1024).decode()
      print(data)
      if (data.split(':')[0] == "Color"):
        h,s,v = data.split(':')[1].split(',')
        s = int(s)
        v = int(v)
        h = int(h)
        changeColor(h,s,v)
      elif (data == "Off"):
        changeStatus(False)
      elif (data == "On"):
        changeStatus(True)
      break
  finally:
    connection.close()