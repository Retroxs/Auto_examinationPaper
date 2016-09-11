/**
 * Created by HUI on 16/9/10.
 */
/**
 * Created by HUI on 16/9/9.
 */
var mongoose = require('mongoose');

var BankSchema = mongoose.Schema({
    user_id: String,
    type: String,
    subject:String,
    isOption:Boolean,
    options:String,
    question:String,
    answer:String,
    level:Number,
});


mongoose.model('Bank', BankSchema);