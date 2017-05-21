/**
 * Created by HUI on 2017/5/20.
 */
const csv = require('fast-csv')
const fs = require('fs');
const iconv = require('iconv-lite');
const lineReader = require('line-reader');
const csv_validate = ['type','tips','question','answer','level'].sort().toString()
let is_csv =false
function csv_v(data) {
    return ((Object.keys(data)).sort().toString() === csv_validate)
}
var stream = fs.createReadStream('test01.csv')
    .pipe(iconv.decodeStream('GBK'))

csv
    .fromStream(stream, {
        headers: true,
        quoteHeaders: [false, true]
    })
    .validate(function(data){
        return csv_v(data)
    })
    .on("data-invalid", function(data){
        // console.log(data)
    })
    .on("data", function(data){
        is_csv=true
        console.log(data['type']);
    })
    .on("end", function(){
        if(is_csv){
            console.log("done");
        }
        else{
            console.log('')
        }
        is_csv =false
    });