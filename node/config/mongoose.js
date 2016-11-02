/**
 * Created by HUI on 16/9/9.
 */
var mongoose = require('mongoose');
var config = require('./config.js');

module.exports=function () {
    var db = mongoose.connect(config.mongodb);
    console.log('mongodb connected:',config.mongodb);

    require('../models/user.server.model');
    require('../models/bank.server.model');
    require('../models/paper.server.model');
    return db;
}