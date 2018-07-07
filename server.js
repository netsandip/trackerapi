var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var connection = require('./connection');
var net = require('net');
var mongoose = require('mongoose');
var config = require('./config');
var connection = require('./connection');
var cors = require('cors');
var _ = require('underscore');
var deviceSchema = require('./dbmodel/device');
var deviceModel = mongoose.model('deviceInfo', deviceSchema, 'device_gps');

var deviceMasterSchema = require('./dbmodel/deviceMaster');
var deviceMasterModel = mongoose.model('deviceMasterInfo', deviceMasterSchema, 'device_gps_master');

app.use(bodyparser.json());
app.use(cors());

mongoose.Promise = require('bluebird');
mongoose.connect(connection.connectionString, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE
});

app.post('/createDevice', function(req, res)
{
	try {
		
		let devicedata = req.body;

		let deviceModelInfo = new deviceMasterModel(devicedata);

		deviceMasterModel.findOne({deviceIMEIID: devicedata.deviceIMEIID}, function(err,obj) { 
			//console.log(obj); 
			if (obj == undefined) {
				deviceModelInfo.save(function (err) {
					if (err) {
						LogError(err, "createDevice");
						res.status(400).send(err);
					}
					else { res.json({ "success": true, "errormessage": "" }); }
				});	
			}
			else
			{
				res.json({ "success": false, "errormessage": "userid already exists in the system" });
			}		
		
		});        
		
	} catch (error) {
		LogError(error, "createDevice");
	}
});


app.post('/getListofTrackerByuser', function(req, res){
  try {
    deviceMasterModel.find().exec(
      function(err, docs) {
          if (err) {
              res.send({ success: false, message: err });
          }         
          ids = _.pluck(docs, 'deviceIMEIID');
          console.log(ids);
          deviceModel.findOne({ deviceIMEIID: { $in: ids }}, {deviceIMEIID: true, location: true, speed: true, UTC_time:true }, function (err, resultss)
          {
            if (err) {
              res.send({ success: false, message: err });
            } 
            res.json(resultss);
          });

          //res.json({ success: true, data: docs});
      }
    );
  } catch (error) {
    console.log(error);
      res.json({ success: false, message: error });
  }
});






app.post('/getLocationByDeviceId', function(req, res) {
    
    try {
      var start = new Date();
      start.setHours(0,0,0,0);
      var end = new Date();
      end.setHours(23,59,59,999);

      deviceModel.find({deviceIMEIID: req.body.deviceid, Created_date: {$gte: start, $lt: end}},{deviceIMEIID: true, location: true, speed: true}).sort({ 'Created_date': -1 }).exec(
      function(err, docs) {
          if (err) {
              res.send({ success: false, message: err });
          }
          
      let result = [];
      
       for (let index = 0; index < docs.length; index++) {
         const element = docs[index];
         let speex = element.speed.kmh == null ? 0 : element.speed.kmh 
        let record = {
          latitude: element.location[1],
          longitude: element.location[0],
          speed: speex
        }
        result.push(record);         
       }   
      res.json({ success: true, data: result});
      }
    );
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error });
    }
  });


  var Port = process.env.PORT || 3001;
  app.listen(Port);
  console.log("server running on port " + Port);


