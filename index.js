var Service, Characteristic;
var request = require('request');
const net = require('net');

module.exports = function(homebridge){
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-horizonbox","horizon",HorizonAccessory);
};

function HorizonAccessory(log,config){

	this.log = log;
	this.config = config;
	this.name = config['name'] || "HorizonBox";
	this.ip = config['ip'] || "192.168.178.62";
	this.key = config['key'];


	this.service = new Service.Switch(this.name);

	this.service.getCharacteristic(Characteristic.On)
		.on('get',this.getOn.bind(this))
		.on('set',this.setOn.bind(this));
	
	this.isActive = function(callback){
		request.get({ url: "http://"+this.ip+":62137/DeviceDescription.xml", timeout: 100 },function(err,res,body){
			if(!err && res.statusCode == 200){
				callback(true);
			}else {
				console.log(err);
				callback(false);
			}	
		});
	}.bind(this);
};

HorizonAccessory.prototype.getServices = function(){
	return [this.service];
};

HorizonAccessory.prototype.getOn = function(callback){
	if(this.key === undefined){
		this.isActive(function(on){
			callback(null, on);
		});
	}else {
		callback(null, false);
	}
};

HorizonAccessory.prototype.setOn = function(on,callback){
	
	toggle(this.ip, 5900, undefined, this.key);

	callback(null);
};

function toggle(ip, port, timeout, key){
	var timer;
        port = port || 5900;
        timeout = timeout || 300;
	key = key || "E000";
        try {
                var receivedVersion = false;
                var receivedVersionOK = false;
                var receivedAuthorizationOK = false;
                var sendedToggle = false;

                const client = net.createConnection(port, ip);
                client.on('connect', function() {
                        clearTimeout(timer);
                        console.log("Socket connected!");
                });

                client.on('data', function(data) {

                        if(receivedVersion == false){
                                client.write(data.toString());

                                receivedVersion = true;
                                return;
                        }

			/*
			if(receivedVersion && sendedToggle == false){
				client.write(Buffer.from([0x01]));
				
				var keyBuffer = Buffer.from(key, 'hex');
				
				var bufferDown = Buffer.from([0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
                                bufferDown.writeInt8(keyBuffer.readInt8(0),6);
                                bufferDown.writeInt8(keyBuffer.readInt8(1),7);
                                console.log("BufferDown: ");
                                console.log(bufferDown);

                                var bufferUp = Buffer.from([0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
                                bufferUp.writeInt8(keyBuffer.readInt8(0),6);
                                bufferUp.writeInt8(keyBuffer.readInt8(1),7);
                                console.log(bufferUp);

                                client.write(bufferDown);
                                client.write(bufferUp);
				setTimeout(function(){
					client.end();
				},100);
				
				sendedToggle = true;
			}*/

                        if(receivedVersion && receivedVersionOK == false){
                                client.write(Buffer.from([0x01]));
                                receivedVersionOK = true;
                                return;
                        }
			
			if(receivedVersionOK && receivedAuthorizationOK == false){

                                receivedAuthorizationOK = true;
                                return;
                        }

                        if(receivedAuthorizationOK && sendedToggle == false){
				
				var keyBuffer = Buffer.from(key, 'hex');
				console.log(keyBuffer);
				//var test = Buffer.concat(Buffer.from([0x04, 0x01, 0x00, 0x00, 0x00, 0x00]), keyBuffer);
				//console.log(test);
					
				var bufferDown = Buffer.from([0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
				bufferDown.writeInt8(keyBuffer.readInt8(0),6);
				bufferDown.writeInt8(keyBuffer.readInt8(1),7);
				console.log("BufferDown: ");
				console.log(bufferDown);

				var bufferUp = Buffer.from([0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
				bufferUp.writeInt8(keyBuffer.readInt8(0),6);
				bufferUp.writeInt8(keyBuffer.readInt8(1),7);
				console.log(bufferUp);

                                client.write(bufferDown);
                                client.write(bufferUp);
                                sended = true;
                                client.end();
                        }
                });

                client.on('error', function(err) {
           		console.log("Error occurs while toggeling Power Status of Horizon Box");
                        console.log(err);
                        clearTimeout(timer);
                });

                timer = setTimeout(function(){
                        console.log("Error");
                        client.end();
                }, timeout);

	}catch(err){
                console.log(err);
        }
}

