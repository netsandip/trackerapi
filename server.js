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
var moment = require('moment');
var util = require('util');

var users = require('./middleware/users');
var alerts = require('./middleware/alerts');

var deviceSchema = require('./dbmodel/device');
var deviceModel = mongoose.model('deviceInfo', deviceSchema, 'device_gps');

var deviceMasterSchema = require('./dbmodel/deviceMaster');
var deviceMasterModel = mongoose.model('deviceMasterInfo', deviceMasterSchema, 'device_gps_master');

var shipmentSchema = require('./dbmodel/shipment');
var shipmentSchemaModel = mongoose.model('shipmentSchemaInfo', shipmentSchema, 'shipmentmaster_gps');

var shipmenttemplate = require('./dbmodel/shipmenttemplate');
var shipmenttemplateModel = mongoose.model('shipmenttemplateInfo', shipmenttemplate, 'shipmenttemplate_gps');

var alertsTransmaster = require('./dbmodel/alertsTrans');
var alertsTransModel = mongoose.model('alertsTransInfo', alertsTransmaster, 'alerts_trans_gps');
app.use(bodyparser.json());

app.use('/users', users);
app.use('/alerts', alerts);


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



app.post('/validateLogin', function(req, res)
{	
	UserModel.findOne({userid: req.body.userid, Password: req.body.password },{userid: true, Role: true}, function(err,obj) { 
		
		if (obj != undefined) {
			res.json({ "success": true, "errormessage": "", data: obj });
		}
		else
		{
			res.json({ "success": false, "errormessage": "authentication mismatch or user doesnt exists in the system " });
		}		
	
	});
});



app.post('/createTemplate', function(req, res)
{
	try {
		
		let devicedata = req.body;

		let templateInfo = new shipmenttemplateModel(devicedata);

		shipmenttemplateModel.findOne({templateName: devicedata.templateName}, function(err,obj) { 
			//console.log(obj); 
			if (obj == undefined) {
				templateInfo.save(function (err) {
					if (err) {
						LogError(err, "createTemplate");
						res.status(400).send(err);
					}
					else { res.json({ "success": true, "errormessage": "" }); }
				});	
			}
			else
			{
				res.json({ "success": false, "errormessage": "Template information exists in the system" });
			}		
		
		});         
		
	} catch (error) {
		LogError(error, "createTemplate");
	}
});

app.post('/createShipment', function(req, res)
{
	try {
		
		let devicedata = req.body;

		let shipinfo = new shipmentSchemaModel(devicedata);

		shipmentSchemaModel.findOne({shipment_name: devicedata.shipment_name}, function(err,obj) { 
			//console.log(obj); 
			if (obj == undefined) {
				shipinfo.save(function (err) {
					if (err) {
						LogError(err, "createDevice");
						res.status(400).send(err);
					}
					else { res.json({ "success": true, "errormessage": "" }); }
				});	
			}
			else
			{
				res.json({ "success": false, "errormessage": "shipment already exists in the system" });
			}		
		
		});        
		
	} catch (error) {
		LogError(error, "createDevice");
	}
});

app.post('/getShipmentByStatus', function(req, res)
{
	try {

    var start = new Date();
    var end = new Date();      
		
		let devicedata = req.body;

    let query;

    if (devicedata.status = "upcoming") {
      query = { deliveryDate: {$gte: end }};
    } else if (devicedata.status = "active") {
      query = { deliveryDate: {$gte: end, $lt: start }};
    } else {
      query = { deliveryDate: { $lt: end }};
    }

    shipmentSchemaModel.aggregate([
      { "$match": { "shipment_name" : "ssd" } },    
      {
          "$lookup": {
              "from": "shipmenttemplate_gps",
              "localField": "shipment_template_id",
              "foreignField": "template_code",
              "as": "resultingTagsArray"
          }
      }
   ]).exec(function(err, results){
    if (results == undefined) {
      res.json({ "success": true, "errormessage": "No record found" });
    }
    else
    {
      res.json({ success: true, data: results});
    }		
      //console.log(util.inspect(results, { showHidden: false, depth: null }));
   });		
	} catch (error) {
		LogError(error, "getShipmentByStatus");
	}
});




app.post('/listofShipTempelatesByUser', function(req, res){
  try {
    // if (req.body.userid == undefined) {
    //   res.send({ success: false, message: "Userid is not passed in the parameter" });
    //   return;
    // }

    shipmenttemplateModel.find({}, {templateName: true, template_code: true }).exec(
      function(err, docs) {
          if (err) {
              res.send({ success: false, message: err });
          }                             
            res.json({ success: true, data: docs});
          //res.json({ success: true, data: docs});
      }
    );
  } catch (error) {
    console.log(error);
      res.json({ success: false, message: error });
  }
});

app.post('/getShipmentDetailsbyUser', function(req, res){

  try {
    //{userid: userdata.userid}
    shipmenttemplateModel.find({}, {shipFrom: true, shipTo: true }).exec( function (err, resultss)
      {
          if (err) {
            res.send({ success: false, message: err });
          } 

          res.json({ success: true, data: resultss});
      });
  } catch (error) {
    console.log(error);
      res.json({ success: false, message: error });
  }
     
});

app.post('/getTelemeticsDataByDeviceID', function(req, res){
  try {
    
        deviceModel.findOne({ deviceIMEIID: req.body.deviceid}, {deviceIMEIID: true, _id: false, 
          Temperature:true, humidity: true, Pressure: true, Light: true, motionActivity: true, Acceleration: true, UTC_time: true,
          XYZ_Acceleration: true, Orientation: true }).sort({ 'Created_date': -1 }).exec( function (err, resultss)
        {
            if (err) {
              res.send({ success: false, message: err });
            } 
  
            res.json({ success: true, data: resultss});
        });

      
  } catch (error) {
    console.log(error);
      res.json({ success: false, message: error });
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
          //console.log(ids);
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

app.post('/getGraphsDataforSensors', function(req, res) {
    
  try {
    var start = new Date();
    var end = new Date();      

    let dateRange = req.body.dateRange;
    let interval;

    switch (dateRange) {
      case "Last 1 hour":
      end = moment().add(-1, 'hours').toDate();
      interval = {
          $minute: '$Created_date'
      };
        break;
      
      case "Last 5 hours":
      end = moment().add(-5, 'hours').toDate();
      interval = { $hour: '$Created_date'};
        break;

      case "Last 10 hours":
      end = moment().add(-10, 'hours').toDate();
      interval = {$hour: '$Created_date'};
        break;
      
      case "Last 24 hours":
      end = moment().add(-1, 'days').toDate();
      interval = {$hour: '$Created_date'};
        break;
    
      case "Last 48 hours":
        end = moment().add(-2, 'days').toDate();
        interval = {$hour: '$Created_date'};
        break;
      
      case "Last 72 hours":
      end = moment().add(-3, 'days').toDate();
      interval = {$hour: '$Created_date'};
        break;

      case "Last 7 days":
      end = moment().add(-7, 'days').toDate();
      interval = {$dayOfMonth: '$Created_date'};
        break;
      
      case "Last 14 days":
      end = moment().add(-14, 'days').toDate();
      interval = {$dayOfMonth: '$Created_date'};
        break;
      
      case "Last 30 days":
      end = moment().add(-30, 'days').toDate();
      interval = {$dayOfMonth: '$Created_date'};
        break;

      case "Last 60 days":
      end = moment().add(-60, 'days').toDate();
      interval = {$week: '$Created_date'};
        break;

      case "Last 90 days":
      end = moment().add(-90, 'days').toDate();
      interval = {$week: '$Created_date'};
        break;

      default:
      start = req.body.startDate;
      end = req.body.endDate
        break;
    }

    let pipeline = [
        {
           $match: { deviceIMEIID: req.body.deviceid, Created_date: {$gte: end, $lt: start }},
        },
        {
          $group: {
            _id: interval,
            avgTemperature: {$avg: "$Temperature"},
            avgHumidity: { $avg: "$humidity"},
            avgPressure: { $avg: "$Pressure"},
            avgLight: { $avg: "$Light"},
            avgmotionActivity: { $avg: "$motionActivity"},
            avgmAcceleration: { $avg: "$Acceleration"},
            avgXYZ_Acceleration: { $avg: "$XYZ_Acceleration" },
            avgOrientation: { $avg: "$Orientation" }

          }
        }
    ];

    deviceModel.aggregate(pipeline).exec(
      function(err, docs) {
          if (err) {
              res.send({ success: false, message: err });
          }       
         
      res.json({ success: true, data: docs});
      });

       
    
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


