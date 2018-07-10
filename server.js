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
var moment = require('moment');

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
          let result = [];
          deviceModel.findOne({ deviceIMEIID: { $in: ids }}, {deviceIMEIID: true, location: true, speed: true, UTC_time:true }).sort({ 'Created_date': -1 }).exec( function (err, resultss)
          {
            if (err) {
              res.send({ success: false, message: err });
            } 
            result.push(resultss);
            res.json({ success: true, data: result});
          });

          //res.json({ success: true, data: docs});
      }
    );
  } catch (error) {
    console.log(error);
      res.json({ success: false, message: error });
  }
});


app.post('/getSensorDataByDeviceId', function(req, res) {
    
  try {
    var start = new Date();
    var end = new Date();      

    let dateRange = req.body.dateRange;

    switch (dateRange) {
      case "Last 1 hour":
      end = moment().add(-1, 'hours').toDate();
        break;
      
      case "Last 5 hours":
      end = moment().add(-5, 'hours').toDate();
        break;

      case "Last 10 hours":
      end = moment().add(-10, 'hours').toDate();
        break;
      
      case "Last 24 hours":
      end = moment().add(-1, 'days').toDate();
        break;
    
      case "Last 48 hours":
        end = moment().add(-2, 'days').toDate();
        break;
      
      case "Last 72 hours":
      end = moment().add(-3, 'days').toDate();
        break;

      case "Last 7 days":
      end = moment().add(-7, 'days').toDate();
        break;
      
      case "Last 14 days":
      end = moment().add(-14, 'days').toDate();
        break;
      
      case "Last 30 days":
      end = moment().add(-30, 'days').toDate();
        break;

      case "Last 60 days":
      end = moment().add(-60, 'days').toDate();
        break;

      case "Last 90 days":
      end = moment().add(-90, 'days').toDate();
        break;

      default:
      start = req.body.startDate;
      end = req.body.endDate
        break;
    }
    
    // console.log("start " + start + "end " + end );
    deviceModel.find({deviceIMEIID: req.body.deviceid, Created_date: {$gte: end, $lt: start }},{deviceIMEIID: true, Temperature: true, humidity: true, Pressure:true, Light: true, motionActivity: true, Acceleration:true
      , XYZ_Acceleration:true, Orientation:true, UTC_time: true}).sort({ 'Created_date': -1 }).exec(
    function(err, docs) {
        if (err) {
            res.send({ success: false, message: err });
        }       
       
    res.json({ success: true, data: docs});
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
      var end = new Date();      

      let dateRange = req.body.dateRange;

      switch (dateRange) {
        case "Last 1 hour":
        end = moment().add(-1, 'hours').toDate();
          break;
        
        case "Last 5 hours":
        end = moment().add(-5, 'hours').toDate();
          break;

        case "Last 10 hours":
        end = moment().add(-10, 'hours').toDate();
          break;
        
        case "Last 24 hours":
        end = moment().add(-1, 'days').toDate();
          break;
      
        case "Last 48 hours":
          end = moment().add(-2, 'days').toDate();
          break;
        
        case "Last 72 hours":
        end = moment().add(-3, 'days').toDate();
          break;

        case "Last 7 days":
        end = moment().add(-7, 'days').toDate();
          break;
        
        case "Last 14 days":
        end = moment().add(-14, 'days').toDate();
          break;
        
        case "Last 30 days":
        end = moment().add(-30, 'days').toDate();
          break;

        case "Last 60 days":
        end = moment().add(-60, 'days').toDate();
          break;

        case "Last 90 days":
        end = moment().add(-90, 'days').toDate();
          break;

        default:
        start = req.body.startDate;
        end = req.body.endDate
          break;
      }
      
      // console.log("start " + start + "end " + end );
      deviceModel.find({deviceIMEIID: req.body.deviceid, Created_date: {$gte: end, $lt: start }},{deviceIMEIID: true, location: true, speed: true}).sort({ 'Created_date': -1 }).exec(
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


