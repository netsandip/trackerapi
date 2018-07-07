//mongoose schema for getting data  

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../connection');
        
deviceMasterSchema = mongoose.Schema({
    deviceIMEIID: Number,    
    device_code: Number,    
    device_provider: String,    
    updated_date : Date,
    Created_date : { type : Date, default: Date.now }
});

var connection = mongoose.createConnection(connection.connectionString);

autoIncrement.initialize(connection);
deviceMasterSchema.plugin(autoIncrement.plugin, {
  model: 'device_gps_master',
  field: 'device_code',
  startAt: 100,
  incrementBy: 1
});

module.exports = deviceMasterSchema;