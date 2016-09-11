var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var crypto = require('crypto');
var Joi = require('joi');

var User = mongoose.model('User');
var Bank = mongoose.model('Bank');
/* GET apis listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
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

})
//登录
router.post('/login', function (req, res, next) {
    var md5 = crypto.createHash('md5');
    md5.update(req.body.password);
    var d = md5.digest('hex');
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
                res.status(200).send(docs);

                // })

            }
        }

    })
})
//更改密码
router.post('/:id/set-password',function (req,res,next) {
    var md5 = crypto.createHash('md5');
    md5.update(req.body.oldPassword);
    var b = md5.digest('hex');

    var md5_1= crypto.createHash('md5');
    md5_1.update(req.body.newPassword);
    var c = md5_1.digest('hex');
User.find({_id:req.params.id},function (err,doc) {
    if(doc[0].password==b){
        User.update({_id:req.params.id},{$set:{password:c}},function (err,next) {
            if(err){
                res.end('err',err);
                return next();
            }
            res.status(200).send({message:"change password success"})
        })
    }else{
        res.status(400).send({error:"password is error"})

    }
})
})
/*ending*/


/*题库*/
//插入题目
router.post('/bank/:user_id/create', function (req, res, next) {
    var schema = Joi.object().keys({
        type: Joi.string().required(),
        subject: Joi.string().required(),
        isOption: Joi.boolean().required(),
        options: Joi.string().required(),
        question: Joi.string().required(),
        answer: Joi.string().required(),
        level: Joi.number().required()
    });
    Joi.validate({
        type: req.body.type,
        subject: req.body.subject,
        isOption: req.body.isOption,
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer,
        level: req.body.level,
    }, schema, function (err, value) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            var bank = new Bank({
                user_id: req.params.user_id,
                type: req.body.type,
                subject: req.body.subject,
                isOption: req.body.isOption,
                question: req.body.question,
                options: req.body.options,
                answer: req.body.answer,
                level: req.body.level,
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
})
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
})
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
})
//查询题目
router.get('/bank/:user_id/list', function (req, res, next) {
    Bank.find({user_id: req.params.user_id}, function (err, docs) {
        if (err) {
            res.end('err', err);
            return next();
        }
        res.status(200).send(docs);

    })

})
/*ending*/
module.exports = router;
