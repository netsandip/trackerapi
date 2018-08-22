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
    temperature_min: Number,
    temperature_max: Number,
    humidity_min: Number,   
    humidity_max: Number,   
    battery_min: Number,   
    battery_max: Number,   
    shock_events: Boolean,
    lost_recovered_connection: Boolean,
    assignee_email: [],
    external_users: [],
    userid: String,
    updated_date : Date,
    deviceIMEIID: Number,
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