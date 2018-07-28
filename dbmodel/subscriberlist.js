//mongoose schema for getting data  

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../connection');
        
subscriberListMaster = mongoose.Schema({
    sub_id: Number,    
    subscriber_mail_id: String,
    updated_date : Date,
    Created_date : { type : Date, default: Date.now }
});

var connection = mongoose.createConnection(connection.connectionString);

autoIncrement.initialize(connection);
subscriberListMaster.plugin(autoIncrement.plugin, {
  model: 'subscriber_master_gps',
  field: 'sub_id',
  startAt: 1001,
  incrementBy: 1
});

module.exports = subscriberListMaster;