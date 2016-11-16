var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.connection;
var crypto = require('crypto');
var Joi = require('joi');
var Mock = require('mockjs');
var Random = Mock.Random;
var session = require('express-session');
var cookieParser = require('cookie-parser');

var User = mongoose.model('User');
var Bank = mongoose.model('Bank');
var Paper = mongoose.model('Paper');

var all = require('../models/makepaper.server');
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
//数组 m 中随机取出 n 个值
function randArray(m, len) {
    m.sort(function () {
        return Math.random() - 0.5;
    });
    return m.slice(0, len);
}
var level_select;
//抽取难度的概率控制
function level_random() {
    var rand = Math.random();
    if (rand <= 0.7) {
        level_select = "中"
    } else if (rand > 0.7 && rand <= 0.9) {
        level_select = "难"
    } else {
        level_select = "易"
    }

}
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
router.get('/login', function (req, res, next) {
    var md5 = crypto.createHash('md5');
    md5.update(req.query.password);
    var d = md5.digest('hex');
    var user_session = {
        username: req.query.username,
        password: req.query.password
    }
    console.log(user_session)
    User.find({username: req.query.username, password: d}, function (err, docs) {
        if (err) {
            res.end(err);
        } else {
            if (docs.length == 0) {
                res.status(400).send({error: 'username or password is flase'});
            } else {
                user_session.user_id = docs[0]._id
                req.session.user = user_session;
                console.log(docs[0]._id)
                res.redirect('/home')

            }
        }

    })
});

//注销登录
router.get('/logout', function (req, res, next) {
    req.session.user = null;
    if (req.session.user == null) {
        res.redirect('/login')
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
router.post('/bank/create', function (req, res, next) {

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
        if (err) {
            res.end('err', err);
            return next();
        }

        doc.remove();
        res.status(200).send(doc);
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

//查询题库
router.get('/bank/:user_id/list', function (req, res, next) {
    Bank.find({user_id: req.params.user_id}, function (err, docs) {
        if (err) {
            res.end('err', err);
            return next();
        }

        res.status(200).send(message, 'delete success');

    })

});

//查询题目
router.get('/findQuestion/:q_id', function (req, res, next) {
    Bank.find({_id: req.params.q_id}, function (err, docs) {
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
    var arr1 = [];

    var p1 = all.getAll("选择题", "易", level_3, arr1);
    var p2 = all.getAll("选择题", "中", level_2, arr1);
    var p3 = all.getAll("选择题", "难", level_1, arr1);
    var p4 = all.getAll("简答题", "易", level_3, arr1);
    var p5 = all.getAll("简答题", "中", level_2, arr1);
    var p6 = all.getAll("简答题", "难", level_1, arr1);

    var sp = Promise.all([p1, p2, p3, p4, p5, p6]).then(function () {


        var M = arr1.map(function (o) {
            return o.tips
        })
        var set1 = Array.from(new Set(M))
        console.log(set1.length / 10)
        if (set1.length / 10 >= 0.6) {
            var paper = new Paper({
                subject: "物理",
                level: level,
                data: arr1
            });
            paper.save(function (err, next) {
                if (err) {
                    res.end("error");
                    return next();
                }

                res.json({message: "done", data: arr1})
            })

        }
        else {
            res.json({message: "done", data: set1.length / 10})
        }
    })

});

//生成word

/*ending*/


/**
 * root用户接口
 **/

//登陆
router.get('/back/login', function (req, res, next) {
    if (req.query.username == 'admin' && req.query.password == '123456') {
        res.redirect('/home ')
    }
    else {
        res.status(400).send({error: 'username or password is flase'});
    }

});

/**
 * 测试testAPI
 **/

//造数据
router.get('/addtestdata', function (req, res, next) {
    var data = Mock.mock({
        'list|10000': [{
            user_id: "580dd278e639721573a2d85c",
            subject: "物理",
            "type|1": ["选择题", "判断题", "填空题", "简答题", "解答题"],
            tips: /知识点[0-4][0-9]/,
            "level|1": ["易", "中", "难"],
            "public|1": true,
            question: /云题题库:题目[a-z]+[A-Z]+[1-9]/,
            answer: /云题题库:答案[a-z]+[A-Z]+[1-9]/,
        }]
    });
    Bank.collection.insert(data.list, onInsert);
    function onInsert(err, docs) {
        if (err) {
            res.end("error");
            return next();
        } else {
            res.status(200).send({message: "done"});
        }
    }

});

//测试分页
router.post('/bank/pagelist', function (req, res) {
    var count = 0;
    var page = req.body.page;
    var rows = req.body.rows;
    var user_id = req.body.user_id;
    console.log("page:" + page + ",rows:" + rows);

    var query = Bank.find({});
    query.skip((page - 1) * rows);
    query.limit("知识点11");
    if (user_id) {
        query.where('user_id', user_id);
    }
    //计算分页数据
    query.exec(function (err, rs) {
        if (err) {
            res.send(err);
        } else {
            //计算数据总数
            Bank.find(function (err, result) {
                jsonArray = {rows: rs, total: result.length / rows};
                res.json(jsonArray);
            });

        }
    });

});

//测试出卷新算法
router.post('/make_paper', function (req, res) {
    var findByTips = req.body.tips;
    var type_num = [];
    for (item in req.body.type_items) {
        type_num.push(req.body.type_items[item])
    }
    var type_items = Object.keys(req.body.type_items);
    var paper_list = [];

    for (var i = 0; i < type_items.length; i++) {
        (function (arg1) {
            Bank.find({tips: {$in: findByTips}, type: type_items[i]}, {"type": 1, "tips": 1, "level": 1},
                function (err, docs) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        var M = docs.map(function (o) {
                            return o.tips;
                        });
                        var findByTips_selected = Array.from(new Set(M));

                        var findByTipsBY_type = randArray(findByTips_selected, type_num[arg1]);
                        for (var j = 0; j < type_num[arg1]; j++) {
                            (function (arg, arg4) {
                                Bank.find({tips: findByTipsBY_type[i], type: type_items[arg1]}, {
                                        "type": 1,
                                        "tips": 1,
                                        "level": 1
                                    },
                                    function (err, docs) {
                                        if (err) {
                                            res.send(err);

                                        } else {
                                            level_random();
                                            Bank.find({
                                                    tips: findByTipsBY_type[arg],
                                                    type: type_items[arg1],
                                                    level: level_select
                                                }, {
                                                    "type": 1,
                                                    "tips": 1,
                                                    "level": 1
                                                },
                                                function (err, docs) {
                                                    var rdIndex = Math.ceil(Math.random() * (docs.length - 1));
                                                    var select_finally = docs[rdIndex]
                                                    // console.log(select_finally)
                                                    arg4.push(select_finally)
                                                    // console.log(arg4.length)
                                                    if(arg4.length==25){
                                                        console.log('ok')
                                                        res.status(200).send({message: paper_list});
                                                    }
                                                })
                                        }

                                    })

                            })(j, paper_list)
                        }
                    }
                })

        })(i)
    }

});

module.exports = router;