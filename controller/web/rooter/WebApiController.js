/**
 * Created by HUI on 2017/2/22.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const User = mongoose.model('User');

//删除用户
router.delete('/delete/:username', function (req, res, next) {

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