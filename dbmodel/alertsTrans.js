//mongoose schema for getting data  

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../connection');
        
alertsTransSchema = mongoose.Schema({
    alerts_id: Number,        
    alerts_type: String,   
    alerts_value: String,    
    alerts_action: String,
    alerts_message: String,    
    updated_date : Date,
    Created_date : { type : Date, default: Date.now } 
});

var connection = mongoose.createConnection(connection.connectionString);

autoIncrement.initialize(connection);
alertsTransSchema.plugin(autoIncrement.plugin, {
  model: 'alerts_trans_gps',
  field: 'alerts_id',
  startAt: 1001,
  incrementBy: 1
});

module.exports = alertsTransSchema;