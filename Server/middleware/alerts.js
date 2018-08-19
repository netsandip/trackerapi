var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var express = require('express');
var router = express.Router();


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

module.exports = router