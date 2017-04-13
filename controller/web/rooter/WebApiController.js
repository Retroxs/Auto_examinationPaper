/**
 * Created by HUI on 2017/2/22.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const User = mongoose.model('User');
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
//删除用户
router.delete('/delete/:username',authToken,function (req, res, next) {

    User.findOne({username: req.params.username}, function (err, doc) {
        if (err) {
            res.status(400).send({error,err});
            return next();
        }
        else{
            doc.remove();
            res.status(200).send({message:'ok'})
        }

    })
});

module.exports = router;