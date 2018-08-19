
var net = require('net');
var mongoose = require('mongoose');
var config = require('./config');
var connection = require('./connection');

var deviceSchema = require('./dbmodels/device');
var deviceModel = mongoose.model('deviceInfo',deviceSchema, 'device_gps');

var alertsmaster = require('./dbmodel/alertsmaster');
var alertsmasterModel = mongoose.model('alertsmasterInfo', alertsmaster, 'alerts_master_gps');

var alertsTransmaster = require('./dbmodel/alertsTrans');
var alertsTransmasterModel = mongoose.model('alertsTransInfo', alertsTransmaster, 'alerts_trans_gps');

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


  sock.on('data', function (data) {
    console.log('%s Says: %s', remoteAddress, data);
    //sock.write(data);


    let splitArray = data.toString().split(",");
    let splitmessage = splitArray[0].split("#");


    let splitArrayData = data.toString().replace("##", "").toString().split("$");

    const inputData = splitArrayData[1].replace(/\r?\n|\r/g, "");
    let FinalInputData = "$" + inputData;
    const Gpsdata = nmea.parse(FinalInputData)
    console.log(JSON.stringify(Gpsdata));
    console.log('GPS :' + JSON.stringify(Gpsdata.loc));
    // Check whether we receive Gps Signal or not
    if (Gpsdata.gps == true) {
      // For Gps Co-ordinates
      console.log("Gps Co-ordinates" + Gpsdata.loc.geojson.coordinates);
      //For Datatime
      console.log("Datetime" + Gpsdata.datetime);
      //For Speed

      console.log("Speed" + Gpsdata.speed);

      let message = {
        deviceIMEIID: splitmessage[1],
        GPRSstatus: Gpsdata.gps,
        UTC_time: Gpsdata.datetime,
        device_status: splitArray[2],
        n_s_indicator: splitArray[4],
        e_w_indicator: splitArray[6],
        speed: Gpsdata.speed,
        device_provider: "MicTrack",
        location: Gpsdata.loc.geojson.coordinates,
        Temperature: Math.floor(Math.random() * 100),
        humidity: Math.floor(Math.random() * 100) ,
        Pressure: Math.floor(Math.random() * 10) ,
        Light: Math.floor(Math.random() * 10),
        motionActivity: Math.floor(Math.random() * 10),
        Acceleration: Math.floor(Math.random() * 180),
        XYZ_Acceleration: Math.floor(Math.random() * 10),
        Orientation: Math.floor(Math.random() * 10),
      };

      var devicedata = message;
      var deviceModelInfo = new deviceModel(devicedata);

      deviceModelInfo.save(function (err) {
        if (err) {
          console.log(err);
        }
        else { console.log("Success") }
      });

      /**Alerts Management Code */
      //Temperature
      var TemperatureQuery = {temperature_min :  { $lte: message.Temperature }, temperature_max :  { $gte: message.Temperature } };

      alertsmasterModel.find(TemperatureQuery).exec(function(err,objBack) {
        if (err) {
            // include better error handling here                               
            return LogError(err, "TCP listner");                        
          }         
          
          for (let index = 0; index < objBack.length; index++) {
            const element = objBack[index];

            let objValue = {
                alerts_type : "Temperature",
                alerts_value : message.Temperature,
                alerts_message : "Temperature is between " + element.temperature_min + " - " + element.temperature_max,
                userid : element.userid
              };
      
              //console.log(objBack);
              let alertsInfo = alertsTransmasterModel(objValue); //Prepare data for save.
              alertsInfo.save(function(err, doc){
                  if(err){
                      //LogError(err, "TCP listner");
                      console.log(err);
                  }              
                  console.log('Trans entry is created');              
              });
            
        }
          
      });

      //Humidity
      let HumidiyQuery = {humidity_min :  { $lte: message.humidity }, humidity_max :  { $gte: message.humidity } };

      alertsmasterModel.find(HumidiyQuery).exec(function(err,objBack) {
        if (err) {
            // include better error handling here                               
            return LogError(err, "TCP listner");                        
          }         
          
          for (let index = 0; index < objBack.length; index++) {
            const element = objBack[index];

            let objValue = {
                alerts_type : "Humidiy",
                alerts_value : message.humidity,
                alerts_message : "Humidiy is between " + element.humidity_min + " - " + element.humidity_max,
                userid : element.userid
              };
      
              //console.log(objBack);
              let alertsInfo = alertsTransmasterModel(objValue); //Prepare data for save.
              alertsInfo.save(function(err, doc){
                  if(err){
                      //LogError(err, "TCP listner");
                      console.log(err);
                  }              
                  console.log('Trans entry is created');              
              });
            
        }
          
      });

      /**Alerts Management Code */
    }

    sock.write(' exit');
  });
  sock.on('close', function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};