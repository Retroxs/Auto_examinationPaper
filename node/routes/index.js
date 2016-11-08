var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{title:'云题后台管理'});

});
router.get('/login', function(req, res, next) {
    res.render('login',{title:'后台登陆'});

});
router.get('/banks-list', function(req, res, next) {
    res.render('banks-list',{title:'后台登陆'});

});
module.exports = router;