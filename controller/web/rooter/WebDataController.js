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
//登陆
router.post('/login', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    let user_session = {
        username: username,
        password: password,
        role:'rooter'
    };
    if (username == 'root' && password == '123456') {
        req.session.user = user_session;
        res.redirect('/back/dashboard ')
    }
    else {
        res.render('back/login', {username: username, error: 'username or password is flase'});
    }

});

//创建用户
router.post('/createuser',authToken,function (req, res) {
    let register_info = {};
    register_info.username = req.body.username;
    register_info.password = req.body.password;
    register_info.subject = (req.body.subject).split(',');
    register_info.remarks = req.body.remarks;

    // let md5 = crypto.createHash('md5');
    // md5.update(req.body.password);
    // let a = md5.digest('hex');

    let schema = Joi.object().keys({
        username: Joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).required(),
        subject: Joi.array().unique(),
        remarks: Joi.string().required(),
    });

    Joi.validate(register_info, schema, function (err, value) {
        if (err) {
            let error = {};
            error.message = err.details[0].message;
            error.field = err.details[0].path;
            res.render('back/create_user', {user: register_info, error: error});
        } else {
            User.find({username: register_info.username}, function (err, docs) {
                if (err) {
                    res.end(err)
                } else {
                    if (docs.length == 0) {
                        let user = new User(register_info);

                        user.save(function (err) {
                            if (err) {
                                res.end(err);
                            } else {
                                res.redirect('/back/dashboard')
                            }
                        })
                    } else {
                        res.render('back/create_user', {user: register_info, error: {message: 'username is used'}});
                    }
                }
            })
        }

    });

});

//更新用户信息
router.post('/update',authToken,function (req, res) {
    let register_info = {};
    register_info.username = req.body.username;
    register_info.password = req.body.password;
    register_info.subject = (req.body.subject).split(',');
    register_info.remarks = req.body.remarks;

    let schema = Joi.object().keys({
        username: Joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).required(),
        subject: Joi.array().unique(),
        remarks: Joi.string().required(),
    });

    Joi.validate(register_info, schema, function (err, value) {
        if (err) {
            let error = {};
            error.message = err.details[0].message;
            error.field = err.details[0].path;
            res.render('back/create_user', {userModify: register_info, error: error});
        }else {
            User.find({username: register_info.username}, function (err, doc) {
                if (err) {
                    res.end(err)
                } else{
                    User.update({username: register_info.username}, {
                        $set: register_info
                    }, function (err, next) {
                        if (err) {
                            res.end(err);
                            return next();
                        }
                        res.redirect('/back/dashboard')
                    })
                }

            })
        }

    })

});

//更新题目难度
router.post('/update_qLevel/:q_id',authToken,function (req, res) {
    Bank.find({_id: req.params.q_id}, function (err, doc) {
        if (err) {
            res.end(err)
        }
        Bank.update({_id: req.params.q_id}, {
            $set: {
                question:req.body.question,
                answer:req.body.answer,
                level: req.body.level,
            }
        }, function (err, next) {
            if (err) {
                res.end('err', err);
                return next();
            }
            res.redirect('/back/question-manage')
        })
    })
});
//删除
router.delete('/del/:id',authToken,function (req, res) {
    if(req.session.user.role==='rooter'){
        Bank.findOne({_id: req.params.id}, function (err, doc) {
            if (err) {
                res.end('err', err);
                return next();
            } else {
                doc.remove();
                res.status(200).send(doc);
            }
        })
    }else{
        res.status(400).send({message: '权限不足'});
    }
});

module.exports = router;