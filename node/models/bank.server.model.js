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

    subject:String,//学科
    type: String,//题型
    tips:String,//知识点
    level:String,//难度
    public:Boolean,//是否公开
    question:String,//题目
    answer:String,//答案
});


mongoose.model('Bank', BankSchema);