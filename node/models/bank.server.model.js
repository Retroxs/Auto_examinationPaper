/**
 * Created by HUI on 16/9/10.
 */
/**
 * Created by HUI on 16/9/9.
 */
var mongoose = require('mongoose');

var BankSchema = mongoose.Schema({
    user_id: String,

    //学科 题型 知识点 难度 是否公开 题目 答案
    subject:String,
    type: String,
    tips:String,
    level:String,
    public:Boolean,
    question:String,
    answer:String,
});


mongoose.model('Bank', BankSchema);