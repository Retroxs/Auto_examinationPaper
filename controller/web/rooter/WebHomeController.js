/**
 * Created by HUI on 2017/2/22.
 */
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const db = mongoose.connection;
const User = mongoose.model('User');
const Bank = mongoose.model('Bank');
const session = require('express-session');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(session({
    secret: '12345',
    name: 'teacherapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},  //设置maxAge是ms，session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));

//登录认证
function authToken(req, res, next) {
    if (!req.session.user||req.session.user.role!=='rooter') {
        res.redirect('/back/login')
    } else {
        next();
    }
}

router.get('/login',function (req, res) {
    res.render('back/login', {title: 'root登陆'});
});

router.get('/dashboard',authToken,function (req, res) {
    User.find({}, function (err, docs) {
        if (err) {
            res.end(err);
        } else {
            res.render('back/home', {title: '超级管理员系统', user_info: docs});
        }
    });
});

router.get('/logout', function (req, res) {
    res.redirect('/back/login');
});

router.get('/createuser',authToken,function (req, res) {
    res.render('back/create_user', {title: '创建用户'});
});

//更改密码
router.get('/update/:username',authToken,function (req, res) {
    User.find({username: req.params.username}, function (err, doc) {
        if (err) {
            res.end(err)
        }
        console.log(doc)
        res.render('back/create_user', {title: '更新信息', userInfo: doc[0]});
    })
});

router.get('/question-manage',authToken,function (req, res) {
    let count = 0;
    let page = req.query.page;
    let question = req.query.question;
    let type = req.query.type;
    let tips = req.query.tips;
    let subject = req.query.subject;
    let rows = 10;
    let query = Bank.find({});
    query.skip((page - 1) * rows);
    query.limit(rows);
    if(subject||question||type||tips){
        query.where('subject', new RegExp(subject)).where('question', new RegExp(question)).where('type', new RegExp(type)).where('tips', new RegExp(tips)).sort({_id: -1});
        //计算分页数据
        query.exec(function (err, rs) {
            if (err) {
                res.send(err);
            } else {
                // 计算数据总数
                Bank.find({subject:new RegExp(subject),question:new RegExp(question),type:new RegExp(type),tips:new RegExp(tips)},function (err, result) {
                    res.render('back/question-manage', {subject:subject,question:question,type:type,tips:tips,title: '公开题库', questions_info: rs, total: Math.ceil(result.length / rows)});
                });
            }
        });
    }else{
        //计算分页数据
        query.exec(function (err, rs) {
            if (err) {
                res.send(err);
            } else {
                // 计算数据总数
                Bank.find({},function (err, result) {
                    res.render('back/question-manage', {title: '公开题库', questions_info: rs, total: Math.ceil(result.length / rows)});
                });
            }
        });
    }

});

//查找某一个题目
router.get('/update_qLevel/:q_id',authToken,function (req, res) {
    Bank.find({_id: req.params.q_id}, function (err, doc) {
        if (err) {
            res.end(err)
        }else{
            res.render('back/find_question', {title: '更新信息', qInfo: doc[0]});
        }
    })
});



module.exports = router;