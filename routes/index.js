let express = require('express');
let router = express.Router();

let mongoose = require('mongoose');
let db = mongoose.connection;
let crypto = require('crypto');
let Joi = require('joi');

let session = require('express-session');
let cookieParser = require('cookie-parser');

let User = mongoose.model('User');
let Bank = mongoose.model('Bank');
let Paper = mongoose.model('Paper');

router.use(cookieParser());
router.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},  //设置maxAge是ms，session和相应的cookie失效过期
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
router.get('/',function (req,res,next) {
    res.redirect('/home')
})
router.get('/home', authToken, function (req, res, next) {
    Bank.find({user_id:req.session.user.user_id},function (err,docs) {
        if(err){
            res.end(err)
        }
        let M = docs.map(function (o) {
            return o.tips;
        });
        let allTips = Array.from(new Set(M));//对检索出的知识点进行去重
        res.render('index', {title: '录入题目',subject:req.session.user.subject,subject_default:req.session.user.subject_default,allTips:allTips});

    })
});
router.get('/edit_question/:q_id',authToken,function (req,res,next) {
    Bank.find({user_id:req.session.user.user_id},function (err,docs) {
        if(err){
            res.end(err)
        }
        let M = docs.map(function (o) {
            return o.tips;
        });
        let allTips = Array.from(new Set(M));//对检索出的知识点进行去重
        Bank.find({_id: req.params.q_id}, function (err, doc) {
            if (err) {
                res.end(err)
            }
            console.log(doc)
            res.render('index', {title: '编辑题目', qInfo: doc[0],subject:req.session.user.subject,subject_default:req.session.user.subject_default,allTips:allTips});
        })

    })


})
router.get('/back/dashboard', function (req, res, next) {
    User.find({},function (err,docs) {
        if(err){
            res.end(err);
        }
        res.render('back/home', {title: '超级管理员系统',user_info:docs});
    })


});
router.get('/back/question-manage', function (req, res, next) {
    let count = 0;
    let page = req.query.page;
    let rows = 10;
    let query = Bank.find({});
    query.skip((page - 1) * rows);
    query.limit(rows);
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
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: '后台登陆'});
});

router.get('/back/login', function (req, res, next) {
    res.render('back/login', {title: 'root登陆'});
});

router.get('/back/logout', function (req, res, next) {
    res.render('back/login', {title: 'root登陆'});
});

router.get('/back/createuser', function (req, res, next) {
    res.render('back/create_user', {title: '创建用户'});
});

router.get('/banks-list', authToken, function (req, res, next) {
    let user_id = req.session.user.user_id;
    let count = 0;
    let page = req.query.page;
    let rows = 5;
    let query = Bank.find({});
    query.skip((page - 1) * rows);
    query.limit(rows);
    if (user_id) {
        query.where('user_id', user_id).where('subject',req.session.user.subject_default).sort({_id:-1});
    }
    //计算分页数据
    query.exec(function (err, rs) {
        if (err) {
            res.send(err);
        } else {
            // 计算数据总数
            Bank.find({'user_id':user_id,'subject':req.session.user.subject_default},function (err, result) {
                res.render('banks-list', {title: '试题中心', list: rs, total: Math.ceil(result.length / rows),subject:req.session.user.subject,subject_default:req.session.user.subject_default});
            });
        }
    });

});

router.get('/make-paper', authToken, function (req, res, next) {
    Bank.find({user_id:req.session.user.user_id,subject:req.session.user.subject_default},function (err,docs) {
            if(err){
                res.end(err)
            }
        let M = docs.map(function (o) {
            return o.tips;
        });
        let allTips = Array.from(new Set(M));//对检索出的知识点进行去重
        res.render('make-paper', {title: '组卷中心',subject:req.session.user.subject,subject_default:req.session.user.subject_default,allTips:allTips});

    })

});

router.get('/paper-bank', authToken, function (req, res, next) {
    let user_id = req.session.user.user_id;
    let count = 0;
    let page = req.query.page;
    let rows = 5;
    let query = Paper.find({});
    query.skip((page - 1) * rows);
    query.limit(rows);
    if (user_id) {
        query.where('user_id', user_id).where('subject',req.session.user.subject_default).sort({_id:-1});
    }
    //计算分页数据
    query.exec(function (err, rs) {
        if (err) {
            res.send(err);
        } else {
            // 计算数据总数
            Paper.find({'user_id':user_id,'subject':req.session.user.subject_default},function (err, result) {
                res.render('paper-bank', {title: '试卷中心', list: rs, total: Math.ceil(result.length / rows),subject:req.session.user.subject,subject_default:req.session.user.subject_default});
            });
        }
    });

});

router.get('/public-bank', authToken, function (req, res, next) {
    let user_id = req.session.user.user_id;
    let count = 0;
    let page = req.query.page;
    let rows = 5;
    let query = Bank.find({});
    query.skip((page - 1) * rows);
    query.limit(rows);
    if (user_id) {
        query.where('subject',req.session.user.subject_default).where('public',true).sort({_id:-1});
    }
    //计算分页数据
    query.exec(function (err, rs) {
        if (err) {
            res.send(err);
        } else {
            // 计算数据总数
            Bank.find({'subject':req.session.user.subject_default,'public':true},function (err, result) {
                res.render('public-bank', {title: '公开题库', list: rs, total: Math.ceil(result.length / rows),subject:req.session.user.subject,subject_default:req.session.user.subject_default});
            });
        }
    });

});


module.exports = router;