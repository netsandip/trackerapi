//mongoose schema for getting data  

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../connection');
        
shipmentSchema = mongoose.Schema({
    linkdeviceIMEIID: Number,
    shipment_code: Number,
    shipment_name: String,
    description: String,
    shipment_template_id: Number,
    shipDate: Date,
    deliveryDate: Date,    
    updated_date : Date,
    Created_date : { type : Date, default: Date.now }
});

var connection = mongoose.createConnection(connection.connectionString);

autoIncrement.initialize(connection);
shipmentSchema.plugin(autoIncrement.plugin, {
  model: 'shipmentmaster_gps',
  field: 'shipment_code',
  startAt: 100,
  incrementBy: 1
});

module.exports = shipmentSchema;