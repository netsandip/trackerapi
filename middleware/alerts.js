var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var express = require('express');
var router = express.Router();


var alertsmaster = require('../dbmodel/alertsmaster');
var alertsmasterModel = mongoose.model('alertsmasterInfo', alertsmaster, 'alerts_master_gps');

router.post('/getAlertsMasterByUser', function(req, res){
    try {
      
      alertsmasterModel.findOne({userid: req.body.userid}).sort({ 'Created_date': -1 }).exec( function (err, resultss)
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

		let alertsmasterModelInfo = new alertsmasterModel(alertsdata);

		alertsmasterModel.findOne({alerts_master_name: alertsdata.alerts_master_name}, function(err,obj) { 
			//console.log(obj); 
			if (obj == undefined) {
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
				res.json({ "success": false, "errormessage": "alerts name exists in the system" });
			}		
		
		});        
		
	} catch (error) {
		LogError(error, "createalertsmaster");
	}
});

module.exports = router