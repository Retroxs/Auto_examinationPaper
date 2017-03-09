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
    , path = require("path")
    , multer = require('multer')
    , session = require('express-session')
    , cookieParser = require('cookie-parser')
    , User = mongoose.model('User')
    , Bank = mongoose.model('Bank')
    , Paper = mongoose.model('Paper')
const createFile = require('../../../servers/creatFile');

router.use(cookieParser());
//设置服务器session
router.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 24 * 60 * 60 * 1000},  //设置maxAge是ms，session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));

//数组 m 中随机取出 n 个值(m is array;len is num)
function randArray(m, len) {
    m.sort(function () {
        return Math.random() - 0.5;
    });
    return m.slice(0, len);
}
//
function arrCheck(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i];
        let count = 0;
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] == temp) {
                count++;
                arr[j] = -1;
            }
        }
        if (temp != -1) {
            newArr.push(temp + ":" + count)
        }
    }
    return newArr;
}
function calTips(doc, type_num) {

    let M = doc.map(function (o) {
        return o.tips;
    });

    let tips_selected = Array.from(new Set(M));//对检索出的知识点进行去重

    //检索出的知识点数数量大于题量(从知识点中随即筛选)
    if (tips_selected.length >= type_num) {
        return arrCheck(randArray(tips_selected, type_num));

    }
    //检索出的知识点数数量小于题量(从知识点中随即筛选)
    else {
        let tips_selectedTmp = tips_selected;
        let parse_int = parseInt(type_num / tips_selected.length)
        for (let x = 1; x < parse_int; x++) {
            //如果是倍数增长就把数组复制相应份数组合
            tips_selected = tips_selected.concat(tips_selectedTmp);
        }

        let tip1 = randArray(tips_selectedTmp, type_num % tips_selected.length);
        return arrCheck(tips_selected.concat(tip1));
    }
}
function level_random(level) {
    let rand = Math.random();
    if (rand <= 0.5) {
        return "中"
    } else if (rand > 0.5 && rand <= 0.5 + (level * 0.5)) {
        return "难"
    } else {
        return "易"
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

//出卷
//Todo  change main line to tips on base
router.post('/make_paper', function (req, res, next) {
    let tips = req.body.tips; //用户指定的知识点[array]
    let level = req.body.level; //用户指定的难度[string]
    let type_items = Object.keys(req.body.type_items); //用户指定的题型[object]
    let tip = [];//最终筛选出的每道题目的知识点[array]
    let type1_list = [],//选择
        type2_list = [],//填空
        type3_list = [],//判断
        type4_list = [],//简答
        type5_list = [],//解答
        paper_list = [];//试卷
    let type_num = [];//每个类型对应的题数[array]
    let total_length = 0; //试卷的总长度[string]
    let errorArr = [];//错误集合

    //计算每种题型的数量，以及试题的总长度
    for (item in req.body.type_items) {
        type_num.push(req.body.type_items[item])  //用户指定的题型数量
        total_length = total_length + req.body.type_items[item]; //用户指定的题型数量总和
    }

    //每个题型循环一次
    for (let i = 0; i < type_items.length; i++) {
        Bank.find(
            {
                tips: {$in: tips},
                type: type_items[i],
                user_id: "58bbf1b8fe3d19194b924a5e"
            },
            function (err, docs) {

                //该题目类型不包含指定的任一知识点
                if (docs.length === 0) {
                    console.log(type_items[i] + '不包含所选的任一知识点');
                    errorArr.push(type_items[i] + '不包含所选的知识点')
                    let select_finally = [];
                    select_finally.length = type_num[i];
                    paper_list = paper_list.concat(select_finally);
                    //出卷结束判定
                    if (paper_list.length == total_length) {

                        if (errorArr.length > 0) {
                            res.status(400).send({
                                error: errorArr
                            });
                        }
                        else {
                            res.status(200).send({
                                message: "ok",
                                data: paper_list,
                                length: paper_list.length
                            })
                        }
                    }
                }

                else {
                    tip = calTips(docs, type_num[i]);//最终筛选出的知识点[知识点:知识点所需题目数量]

                    // 每个题型中每个知识点每个题目筛选出的process
                    for (let j = 0; j < tip.length; j++) {


                        let tipTmp = tip;//由于闭包转换临时变量
                        let tip_temp = (tipTmp[j].split(':'))[0];
                        let tip_num = (tipTmp[j].split(':'))[1];
                        let level_select = level_random(level);

                        Bank.find(
                            {
                                tips: tip_temp,
                                type: type_items[i],
                                level: level_select,
                                user_id: "58bbf1b8fe3d19194b924a5e"
                            },
                            function (err, docs) {
                                if (docs.length > 0 && docs.length >= tip_num) {

                                    let select_finally = randArray(docs, tip_num);

                                    switch (type_items[i]) {
                                        case '选择题':
                                            type1_list = type1_list.concat(select_finally);
                                            break;
                                        case '填空题':
                                            type2_list = type2_list.concat(select_finally);
                                            break;
                                        case '判断题':
                                            type3_list = type3_list.concat(select_finally);
                                            break;
                                        case '简答题':
                                            type4_list = type4_list.concat(select_finally);
                                            break;
                                        case '解答题':
                                            type5_list = type5_list.concat(select_finally);
                                            break;
                                    }

                                    paper_list = paper_list.concat(select_finally);

                                    //出卷结束判定
                                    if (paper_list.length == total_length) {

                                        if (errorArr.length > 0) {
                                            res.status(400).send({
                                                error: errorArr
                                            });
                                        }
                                        else {
                                            let timestamp = new Date().getTime();
                                            let paper = new Paper({
                                                // user_id: req.session.user.user_id,
                                                user_id: "582e96460522740cd397ccfa",
                                                // subject: req.session.user.subject_default,
                                                subject: "计算机学科基础",
                                                tips: req.body.tips,
                                                level: req.body.level,
                                                data: paper_list,
                                                date: timestamp,
                                                filename: "582e96460522740cd397ccfa_" + timestamp + ".docx"
                                            });
                                            paper.save(function (err, next) {
                                                if (err) {
                                                    res.end('error', err);
                                                    return next();
                                                }
                                                createFile.create(type1_list, type2_list, type3_list, type4_list, type5_list, timestamp);
                                                res.status(200).send({
                                                    message: "ok",
                                                    data: paper_list,
                                                    length: paper_list.length
                                                });
                                            })
                                        }
                                    }

                                }


                                else if (docs.length > 0 && docs.length < tip_num) {
                                    let choose_temp = docs;
                                    paper_list = paper_list.concat(choose_temp);
                                    Bank.find(
                                        {
                                            tips: tip_temp,
                                            type: type_items[i],
                                            user_id: "58bbf1b8fe3d19194b924a5e"
                                        },
                                        function (err, docs) {
                                            if (docs.length < (tip_num - choose_temp.length)) {
                                                console.log('错误2');
                                                errorArr.push(type_items[i] + '错误');
                                                let select_finally = [];
                                                select_finally.length = (tip_num - choose_temp.length)
                                                paper_list = paper_list.concat(select_finally);
                                            }
                                            else {
                                                let select_finally = randArray(docs, tip_num - choose_temp.length);
                                                switch (type_items[i]) {
                                                    case '选择题':
                                                        type1_list = type1_list.concat(select_finally);
                                                        break;
                                                    case '填空题':
                                                        type2_list = type2_list.concat(select_finally);
                                                        break;
                                                    case '判断题':
                                                        type3_list = type3_list.concat(select_finally);
                                                        break;
                                                    case '简答题':
                                                        type4_list = type4_list.concat(select_finally);
                                                        break;
                                                    case '解答题':
                                                        type5_list = type5_list.concat(select_finally);
                                                        break;
                                                }
                                                paper_list = paper_list.concat(select_finally);

                                            }

                                            //出卷结束判定
                                            if (paper_list.length == total_length) {

                                                if (errorArr.length > 0) {
                                                    res.status(400).send({
                                                        error: errorArr
                                                    });
                                                }
                                                else {
                                                    let timestamp = new Date().getTime();
                                                    let paper = new Paper({
                                                        // user_id: req.session.user.user_id,
                                                        user_id: "582e96460522740cd397ccfa",
                                                        // subject: req.session.user.subject_default,
                                                        subject: "计算机学科基础",
                                                        tips: req.body.tips,
                                                        level: req.body.level,
                                                        data: paper_list,
                                                        date: timestamp,
                                                        filename: "582e96460522740cd397ccfa_" + timestamp + ".docx"
                                                    });
                                                    paper.save(function (err, next) {
                                                        if (err) {
                                                            res.end('error', err);
                                                            return next();
                                                        }
                                                        createFile.create(type1_list, type2_list, type3_list, type4_list, type5_list, timestamp);
                                                        res.status(200).send({
                                                            message: "ok",
                                                            data: paper_list,
                                                            length: paper_list.length
                                                        });
                                                    })
                                                }
                                            }
                                        })

                                }
                                else {
                                    Bank.find(
                                        {
                                            tips: tip_temp,
                                            type: type_items[i],
                                            user_id: "58bbf1b8fe3d19194b924a5e"
                                        },
                                        function (err, docs) {
                                            if (docs.length ==0) {
                                                console.log('错误3');
                                                errorArr.push(type_items[i] + '错误3');
                                                let select_finally = [];
                                                select_finally.length = tip_num;
                                                paper_list = paper_list.concat(select_finally);
                                            }
                                            else {
                                                let select_finally = randArray(docs, tip_num);
                                                switch (type_items[i]) {
                                                    case '选择题':
                                                        type1_list = type1_list.concat(select_finally);
                                                        break;
                                                    case '填空题':
                                                        type2_list = type2_list.concat(select_finally);
                                                        break;
                                                    case '判断题':
                                                        type3_list = type3_list.concat(select_finally);
                                                        break;
                                                    case '简答题':
                                                        type4_list = type4_list.concat(select_finally);
                                                        break;
                                                    case '解答题':
                                                        type5_list = type5_list.concat(select_finally);
                                                        break;
                                                }
                                                paper_list = paper_list.concat(select_finally);

                                            }

                                            //出卷结束判定
                                            if (paper_list.length == total_length) {

                                                if (errorArr.length > 0) {
                                                    res.status(400).send({
                                                        error: errorArr
                                                    });
                                                }
                                                else {
                                                    let timestamp = new Date().getTime();
                                                    let paper = new Paper({
                                                        // user_id: req.session.user.user_id,
                                                        user_id: "582e96460522740cd397ccfa",
                                                        // subject: req.session.user.subject_default,
                                                        subject: "计算机学科基础",
                                                        tips: req.body.tips,
                                                        level: req.body.level,
                                                        data: paper_list,
                                                        date: timestamp,
                                                        filename: "582e96460522740cd397ccfa_" + timestamp + ".docx"
                                                    });
                                                    paper.save(function (err, next) {
                                                        if (err) {
                                                            res.end('error', err);
                                                            return next();
                                                        }
                                                        createFile.create(type1_list, type2_list, type3_list, type4_list, type5_list, timestamp);
                                                        res.status(200).send({
                                                            message: "ok",
                                                            data: paper_list,
                                                            length: paper_list.length
                                                        });
                                                    })
                                                }
                                            }
                                        })

                                }
                            })


                    }
                }
            })

    }


});


//造数据
router.get('/addtestdata', function (req, res, next) {
    let data = Mock.mock({
        'list|10000': [{
            user_id: "58bbf1b8fe3d19194b924a5e",
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

module.exports = router;
