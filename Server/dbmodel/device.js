//mongoose schema for getting data  

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../connection');
        
deviceSchema = mongoose.Schema({
    deviceIMEIID: Number,
    GPRSstatus: String,
    linebreak: String,
    messageid: String,
    UTC_time: String,
    device_status: String,
    n_s_indicator: String,
    e_w_indicator: String,    
    speed: {
        knots: Number,
        kmh: Number
    },
    Temperature: Number,
    humidity: Number,
    Pressure: Number,
    Light: Number,
    motionActivity: Number,
    Acceleration: Number,
    XYZ_Acceleration: Number,
    Orientation: Number,
    Battery: Number,
    device_code: Number,    
    device_provider: String,
    location: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
        },    
    updated_date : Date,
    Created_date : { type : Date, default: Date.now }
});

deviceSchema.index({ "location": "2d" });


var connection = mongoose.createConnection(connection.connectionString);

autoIncrement.initialize(connection);
deviceSchema.plugin(autoIncrement.plugin, {
  model: 'device_gps',
  field: 'device_code',
  startAt: 100,
  incrementBy: 1
});

module.exports = deviceSchema;