var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var crypto = require('crypto');
var Joi = require('joi');

var User = mongoose.model('User')
/* GET apis listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//用户接口

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
                            res.status(200).send({username: req.body.username, password: req.body.password});


                        })
                    } else {
                        res.status(400).send({error: 'username is used'});
                    }

                }
            })
        }

    });  // err === null -> valid

})

module.exports = router;
