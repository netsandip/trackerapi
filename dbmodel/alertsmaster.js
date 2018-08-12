//mongoose schema for getting data  

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../connection');
        
alertsMasterSchema = mongoose.Schema({
    alerts_id: Number,    
    alerts_master_name: String,
    shipment_departs_origin: Boolean,
    shipment_arrives_destination: Boolean,
    shipment_late_delivery: String,
    shipment_stops: String,
    geofenced_areas: [],
    temperature: Number,
    humidity: Number,   
    battery: Number,   
    shock_events: Boolean,
    lost_recovered_connection: String,
    assignee_email: [],
    external_users: [],
    userid: String,
    updated_date : Date,
    Created_date : { type : Date, default: Date.now }
});

var connection = mongoose.createConnection(connection.connectionString);

autoIncrement.initialize(connection);
alertsMasterSchema.plugin(autoIncrement.plugin, {
  model: 'alerts_master_gps',
  field: 'alerts_id',
  startAt: 1001,
  incrementBy: 1
});

module.exports = alertsMasterSchema;