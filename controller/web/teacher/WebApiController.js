/**
 * Created by HUI on 2017/2/22.
 */
const express = require('express')
    , router = express.Router()
    , mongoose = require('mongoose')
    , db = mongoose.connection
    , crypto = require('crypto')
    , Joi = require('joi')
    , Mock = require('mockjs')
    , Random = Mock.Random
    , async = require('async')
    , path = require("path")
    , multer = require('multer')
    , session = require('express-session')
    , cookieParser = require('cookie-parser')
    , User = mongoose.model('User')
    , Bank = mongoose.model('Bank')
    , Paper = mongoose.model('Paper')
    , createFile = require('../../../servers/creatFile')
    , randArray = require('../../../servers/utils/randArray').randArray
    , arrCheck = require('../../../servers/utils/arrCheck').arrCheck
    , calTips = require('../../../servers/utils/calTips').calTips
    , level_random = require('../../../servers/utils/level_random').level_random

router.use(cookieParser());
//设置服务器session
router.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 24 * 60 * 60 * 1000},  //设置maxAge是ms，session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));
//数组交集
function arrayIntersection(a, b) {
    var ai = 0, bi = 0;
    var result = new Array();
    while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) {
            ai++;
        }
        else if (a[ai] > b[bi]) {
            bi++;
        }
        else /* they're equal */ {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }
    return result;
}
Array.intersect = function () {
    var result = new Array();
    var obj = {};
    for (var i = 0; i < arguments.length; i++) {
        for (var j = 0; j < arguments[i].length; j++) {
            var str = arguments[i][j];
            if (!obj[str]) {
                obj[str] = 1;
            }
            else {
                obj[str]++;
                if (obj[str] == arguments.length) {
                    result.push(str);
                }
            }//end else
        }//end for j
    }//end for i
    return result;
}


function toPercent(point) {
    var str = Number(point * 100).toFixed(1);
    str += "%";
    return str;
}
function semblance(arr) {
    let paper_a_arr = []
    let paper_b_arr = []
    let zui = arr[1]
    let sem
    arr[0].forEach(function (element) {
        paper_a_arr.push(element._id)
    })
    for (let i = 1; i < arr.length; i++) {
        let _i = i
        arr[_i].forEach(function (element) {
            paper_b_arr.push(element._id)
        })
        let sameLength = Array.intersect(paper_a_arr, paper_b_arr)
        sameLength = sameLength.length / arr[0].length

        if (_i == 1) {
            sem = sameLength
        } else if (_i == arr.length - 1) {
            if (sameLength < sem) {
                sem = sameLength
                zui = arr[_i]
            }
            return [arr[0], zui, toPercent(sem)]
        } else {
            if (sameLength < sem) {
                sem = sameLength
                zui = arr[_i]
            }
        }
        paper_b_arr = []

    }
}

//设置全局科目
router.get('/selectSubject', function (req, res) {
    if (req.session.user.subject_default = req.query.subject_default) {
        res.redirect('/home');
    }
});
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
        filepath: req.body.filepath,
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

//公共题库 =》 自己题库
router.get('/addtomybank/:id', async function (req, res, next) {
    try {
        const result = await Bank.find({_id: req.params.id})
        let user_id = result[0].user_id;
        user_id.push(req.session.user.user_id);
        try {
            await Bank.update({'_id': req.params.id}, {$set: {user_id: user_id}})
            res.status(200).send({message:'加入成功'})
        } catch (err) {
            res.status(400).send({error: '数据库错误'})
        }
    } catch (err) {
        res.status(400).send({error: '数据库错误'})
    }
});

//移除加入的题目
router.get('/movefrommybank/:id', async function (req, res, next) {
    try {
        const result = await Bank.find({_id: req.params.id})
        let user_id = result[0].user_id;
        const index =user_id.indexOf(req.session.user.user_id);
        user_id.splice(index,1)

        try {
            await Bank.update({'_id': req.params.id}, {$set: {user_id: user_id}})
            res.status(200).send({message:'移除成功'})
        } catch (err) {
            res.status(400).send({error: '数据库错误'})
        }
    } catch (err) {
        res.status(400).send({error: '数据库错误'})
    }
});

//模糊搜索
router.get('/findquestion/key/:key', function (req, res, next) {
    Bank.find({question: new RegExp(req.params.key)}, function (err, docs) {
        if (err) {
            res.end('err', err);
            return next();
        }
        else {
            res.status(200).send(docs);
        }


    })

});

//删除题目
router.delete('/bank/:id/delete', function (req, res, next) {

    Bank.findOne({_id: req.params.id}, function (err, doc) {
        if (err) {
            res.end('err', err);
            return next();
        }else{
            const user_id = doc.user_id
            const index = user_id.indexOf(req.session.user.user_id)
            if(index===0){
                doc.remove();
                res.status(200).send(doc);
            }else{
                res.status(400).send({message:'你不是这个题目的创建者'});
            }
        }

    })
});

//修改题目
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
            filepath: req.body.filepath,
        }
    }, function (err, next) {
        if (err) {
            res.end('err', err);
            return next();
        }
        res.status(200).send({message: ' update success'});

    })
});

router.post('/semblance', function (req, res, next) {
    const user_id = req.session.user.user_id;
    // const user_id ='58bbf1b8fe3d19194b924a5e';
    // const subject_default = '计算机学科基础';
    const subject_default = req.session.user.subject_default;
    let paper_a_index = req.body.a;
    let paper_b_index = req.body.b;
    Paper.find(
        {
            user_id: user_id,
            subject: subject_default
        }, function (err, doc) {


            if (paper_a_index <= 0 || paper_b_index <= 0 || paper_a_index > doc.length || paper_b_index > doc.length) {
                res.status(400).send({
                    error: '所选试卷不存在'
                })
            }
            else {
                let paper_a = doc[doc.length - paper_a_index].data
                let paper_b = doc[doc.length - paper_b_index].data
                if (paper_a.length != paper_b.length) {
                    res.status(400).send({
                        error: '所选试卷不是同一标准'
                    })
                } else {
                    let paper_a_arr = []
                    let paper_b_arr = []
                    paper_a.forEach(function (element) {
                        paper_a_arr.push(element._id)
                    })
                    paper_b.forEach(function (element) {
                        paper_b_arr.push(element._id)
                    })
                    // console.log(paper_a_arr,paper_b_arr)
                    let sameLength = Array.intersect(paper_a_arr, paper_b_arr)

                    res.status(200).send({
                        semblance: toPercent(sameLength.length / paper_a.length),
                        semblance_arr: sameLength
                    })
                }
            }

        })


})

//造数据
router.get('/addtestdata', function (req, res, next) {
    let data = Mock.mock({
        'list|10000': [{
            user_id: user_id,
            "subject|1": ["物理", "高数", "英语"],
            "type|1": ["选择题", "判断题", "填空题", "简答题", "解答题"],
            tips: /知识点[0-4][0-9]/,
            "level|1": ["易", "中", "难"],
            "public|1": true,
            question: /题目[a-z]+[A-Z]+[1-9]/,
            answer: /答案[a-z]+[A-Z]+[1-9]/,
            filepath: '../uploads/avatar.jpeg'
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

router.post('/make_paper', async function (req, res, next) {
    const user_id = req.session.user.user_id;
    const subject_default = req.session.user.subject_default;
    const tips = req.body.tips; //用户指定的知识点[array]
    const level = req.body.level; //用户指定的难度[string]
    const type_items = req.body.type_items //用户指定的题型{object}
    const reg = /^0.[1-9]+$/;
    let paper_list = [];
    let papers = [];
    const loop = 100;

    if (tips.length == 0) {
        res.status(400).send({error: '未勾选任何知识点'})
    }

    else if (reg.test(level) == false) {
        res.status(400).send({error: '输入的难度指数不符合要求（0-1）'})
    }

    else {

        //第1步：判断题目是否足够
        for (let key in type_items) {
            try {
                const result = await Bank.count({user_id: user_id, type: key, subject: subject_default}).exec()
                if (result < type_items[key]) {
                    res.status(400).send({message: `${key} 数据库存量不足`});
                    return
                } else {
                    // console.log(result)
                }
            } catch (err) {
                res.status(400).send({message: err});
                return
            }
        }

        for (let i = 0; i < loop; i++) {
            //每个题型循环一次
            for (type in type_items) {
                //第2步：判断是否包含所选的知识点
                try {
                    const result = await Bank.find({
                        tips: {$in: tips},
                        type: type,
                        user_id: user_id,
                        subject: subject_default
                    });

                    if (result.length === 0 && type_items[type] > 0) {
                        res.status(400).send({message: `${type}不包含任何知识点`});
                    }
                    else if (type_items[type] === 0) {
                        // res.status(400).send({message: `${type}为0`});
                    }
                    else {
                        const tip = calTips(result, type_items[type]);//最终筛选出的知识点[知识点:知识点所需题目数量]
                        // console.log(tip)
                        // 每个题型中每个知识点每个题目筛选出的process
                        for (let tip_key in tip) {
                            let level_select = level_random(level);

                            //搜索条件(知识点，难度，题型)
                            const result = await Bank.find(
                                {
                                    tips: tip_key,
                                    type: type,
                                    level: level_select,
                                    user_id: user_id,
                                    subject: subject_default
                                })

                            //数据库题目数量>=所需数量
                            if (result.length > 0 && result.length >= tip[tip_key]) {
                                let select_finally = randArray(result, tip[tip_key]);
                                paper_list = paper_list.concat(select_finally);
                            }

                            //数据库题目数量>=所需数量
                            else if (result.length > 0 && result.length < tip[tip_key]) {
                                let choose_temp = result;

                                //此时不考虑难度
                                const result_temp = await Bank.find(
                                    {
                                        tips: tip_key,
                                        type: type,
                                        user_id: user_id,
                                        subject: subject_default
                                    })
                                if (result_temp.length < (tip[tip_key] - choose_temp.length)) {
                                    res.status(400).send({message: `${type}无法完成出题`});
                                } else {
                                    let select_finally = randArray(result_temp, (tip[tip_key] - choose_temp.length));
                                    paper_list = paper_list.concat(select_finally).concat(choose_temp);
                                }
                            }

                            //数据库中找不到
                            else {
                                const result_temp1 = await Bank.find(
                                    {
                                        tips: tip_key,
                                        type: type,
                                        user_id: user_id,
                                        subject: subject_default
                                    })
                                if (result_temp1.length >= tip[tip_key]) {
                                    let select_finally = randArray(result_temp1, tip[tip_key]);
                                    paper_list = paper_list.concat(select_finally);
                                } else {
                                    res.status(400).send({message: `${type}中${tip_key}数量不足`});
                                }
                            }

                        }
                    }
                } catch (err) {
                    res.status(400).send({message: err});
                }

            }

            papers.push(paper_list)
            if (i === loop - 1) {
                papers = semblance(papers)
            } else {
                paper_list = []
            }

        }

        for (let i = 0; i < 2; i++) {
            let timestamp = new Date().getTime();
            let order = ""
            if (i == 0) {
                order = "A"
            } else {
                order = "B"
            }
            let paper = new Paper({
                user_id: user_id,
                subject: subject_default,
                tips: tips,
                level: level,
                data: papers[i],
                date: timestamp,
                filename: user_id + timestamp + order + ".docx"
            });

            try {
                const save = await paper.save()
                if (save) {
                    try {
                        await createFile.create(papers[i], timestamp, user_id, order);
                    } catch (err) {
                        res.status(400).send({message: '生成试卷出错'});
                    }
                }
            }
            catch (err) {
                res.status(400).send({message: '数据库链接错误'});
            }


        }
    }

    res.send({
        message: 'success',
        tips: tips,
        level: level,
        semblance: papers[2],
        length: paper_list.length,
        papers: [papers[0], papers[1]]
    })
});

module.exports = router;
