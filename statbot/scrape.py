import requests
from requests.structures import CaseInsensitiveDict
import json
import csv
import os
import time
from datetime import datetime
from tqdm import tqdm


def removeJsonFile(filePath):
    if os.path.exists(filePath):
        os.remove(filePath)
    else:
        print("Can not delete the file as it doesn't exists")


voice_url = "https://proxy.statbot.net/servervoice/948732804999553034?user_id=921366394631761994"
message_url = "https://proxy.statbot.net/servermessage/948732804999553034?user_id=921366394631761994"

headers = CaseInsensitiveDict()
headers["Host"] = "proxy.statbot.net"
headers["accept"] = "application/json"
headers["cache-control"] = "no-cache"
headers["user-agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
headers["token"] = "Yj^dUX2M]Ur~'9?pQI-xD0>`Lu]#60Qs}~K9S8cF<6uq#t{`+P${"
headers["sec-gpc"] = "1"
headers["origin"] = "https://statbot.net"
headers["sec-fetch-site"] = "same-site"
headers["sec-fetch-mode"] = "cors"
headers["sec-fetch-dest"] = "empty"
headers["referer"] = "https://statbot.net/"
headers["accept-language"] = "en-US,en;q=0.9"

def grabVoice():
  voice = []
  try:
    voice_resp = requests.get(voice_url, headers=headers)
    for i in voice_resp.json().get("topMembers"):
      voice.append(i)
  except:
    pass
  removeJsonFile('./data/voice.json')
  with open('./data/voice.json', 'w', encoding='utf-8') as f:
    json.dump(voice, f, ensure_ascii=False, indent=2)

def grabMessage():
  message = []
  try:
    message_resp = requests.get(message_url, headers=headers)
    for i in message_resp.json().get("topMembers"):
      message.append(i)
  except:
    pass
  removeJsonFile('./data/message.json')
  with open('./data/message.json', 'w', encoding='utf-8') as f:
    json.dump(message, f, ensure_ascii=False, indent=2)

def getTime():
  now = datetime.now()
  dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
  return (dt_string)
  
def main():
  count = 0
  while True:
    grabVoice()
    grabMessage()
    for i in tqdm(range(600)):
      time.sleep(1)
    print(str(count) + ".  Last update is: " + getTime())
    f = open("./data/log.txt", "a")
    f.write(str(count) + ".  Last update is: " + getTime())
    f.close()
    count += 1
  


main()
# getTime()
