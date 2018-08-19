//mongoose schema for getting data  

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../connection');
        
shipTemplate = mongoose.Schema({
    template_code: Number,
    templateName: String,
    description: String,
    shipFrom: String,
    shipTo: String,    
    updated_date : Date,
    Created_date : { type : Date, default: Date.now }
});

var connection = mongoose.createConnection(connection.connectionString);

autoIncrement.initialize(connection);
shipTemplate.plugin(autoIncrement.plugin, {
  model: 'shipmenttemplate_gps',
  field: 'template_code',
  startAt: 100,
  incrementBy: 1
});

module.exports = shipTemplate;