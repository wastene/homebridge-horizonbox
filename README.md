# homebridge-horizonbox
Homebridge Plugin to toggle Power of Horizon Box

https://www.npmjs.com/package/homebridge-horizonbox

## Install
```console
 npm install homebridge-horizonbox
```

## Usage

config.json sample:

```json
"accessories": [
   {
       	"accessory": "horizon",
       	"name": "Box",
       	"ip": "192.168.178.62",
   },
   {
         "accessory": "horizon",
         "name": "Box Channel Up",
         "ip": "192.168.178.62",
         "key": "E006"
   }
]
```
Leave "key" empty to toggle Power of Horizon Box and also get the status of the Horizon Box.   
Type in a key from the Keys below. 

## Keys

KEY_POWER = E000  
KEY_OK = E001  
KEY_ BACK = E002  
KEY_CHANNEL_UP = E006  
KEY_CHANNEL_DOWN = E007  
KEY_HELP = E009  
KEY_MENU = E00A  
KEY_GUIDE = E00B  
KEY_INFO = E00E  
KEY_TEXT = E00F  
KEY_MENU1 = E011  
KEY_MENU2 = E015  
KEY_DPAD_UP = E100  
KEY_DPAD_DOWN = E101  
KEY_DPAD_LEFT = E102  
KEY_DPAD_RIGHT = E103  
KEY_NUM_0 = E300  
KEY_NUM_1 = E301  
KEY_NUM_2 = E302  
KEY_NUM_3 = E303  
KEY_NUM_4 = E304  
KEY_NUM_5 = E305   
KEY_NUM_6 = E306  
KEY_NUM_7 = E307  
KEY_NUM_8 = E308  
KEY_NUM_9 = E309  
KEY_PAUSE = E400  
KEY_STOP = E402  
KEY_RECORD = E403  
KEY_FWD = E405  
KEY_RWD = E407  
KEY_MENU3 = EF00  
KEY_UNKNOWN_0 = EF06   
KEY_UNKNOWN_1 = EF15    
KEY_UNKNOWN_2 = EF16  
KEY_UNKNOWN_3 = EF17  
KEY_UNKNOWN_4 = EF19  
KEY_ONDEMAND = EF28    
KEY_DVR = EF29  
KEY_TV = EF2A  

## Other Information

My Homepage:

http://a-berisha.de
