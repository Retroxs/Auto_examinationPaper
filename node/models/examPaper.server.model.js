/**
 * Created by HUI on 16/9/9.
 */
/**
 * Created by HUI on 16/9/9.
 */
var mongoose = require('mongoose');

var ExamSchema = mongoose.Schema({
    examType:String,
    level:Number
});

mongoose.model('Exam',ExamSchema);