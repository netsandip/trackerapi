var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var express = require('express');
var router = express.Router();
var moment = require('moment');

var alertsmaster = require('../dbmodel/alertsmaster');
var alertsmasterModel = mongoose.model('alertsmasterInfo', alertsmaster, 'alerts_master_gps');

var alertsTransmaster = require('../dbmodel/alertsTrans');
var alertsTransmasterModel = mongoose.model('alertsTransInfo', alertsTransmaster, 'alerts_trans_gps');


router.post('/getAlertsMasterByUser', function(req, res){
    try {
      
      alertsmasterModel.find({userid: req.body.userid}).sort({ 'Created_date': -1 }).limit(100).exec( function (err, resultss)
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

  router.post('/getAlertsMasterByDeviceID', function(req, res){
    try {
      
      alertsmasterModel.find({deviceIMEIID: req.body.deviceid}).sort({ 'Created_date': -1 }).limit(100).exec( function (err, resultss)
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

router.post('/getAlertsMasterByID', function(req, res){
    try {
      
      alertsmasterModel.findOne({_id: req.body.id}).sort({ 'Created_date': -1 }).exec( function (err, resultss)
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
  

router.post('/createalertsmaster', function(req, res)
{
	try {
		
		let alertsdata = req.body;
    
    let objAlerts = {
      alerts_master_name: alertsdata.alerts_master_name,
      shipment_departs_origin: alertsdata.shipment_departs_origin,
      shipment_arrives_destination: alertsdata.shipment_arrives_destination,
      shipment_late_delivery: alertsdata.shipment_late_delivery,
      shipment_stops: alertsdata.shipment_stops,
      geofenced_areas: alertsdata.geofenced_areas,
      temperature_min: alertsdata.temperature_min,
      temperature_max: alertsdata.temperature_max,
      humidity_min: alertsdata.humidity_min,   
      humidity_max: alertsdata.humidity_max,   
      battery_min: alertsdata.battery_min,   
      battery_max: alertsdata.battery_max,   
      shock_events: alertsdata.shock_events,
      lost_recovered_connection: alertsdata.lost_recovered_connection,
      assignee_email: alertsdata.assignee_email,
      external_users: alertsdata.external_users,
    };

		alertsmasterModel.findOneAndUpdate({alerts_master_name: alertsdata.alerts_master_name}, objAlerts, function(err,obj) { 
			console.log(obj); 
			if (obj == undefined) {
        let alertsmasterModelInfo = new alertsmasterModel(alertsdata);
				alertsmasterModelInfo.save(function (err) {
					if (err) {
            //LogError(err, "createalertsmaster");
            console.log(err);
						res.json({ "success": false, "errormessage": "Duplicate entry in the system" });
					}
					else { res.json({ "success": true, "errormessage": "" }); }
				});	
			}
			else
			{
				res.json({ "success": true, "errormessage": "record is updated!!" });
			}		
		
		});        
		
	} catch (error) {
		LogError(error, "createalertsmaster");
	}
});

router.post('/applyAlertProfile', function(req, res)
{
	try {
		
    let alertsdata = req.body;
    
    let update = {
      "$set": {
        "deviceIMEIID" : alertsdata.deviceid
      }
    }

		alertsmasterModel.findOneAndUpdate({_id: alertsdata._id}, update, function(err,obj) { 
			console.log(obj); 
			if (obj == undefined) {
        res.json({ "success": false, "errormessage": "record is not available!!" });
			}
			else
			{
				res.json({ "success": true, "errormessage": "record is updated!!" });
			}		
		
		});        
		
	} catch (error) {
		LogError(error, "applyAlertProfile");
	}
});

router.post('/removeAlertProfile', function(req, res)
{
	try {
		
    let alertsdata = req.body;
    
    let update = {
      "$set": {
        "deviceIMEIID" : null
      }
    }

		alertsmasterModel.findOneAndUpdate({_id: alertsdata._id}, update, function(err,obj) { 
			console.log(obj); 
			if (obj == undefined) {
        res.json({ "success": false, "errormessage": "record is not available!!" });
			}
			else
			{
				res.json({ "success": true, "errormessage": "record is updated!!" });
			}		
		
		});        
		
	} catch (error) {
		LogError(error, "applyAlertProfile");
	}
});


router.post('/getEventsAlertsByUser', function(req, res){
  try {
    
    alertsTransmasterModel.find({userid: req.body.userid}).sort({ 'Created_date': -1 }).limit(100).exec( function (err, resultss)
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

router.post('/deleteAlertsMaster', function(req, res){
  try {
    
    alertsmasterModel.remove({_id: req.body._id}).exec( function (err, resultss)
        {
            if (err) {
              res.send({ success: false, message: err });
            } 
  
            res.json({ success: true, message: "Deleted Successfully!!"});
        });

      
  } catch (error) {
    console.log(error);
      res.json({ success: false, message: error });
  }
});

router.post('/getAlertsGraphsByDeviceID', function(req, res) {
    
  try {
    var start = new Date();
    var end = new Date();      

    let dateRange = req.body.dateRange;
    let alertType = req.body.alertType;
    let userid = req.body.userid;
    let interval;

    switch (dateRange) {
      case "Last 1 month":
      end = moment().add(-1, 'months').toDate();
      interval = {
          $dayOfMonth: '$Created_date'
      };
        break;
      
      case "Last 6 months":
      end = moment().add(-5, 'months').toDate();
      interval = { $dayOfMonth: '$Created_date'};
        break;

      case "Last 10 months":
      end = moment().add(-10, 'months').toDate();
      interval = {$dayOfMonth: '$Created_date'};
        break;
    

      default:
      start = req.body.startDate;
      end = req.body.endDate
        break;
    }

    let test = {"y":{"$year":"$Created_date"},
    "m":{"$month":"$Created_date"},
    "d":{"$dayOfMonth":"$Created_date"}
     }

    let pipeline = [
        {
           $match: { Created_date: {$gte: end, $lt: start }, alerts_type: alertType, userid: userid },
        },
        {
          $group: {
            _id: test,           
            count: { $sum: 1 }         
          }
        },
        { $sort: {   '_id.y': 1, 
                   '_id.m': 1, 
                   '_id.d': 1
        } 
      }  
    ];

    alertsTransmasterModel.aggregate(pipeline).exec(
      function(err, docs) {
          if (err) {
              res.send({ success: false, message: err });
              return;
          }       
         
      res.json({ success: true, data: docs});
      });

       
    
  } catch (error) {
    console.log(error);
    //res.json({ success: false, message: error });
  }
});


module.exports = router