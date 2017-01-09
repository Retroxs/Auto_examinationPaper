/**
 * Created by HUI on 2016/10/27.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Bank = mongoose.model('Bank');
var Paper = mongoose.model('Paper');
var q = require('q');

function getAll(type, level, level_num, cb) {
    var delay = q.defer();
    Bank.find({type: type, level: level}, function (err, docs) {
        var arr = docs;
        if (err || err === '' || err === null) {
            var rdIndex = 0;
            for (var i = 0; i < level_num; i++) {
                rdIndex = Math.floor(Math.random() * arr.length);
                cb.push(docs[rdIndex]);
                arr.splice(rdIndex, 1)
            }
            delay.resolve(cb)
        }else {
            delay.reject(err)
        }
    });
    return delay.promise
}

module.exports.getAll = getAll;