/**
 * Created by HUI on 16/9/9.
 */
var mongoose = require('mongoose');
var config = require('./config.js');

module.exports=function () {
    mongoose.set('debug', config.debug);
    var db = mongoose.connect(config.mongodb);
    console.log('mongodb connected:',config.mongodb);
    require('../schema/user');
    require('../schema/bank');
    require('../schema/paper');
    return db;
};