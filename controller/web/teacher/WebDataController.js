/**
 * Created by HUI on 2017/2/22.
 */
const express = require('express');
const router = express.Router();
const path = require("path");
const mongoose = require('mongoose');
const db = mongoose.connection;
const User = mongoose.model('User');
const Bank = mongoose.model('Bank');
const Paper = mongoose.model('Paper');
const session = require('express-session');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},  //设置maxAge是ms，session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));

//登录
router.post('/login', function (req, res, next) {
    // let md5 = crypto.createHash('md5');
    // md5.update(req.body.password);
    // let d = md5.digest('hex');
    let user_session = {
        username: req.body.username,
        password: req.body.password
    };
    User.find({username: req.body.username, password: req.body.password}, function (err, docs) {
        if (err) {
            res.end(err);
        } else {
            if (docs.length == 0) {
                res.render('login', {username: req.body.username, error: 'username or password is flase'})
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

module.exports = router;