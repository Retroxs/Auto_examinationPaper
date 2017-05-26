/**
 * Created by HUI on 26/05/2017.
 */
const csv = require('fast-csv')
const fs = require('fs');
const iconv = require('iconv-lite');
var ws = fs.createWriteStream("my333.csv")

var arr = [{_id: "591e7fc3a8b4f21d909f90c6", subject: '软件项目管理'},
]
csv
    .write(arr, {headers: true})
    .pipe(ws);

