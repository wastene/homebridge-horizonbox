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
	var accessory = this;
	accessory.isActive(function(on){
		callback(null, on);
	});
};

HorizonAccessory.prototype.setOn = function(on,callback){
	
	toggle(this.ip, 5900);

	callback(null);
};

function toggle(ip, port, timeout){
	var timer;
        port = port || 5900;
        timeout = timeout || 300;
        try {
                var receivedVersion = false;
                var receivedVersionOK = false;
                var receivedAuthorizationOK = false;
                var sendedToggle = false;

                console.log("Try to connect to: "+ip+":"+port);
                const client = net.createConnection(port, ip);
                client.on('connect', function() {
                        clearTimeout(timer);
                        console.log("Socket connected!");
                });
                client.on('data', function(data) {
                        console.log("Recveied Data: ");
                        console.log(data.toString());
                        console.log(data);

                        if(receivedVersion == false){
                                client.write(data.toString());
                                console.log("Version: "+data.toString());
                                console.log("Send Version back");

                                receivedVersion = true;
                                return;
                        }

                        if(receivedVersion && receivedVersionOK == false){
                                console.log("Received Version OK. Length: "+data.length);

                                var buffer = Buffer.from([0x01]);

                                console.log(buffer);
                                var written = client.write(buffer, function(){
                                        console.log("test");
                                });
                                console.log("Written: "+written);
                                //client.write(Buffer.from([0x00, 0x01]).toString());

                                receivedVersionOK = true;
                                return;
                        }
			
			if(receivedVersionOK && receivedAuthorizationOK == false){
                                console.log("Received Authorization OK. Length: "+data.length);

                                receivedAuthorizationOK = true;
                                return;
                        }

                        if(receivedAuthorizationOK && sendedToggle == false){

                                client.write(Buffer.from([0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0xE0, 0x00]));
                                client.write(Buffer.from([0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0xE0, 0x00]));
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

