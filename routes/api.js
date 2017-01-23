let express = require('express');
let router = express.Router();

let mongoose = require('mongoose');
let db = mongoose.connection;
let crypto = require('crypto');
let Joi = require('joi');
let Mock = require('mockjs');
let Random = Mock.Random;
let path = require("path");
let multer = require('multer');
let upload = multer({dest: path.join(__dirname, '../public/tmp/image_tmp')});
let session = require('express-session');
let cookieParser = require('cookie-parser');
let User = mongoose.model('User');
let Bank = mongoose.model('Bank');
let Paper = mongoose.model('Paper');
let createFile = require('../servers/creatFile');
//初始化


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
router.get('/test', function (req, res, next) {
    if (req.session.user) {
        res.send(req.session.user.username + req.session.cookie.maxAge);

    } else {
        res.send('error');
    }
});

/**
 * 用户接口
 **/


//登录
router.post('/login', function (req, res, next) {
    let md5 = crypto.createHash('md5');
    md5.update(req.body.password);
    let d = md5.digest('hex');
    let user_session = {
        username: req.body.username,
        password: req.body.password
    };
    console.log(user_session);
    User.find({username: req.body.username, password: req.body.password}, function (err, docs) {
        if (err) {
            res.end(err);
        } else {
            if (docs.length == 0) {
                res.status(400).send({error: 'username or password is flase'});
            } else {
                user_session.user_id = docs[0]._id
                user_session.subject = docs[0].subject
                user_session.subject_default = docs[0].subject[0]
                req.session.user = user_session;
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
router.get('/back/find_userInfo/:username', function (req, res, next) {
    User.find({username: req.params.username}, function (err, doc) {
        if (err) {
            res.end(err)
        }
        console.log(doc)
        res.render('back/create_user', {title: '更新信息', userInfo: doc[0]});
    })
});

/**
 * 题库接口
 **/
//设置全局科目
router.get('/selectSubject', function (req, res, next) {
    if (req.session.user.subject_default = req.query.subject_default) {
        res.redirect('/home');
    }
});
//插入题目
router.post('/bank/create', function (req, res, next) {

    let schema = Joi.object().keys({
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
    let schema = Joi.object().keys({
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

//题库分页
router.post('/bank/pagelist', function (req, res) {
    let count = 0;
    let page = req.body.page;
    let rows = req.body.rows;
    let user_id = req.body.user_id;
    console.log("page:" + page + ",rows:" + rows);

    let query = Bank.find({});
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

/**
 * 生成试卷
 */
router.post('/make_paper', function (req, res) {

    let tips = req.body.tips; //用户指定的知识点[array]
    let level = req.body.level; //用户指定的知识点[string]
    let type_items = Object.keys(req.body.type_items); //用户指定的题型[object]
    let type_num = [];//每个类型对应的题数[string]
    let total_length = 0; //试卷的总长度[string]
    let tipsByType = [];//最终筛选出的每道题目的知识点[array]
    let type1_list = [],
        type2_list = [],
        type3_list = [],
        type4_list = [],
        type5_list = [],
        paper_list = [];


    //计算每种题型的数量，以及试题的总长度
    for (item in req.body.type_items) {
        type_num.push(req.body.type_items[item])  //用户指定的题型数量
        total_length = total_length + req.body.type_items[item]; //用户指定的题型数量总和
    }

    //每个题型循环一次
    for (let i = 0; i < type_items.length; i++) {
        Bank.find({tips: {$in: tips}, type: type_items[i]}, {"type": 1, "tips": 1, "level": 1}, //检索包含给定知识点的第i个题型
            function (err, docs) {
                if (err) {
                    res.status(400).send({error: err, message: type_items[i] + '无法满足所选知识点'});
                } else {
                    let M = docs.map(function (o) {
                        return o.tips;
                    });

                    let tips_selected = Array.from(new Set(M));//对检索出的知识点进行去重

                    //(判断)知识点的个数与题型的题数
                    if (tips_selected.length >= type_num[i]) {
                        tipsByType = randArray(tips_selected, type_num[i]);
                    } else {
                        let tips_selectedTmp = tips_selected;
                        for (let x = 1; x < parseInt(type_num[i] / tips_selected.length); x++) {
                            //如果是倍数增长就把数组复制相应份数组合
                            tips_selected = tips_selected.concat(tips_selected);
                        }

                        tipsByType = randArray(tips_selectedTmp, type_num[i] % tips_selected.length);
                        tipsByType = tips_selected.concat(tipsByType);
                    }

                    //每个题型中每道题目筛选出的process
                    for (let j = 0; j < type_num[i]; j++) {
                        level_random(level);
                        Bank.find({
                                tips: tipsByType[j],
                                type: type_items[i],
                                level: level_select
                            }, {
                                "type": 1,
                                "tips": 1,
                                "level": 1,
                                "question": 1,
                                "answer": 1
                            },
                            function (err, docs) {
                                let type_number=type_num[i];
                                console.log(docs.length);
                                if (docs.length >0 ) {
                                        let rdIndex = Math.floor((Math.random() * docs.length));
                                        let select_finally = docs[rdIndex];
                                        switch (select_finally.type) {
                                            case '选择题':
                                                type1_list.push(select_finally);
                                                break;
                                            case '填空题':
                                                type2_list.push(select_finally);
                                                break;
                                            case '判断题':
                                                type3_list.push(select_finally);
                                                break;
                                            case '简答题':
                                                type4_list.push(select_finally);
                                                break;
                                            case '解答题':
                                                type5_list.push(select_finally);
                                                break;
                                        }
                                        paper_list.push(select_finally);


                                    if (paper_list.length == total_length) {
                                        let paper = new Paper({
                                            user_id: req.session.user.user_id,
                                            subject: req.session.user.subject_default,
                                            tips: req.body.tips,
                                            level: req.body.level,
                                            data: paper_list,
                                            date: new Date()
                                        });
                                        paper.save(function (err, next) {
                                            if (err) {
                                                res.end('error', err);
                                                return next();
                                            }
                                            createFile.createFile(type1_list,type2_list,type3_list,type4_list,type5_list,req,paper);

                                            res.status(200).send({
                                                message: "ok",
                                                data: paper_list,
                                                length: paper_list.length
                                            });
                                        })
                                    }
                                }
                                //todo 下载题目
                                else {
                                    Bank.find({
                                        tips: tipsByType[j],
                                        type: type_items[i],
                                    }, {
                                        "type": 1,
                                        "tips": 1,
                                        "level": 1
                                    }, function (err, doc) {
                                        let rdIndex =  Math.floor((Math.random() * doc.length));
                                        let select_finally = doc[rdIndex];
                                        paper_list.push(select_finally);
                                        if (paper_list.length == total_length) {
                                            let paper = new Paper({
                                                user_id: req.session.user.user_id,
                                                subject: req.session.user.subject_default,
                                                tips: req.body.tips,
                                                level: req.body.level,
                                                data: paper_list,
                                                date: new Date()
                                            });
                                            paper.save(function (err, next) {
                                                if (err) {
                                                    res.end('error', err);
                                                    return next();
                                                }
                                                createFile.createFile(type1_list,type2_list,type3_list,type4_list,type5_list,req,paper);

                                                res.status(200).send({
                                                    message: "ok",
                                                    data: paper_list,
                                                    length: paper_list.length
                                                });
                                            })
                                        }
                                    })
                                }
                            })
                    }
                }
            })
    }
});


//测试 20 -》 5  level 1.8
router.get('/createpaper/:num/:level', function (req, res, next) {
    let num = req.params.num;
    let level = req.params.level;
    let level_1 = Math.floor(num * ((level / 3) / 2));
    let level_2 = Math.floor(num / 2);
    let level_3 = num - level_1 - level_2;
    let arr1 = [];

    let p1 = all.getAll("选择题", "易", level_3, arr1);
    let p2 = all.getAll("选择题", "中", level_2, arr1);
    let p3 = all.getAll("选择题", "难", level_1, arr1);
    let p4 = all.getAll("简答题", "易", level_3, arr1);
    let p5 = all.getAll("简答题", "中", level_2, arr1);
    let p6 = all.getAll("简答题", "难", level_1, arr1);

    let sp = Promise.all([p1, p2, p3, p4, p5, p6]).then(function () {


        let M = arr1.map(function (o) {
            return o.tips
        })
        let set1 = Array.from(new Set(M))
        console.log(set1.length / 10)
        if (set1.length / 10 >= 0.6) {
            let paper = new Paper({
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
//下载试卷
router.get('/download/:filename', function (req, res, next) {
    let file = filePath + '/' + req.params.filename + '.docx';
    res.download(file); // Set disposition and send it.
});

//删除试卷
router.get('/paper/:id/delete', function (req, res, next) {
    Paper.findOne({_id: req.params.id}, function (err, doc) {
        if (err) {
            res.end('err', err);
            return next();
        }

        doc.remove();
        res.redirect('/paper-bank')
    })
})
//生成word

//上传图片
router.post('/upload', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.file);
    console.log(req.body);

    res.end("上传成功");
})
/**
 * root用户接口
 **/

//登陆
router.get('/back/login', function (req, res, next) {
    if (req.query.username == 'root' && req.query.password == '123456') {
        res.redirect('/back/dashboard ')
    }
    else {
        res.status(400).send({error: 'username or password is flase'});
    }

});
//创建用户
router.get('/register', function (req, res, next) {
    let subject = (req.query.subject).split(',');
    let md5 = crypto.createHash('md5');
    md5.update(req.query.password);
    let a = md5.digest('hex');

    let schema = Joi.object().keys({
        username: Joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).required(),
    });
    Joi.validate({username: req.query.username, password: req.query.password}, schema, function (err, value) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            User.find({username: req.query.username}, function (err, docs) {
                if (err) {
                    res.end(err)
                }
                else {
                    if (docs.length == 0) {
                        let user = new User({
                            username: req.query.username,
                            password: req.query.password,
                            subject: subject,
                            remarks: req.query.remarks
                        });

                        user.save(function (err, next) {
                            if (err) {
                                res.end("error");
                                return next();
                            }
                            // res.end()
                            res.redirect('/back/dashboard')


                        })
                    } else {
                        res.status(400).send({error: 'username is used'});
                    }

                }
            })
        }

    });

});
//更新用户信息
router.get('/back/update', function (req, res, next) {
    let subject = (req.query.subject).split(',');
    User.find({username: req.query.username}, function (err, doc) {
        if (err) {
            res.end(err)
        }
        User.update({username: req.query.username}, {
            $set: {
                password: req.query.password,
                subject: subject,
                remarks: req.query.remarks
            }
        }, function (err, next) {
            if (err) {
                res.end('err', err);
                return next();
            }
            res.redirect('/back/dashboard')
        })
    })
});
//删除用户
router.get('/back/delete/:username', function (req, res, next) {

    User.findOne({username: req.params.username}, function (err, doc) {
        if (err) {
            res.end('err', err);
            return next();
        }
        doc.remove();
        res.redirect('/back/dashboard')
    })
});


//修改题目难度
router.get('/back/find_question/:q_id', function (req, res, next) {
    Bank.find({_id: req.params.q_id}, function (err, doc) {
        if (err) {
            res.end(err)
        }
        console.log(doc)
        res.render('back/find_question', {title: '更新信息', qInfo: doc[0]});
    })
});

router.get('/back/update_qLevel/:q_id', function (req, res, next) {
    Bank.find({_id: req.params.q_id}, function (err, doc) {
        if (err) {
            res.end(err)
        }
        Bank.update({_id: req.params.q_id}, {
            $set: {
                level: req.query.level,
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

/**
 * testAPI
 **/

//造数据
router.get('/addtestdata', function (req, res, next) {
    let data = Mock.mock({
        'list|10000': [{
            user_id: "582e96460522740cd397ccfa",
            "subject|1": ["物理", "高数", "英语"],
            "type|1": ["选择题", "判断题", "填空题", "简答题", "解答题"],
            tips: /知识点[0-4][0-9]/,
            "level|1": ["易", "中", "难"],
            "public|1": true,
            question: /题目[a-z]+[A-Z]+[1-9]/,
            answer: /答案[a-z]+[A-Z]+[1-9]/,
            qimgPath: ''
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
module.exports = router;


