/**
 * Created by HUI on 2016/10/27.
 */
var mongoose = require('mongoose');

var PaperSchema = mongoose.Schema({
    subject:String,
    level:String,
    data:Array
});
mongoose.model('Paper', PaperSchema);