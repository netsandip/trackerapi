

var mongoose = require('mongoose');
var config = require('./config');
var connection = require('./connection');
var util = require('util');

var deviceSchema = require('../Server/dbmodel/device');
var deviceModel = mongoose.model('deviceInfo',deviceSchema, 'device_gps');

var alertsmaster = require('../Server/dbmodel/alertsmaster');
var alertsmasterModel = mongoose.model('alertsmasterInfo', alertsmaster, 'alerts_master_gps');

var alertsTransmaster = require('../Server/dbmodel/alertsTrans');
var alertsTransmasterModel = mongoose.model('alertsTransInfo', alertsTransmaster, 'alerts_trans_gps');

mongoose.Promise = require('bluebird');
mongoose.connect(connection.connectionString, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE
});

let message = {
    Temperature : 27
};

alertsmasterModel.find({temperature_min :  { $lte: message.Temperature }, temperature_max :  { $gte: message.Temperature } }).sort({"Created_date": -1}).exec(function(err,objBack) {
if (err) {
    // include better error handling here                               
    console.log(err);
    return                         
    }         
        
    var TemperatureQuery = {temperature_min :  { $lte: message.Temperature }, temperature_max :  { $gte: message.Temperature } };

    alertsmasterModel.find(TemperatureQuery).exec(function(err,objBack) {
      if (err) {
          // include better error handling here                               
          return LogError(err, "TCP listner");                        
        }         
        
        //console.log(objBack);
        //console.log("Temperature is between " + objBack[0].temperature_min + " - " + objBack[0].temperature_max);

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
    
});
