var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.connection;
var crypto = require('crypto');
var Joi = require('joi');

var session = require('express-session');
var cookieParser = require('cookie-parser');

var User = mongoose.model('User');
var Bank = mongoose.model('Bank');
var Paper = mongoose.model('Paper');

router.use(cookieParser());
router.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 24 * 60 * 60 * 1000},  //设置maxAge是ms，session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}))
//登录认证

function authToken(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login')
    } else {
        next();
    }
}
/* GET home page. */
router.get('/home', authToken, function (req, res, next) {
    res.render('index', {title: '录入题目'});

});

router.get('/login', function (req, res, next) {
    res.render('login', {title: '后台登陆'});
});

router.get('/back/login', function (req, res, next) {
    res.render('back/login', {title: 'root登陆'});
});

router.get('/banks-list', authToken, function (req, res, next) {
    var user_id = req.session.user.user_id;
    var count = 0;
    var page = req.query.page;
    console.log(page)
    var rows = 5;
    // console.log("page:"+page+",rows:"+rows);
    var query = Bank.find({});
    query.skip((page - 1) * rows);
    query.limit(rows);
    if (user_id) {
        query.where('user_id', user_id);
    }
    //计算分页数据
    query.exec(function (err, rs) {
        if (err) {
            res.send(err);
        } else {
            //计算数据总数
            Bank.find({'user_id':user_id},function (err, result) {
                console.log(Math.ceil(result.length / rows))
                res.render('banks-list', {title: '试题中心', list: rs, total: Math.ceil(result.length / rows)});
            });
        }
    });

});

router.get('/make-paper', authToken, function (req, res, next) {
    res.render('make-paper', {title: '组卷中心'});

});

router.get('/paper-bank', authToken, function (req, res, next) {
    res.render('paper-bank', {title: '试卷中心'});

});

module.exports = router;