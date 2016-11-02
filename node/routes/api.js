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

var all = require('../models/bank.server');
router.use(cookieParser());
router.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 24 * 60 * 60 * 1000},  //设置maxAge是ms，session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}))

/* GET apis listing. */
router.get('/test', function (req, res, next) {
    if (req.session.user) {
        res.send(req.session.user.username + req.session.cookie.maxAge);

    } else {
        res.send('error');
    }
});

/*用户接口*/
//注册
router.post('/register', function (req, res, next) {

    var md5 = crypto.createHash('md5');
    md5.update(req.body.password);
    var a = md5.digest('hex');

    var schema = Joi.object().keys({
        username: Joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).required(),
    });
    Joi.validate({username: req.body.username, password: req.body.password}, schema, function (err, value) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            User.find({username: req.body.username}, function (err, docs) {
                if (err) {
                    res.end(err)
                }
                else {
                    if (docs.length == 0) {
                        var user = new User({
                            username: req.body.username,
                            password: a
                        });

                        user.save(function (err, next) {
                            if (err) {
                                res.end("error");
                                return next();
                            }
                            // res.end()
                            res.status(200).send({username: req.body.username, password: "***"});


                        })
                    } else {
                        res.status(400).send({error: 'username is used'});
                    }

                }
            })
        }

    });  // err === null -> valid

});

//登录
router.post('/login', function (req, res, next) {
    var md5 = crypto.createHash('md5');
    md5.update(req.body.password);
    var d = md5.digest('hex');
    var user_session = {
        username: req.body.username,
        password: req.body.password
    }
    User.find({username: req.body.username, password: d}, function (err, docs) {
        if (err) {
            res.end(err);
        } else {
            if (docs.length == 0) {
                res.status(400).send({error: 'username or password is flase'});
            } else {
                // Exam.find({user_id:docs[0]._id},function (err,docs_1) {
                //     if(err){
                //         res.end(err);
                //         return next();
                //     }
                req.session.user = user_session;
                res.status(200).send(docs);
                // })

            }
        }

    })
});

//登录认证
router.get('/auth', function (req, res, next) {
    if (req.session.user) {
        res.status(200).send({message: "logon", username: req.session.user.username})
    } else {
        res.status(400).send({error: "please to login"})
    }

});

//注销登录
router.get('/logout', function (req, res, next) {
    req.session.user = null;

    if (req.session.user == null) {
        res.status(200).send({message: "user has logout"});
    }
    else {
        res.status(400).send({error: "fail"})
    }
});

//更改密码
router.post('/:id/set-password', function (req, res, next) {
    var md5 = crypto.createHash('md5');
    md5.update(req.body.oldPassword);
    var b = md5.digest('hex');

    var md5_1 = crypto.createHash('md5');
    md5_1.update(req.body.newPassword);
    var c = md5_1.digest('hex');
    User.find({_id: req.params.id}, function (err, doc) {
        if (doc[0].password == b) {
            User.update({_id: req.params.id}, {$set: {password: c}}, function (err, next) {
                if (err) {
                    res.end('err', err);
                    return next();
                }
                res.status(200).send({message: "change password success"})
            })
        } else {
            res.status(400).send({error: "password is error"})

        }
    })
});
/*ending*/


/*题库*/
//插入题目
router.post('/bank/:user_id/create', function (req, res, next) {

    var schema = Joi.object().keys({
        subject: Joi.string().required(),
        type: Joi.string().required(),
        tips: Joi.string().required(),
        level: Joi.string().required(),
        public: Joi.boolean().required(),
        question: Joi.string().required(),
        answer: Joi.string().required(),
    });

    Joi.validate({
        subject: req.body.subject,
        type: req.body.type,
        tips: req.body.tips,
        level: req.body.level,
        public: req.body.public,
        question: req.body.question,
        answer: req.body.answer,
    }, schema, function (err, value) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            var bank = new Bank({
                user_id: req.params.user_id,
                subject: req.body.subject,
                type: req.body.type,
                tips: req.body.tips,
                level: req.body.level,
                public: req.body.public,
                question: req.body.question,
                answer: req.body.answer,
            });

            bank.save(function (err, next) {
                debugger;
                if (err) {
                    res.end('error', err);
                    return next();
                }

                res.status(200).send({message: 'create success'});
            })
        }
    })
});

//删除题目
router.get('/bank/:id/delete', function (req, res, next) {

    Bank.findOne({_id: req.params.id}, function (err, doc) {
        // body...
        if (err) {
            res.end('err', err);
            return;
        }

        if (doc) {
            doc.remove();
            // res.json(doc);

            res.end(' delete success')
        }
    })
});

//修改题目
router.post('/bank/:id/update', function (req, res, next) {
    var schema = Joi.object().keys({
        subject: Joi.string().required(),
        options: Joi.string().required(),
        question: Joi.string().required(),
        answer: Joi.string().required(),
        level: Joi.number().required()
    });
    Joi.validate({
        subject: req.body.subject,
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer,
        level: req.body.level,
    }, schema, function (err, value) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            Bank.update({'_id': req.params.id}, {
                $set: {
                    subject: req.body.subject,
                    options: req.body.options,
                    question: req.body.question,
                    answer: req.body.answer,
                    level: req.body.level,
                }
            }, function (err, next) {
                if (err) {
                    res.ens('err', err);
                    return next();
                }
                res.status(200).send({message: ' update success'});


            })
        }
    })
});

//查询题目
router.get('/bank/:user_id/list', function (req, res, next) {
    Bank.find({user_id: req.params.user_id}, function (err, docs) {
        if (err) {
            res.end('err', err);
            return next();
        }

        res.status(200).send(docs);

    })

});

//生成题目
//测试 20 -》 5  level 1.8
router.get('/createpaper/:num/:level', function (req, res, next) {
    var num = req.params.num;
    var level = req.params.level;
    var level_1 = Math.floor(num * ((level / 3) / 2));
    var level_2 = Math.floor(num / 2);
    var level_3 = num - level_1 - level_2;
    var arr1=[];

    var p1=all.getAll("选择题","易",level_3,arr1);
    var p2=all.getAll("选择题","中",level_2,arr1);
    var p3=all.getAll("选择题","难",level_1,arr1);
    var p4=all.getAll("简答题","易",level_3,arr1);
    var p5=all.getAll("简答题","中",level_2,arr1);
    var p6=all.getAll("简答题","难",level_1,arr1);

    Promise.all([p1,p2,p3,p4,p5,p6]).then(function () {
        var paper = new Paper({
            subject:"物理",
            level:level,
            data:arr1
        });

        paper.save(function (err, next) {
            if (err) {
                res.end("error");
                return next();
            }

            res.json({message:"done",data:arr1})
        })
    })

});

//生成word

/*ending*/
module.exports = router;
