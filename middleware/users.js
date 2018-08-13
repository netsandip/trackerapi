
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var express = require('express');
var router = express.Router();
//router.use(bodyparser.json());


var userSchema = require('../dbmodel/users');
var UserModel = mongoose.model('usersinfo', userSchema, 'users_gps');    

router.post('/getprofilesByUser', function(req, res){
    try {
      
      UserModel.findOne({userid: req.body.userid}).sort({ 'Created_date': -1 }).exec( function (err, resultss)
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

router.post('/createUser', function(req, res)
  {
      try {
          
          var userdata = req.body;
        
          var userInfo = new UserModel(userdata);

          let update = {
                Name: userdata.Name,
                EmailAddress: userdata.EmailAddress,
                PhoneNumber: userdata.PhoneNumber,    
                Organization_name: userdata.Organization_name,
            };

          UserModel.findOneAndUpdate({userid: userdata.userid}, update, function(err,obj){
            if (err) {
                LogError(err, "createUser");
                res.status(400).send(err);
            }
            if (obj == undefined) {
                userInfo.save(function (err) {
                    if (err) {
                        LogError(err, "createUser");
                        res.status(400).send(err);
                    }
                    else { res.json({ "success": true, "errormessage": "" }); }
                });	
            }
            else {
                res.json({ "success": true, "errormessage": "" });
            }            
          });


  
        //   UserModel.findOne(, function(err,obj) { 
        //       //console.log(obj); 
        //       if (obj == undefined) {
        //           userInfo.save(function (err) {
        //               if (err) {
        //                   LogError(err, "createUser");
        //                   res.status(400).send(err);
        //               }
        //               else { res.json({ "success": true, "errormessage": "" }); }
        //           });	
        //       }
        //       else if (obj) {
        //           let update = {

        //           }

                  
        //       }
        //       else
        //       {
        //           res.json({ "success": false, "errormessage": "userid already exists in the system" });
        //       }		
          
        //   });        
          
      } catch (error) {
          LogError(error, "createUser");
      }
});
  
  
module.exports = router