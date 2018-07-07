
var net = require('net');
var mongoose = require('mongoose');
var config = require('./config');
var connection = require('./connection');

var deviceSchema = require('./dbmodels/device');
var deviceModel = mongoose.model('deviceInfo',deviceSchema, 'device_gps');

mongoose.Promise = require('bluebird');
mongoose.connect(connection.connectionString, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
});
 
// Create Server instance 
var server = net.createServer(onClientConnected);  
 
server.listen(config.PORT, config.HOST, function() {  
  console.log('server listening on %j', server.address());
});
 
function onClientConnected(sock) {  
  var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
  console.log('new client connected: %s', remoteAddress);
 
  sock.on('data', function(data) {
    console.log('%s Says: %s', remoteAddress, data);
    //sock.write(data);

    let splitArray = data.split(",");
    let splitmessage = splitArray[0].split("#");

    let message = {
        deviceIMEIID: splitmessage[1],
        GPRSstatus: splitmessage[4],
        UTC_time: splitArray[1],
        device_status: splitArray[2],
        n_s_indicator: splitArray[4],
        e_w_indicator: splitArray[6],    
        speed: splitArray[7],    
        device_provider: "MicTrack",
        location: [splitArray[5], splitArray[3]]      
    };


    var devicedata = message;
		var deviceModelInfo = new deviceModel(devicedata);

    deviceModelInfo.save(function (err) {
      if (err) {
        console.log(err);
      }
      else { res.json({ "success": true, "errormessage": "" }); }
    });	

    sock.write(' exit');
  });
  sock.on('close',  function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};