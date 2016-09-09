/**
 * Created by HUI on 16/9/9.
 */
var mongoose = require('mongoose');
var config = require('./config.js');

module.exports=function () {
    console.log(config.mongodb)

    var db = mongoose.connect(config.mongodb);
    require('../models/user.server.model');

    return db;
}