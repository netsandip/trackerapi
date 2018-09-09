var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var express = require('express');
var router = express.Router();

var deviceSchema = require('../dbmodel/device');
var deviceModel = mongoose.model('deviceInfo', deviceSchema, 'device_gps');

var deviceMasterSchema = require('../dbmodel/deviceMaster');
var deviceMasterModel = mongoose.model('deviceMasterInfo', deviceMasterSchema, 'device_gps_master');


router.post('/createDevice', function(req, res)
{
	try {
		
        let devicedata = req.body;
        
        let objDevice = {
            description: devicedata.description,
            frequency: devicedata.frequency,
            location_method: devicedata.location_method,
            Organization_name: devicedata.Organization_name
          };

        let deviceModelInfo = new deviceMasterModel(devicedata);
        
        deviceMasterModel.findOneAndUpdate({deviceIMEIID: devicedata.deviceIMEIID}, objDevice, function(err,obj) { 
			console.log(obj); 
			if (obj == undefined) {
                    let deviceMasterModelInfo = new deviceMasterModel(alertsdata);
                    deviceMasterModelInfo.save(function (err) {
					if (err) {            
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
        // LogError(error, "createDevice");
        console.log(error);
	}
});

router.post('/getDeviceDetailsByDeviceId', function(req, res)
{
	try {
		
        let devicedata = req.body;
        
        deviceMasterModel.findOne({deviceIMEIID: devicedata.deviceid}, function(err,obj) { 
			if (obj == undefined) {                    
				res.json({ "success": false, "errormessage": "Device is not found" });				
			}
			else
			{
				res.json({ "success": true, data: obj });
			}		
		
		});        	
		
	} catch (error) {
        // LogError(error, "createDevice");
        console.log(error);
	}
});

router.post('/getDeviceDetailsByOrganizationName', function(req, res)
{
	try {
		
        let devicedata = req.body;        
        deviceMasterModel.findOne({Organization_name: devicedata.Organization_name}, function(err,obj) { 
			if (obj == undefined) {                    
				res.json({ "success": false, "errormessage": "Device is not found" });				
			}
			else
			{
				res.json({ "success": true, data: obj });
			}		
		
		});        	
		
	} catch (error) {
        // LogError(error, "createDevice");
        console.log(error);
	}
});


module.exports = router;