/**
 * Created by HUI on 2017/2/22.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const crypto = require('crypto');
const Joi = require('joi');
const Mock = require('mockjs');
const Random = Mock.Random;
const path = require("path");
const multer = require('multer');
const upload = multer({dest: path.join(__dirname, '../public/tmp/image_tmp')});
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = mongoose.model('User');
const Bank = mongoose.model('Bank');
const Paper = mongoose.model('Paper');
// const createFile = require('../servers/creatFile');
//初始化


router.use(cookieParser());
router.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 24 * 60 * 60 * 1000},  //设置maxAge是ms，session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}))
//数组 m 中随机取出 n 个值
function randArray(m, len) {
    m.sort(function () {
        return Math.random() - 0.5;
    });
    return m.slice(0, len);
}

let level_select;
//抽取难度的概率控制

function level_random(level) {
    let rand = Math.random();
    if (rand <= 0.3) {
        level_select = "中"
    } else if (rand > 0.3 && rand <= 0.3 + (level * 0.7)) {
        level_select = "难"
    } else {
        level_select = "易"
    }

}
/* GET apis listing. */

//录入题目
router.post('/bank/create', function (req, res) {

    let bank = new Bank({
        user_id: req.session.user.user_id,
        subject: req.body.subject,
        type: req.body.type,
        tips: req.body.tips,
        level: req.body.level,
        public: req.body.public,
        question: req.body.question,
        answer: req.body.answer,
    });

    bank.save(function (err, next) {
        if (err) {
            res.end('error', err);
            return next();
        } else {
            res.status(200).send({message: 'create success'});

        }

    })
});

//预览题目
router.get('/findQuestion/:q_id', function (req, res, next) {
    Bank.find({_id: req.params.q_id}, function (err, docs) {
        if (err) {
            res.end('err', err);
            return next();
        }

        res.status(200).send(docs);

    })

});

//删除题目
router.delete('/bank/:id/delete', function (req, res, next) {

    Bank.findOne({_id: req.params.id}, function (err, doc) {
        if (err) {
            res.end('err', err);
            return next();
        }

        doc.remove();
        res.status(200).send(doc);
    })
});

//todo 修改题目
router.post('/bank/:id/update', function (req, res, next) {
    Bank.update({'_id': req.params.id}, {
        $set: {
            subject: req.body.subject,
            type: req.body.type,
            tips: req.body.tips,
            level: req.body.level,
            public: req.body.public,
            question: req.body.question,
            answer: req.body.answer,
        }
    }, function (err, next) {
        if (err) {
            res.end('err', err);
            return next();
        }
        res.status(200).send({message: ' update success'});

    })
});

module.exports = router;
