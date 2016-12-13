/**
 * Created by HUI on 2016/11/8.
 */
var officegen = require('officegen');
var fs = require('fs');
var docx = officegen('docx');

//初始化
docx.on('finalize', function (written) {
    console.log('Finish to create Word file.\nTotal bytes created: ' + written + '\n');
});

docx.on('error', function (err) {
    console.log(err);
});

var a = {
    "data": [
        {
            "type": "选择题",
            "tips": "知识点22",
            "level": "易",
            "question": "云题题库:题目zykGSE5",
            "answer": "云题题库:答案tfkkmqwYO5"
        },
        {
            "type": "选择题",
            "tips": "知识点48",
            "level": "中",
            "question": "云题题库:题目badjnOQX5",
            "answer": "云题题库:答案pfM8"
        },
        {
            "type": "选择题",
            "tips": "知识点11",
            "level": "易",
            "question": "云题题库:题目xowgVD8",
            "answer": "云题题库:答案qQTBROLA4"
        },

    ],
}
//自定义内容
var arr =[{}];

for (let i =0;i<a.data.length;i++){
    arr.push(
        {
            type: "dotlist"
        },
        {
            type: "text",
            text: "dotlist1.",
            val:a.data[i].question
        }
    )
}

var data = [
    [
        {align: 'right'},
        {
            type: "text",
            val: "Created"
        },
        {
            type: "text",
            val: " by YunTi",
            opt: {color: '000088'}
        },
    ],

    {
        type: "horizontalline"
    },

    [
        {align: 'center'},
        {
            type: "text",
            val: "XXX大学期末试卷",
            opt: {font_face: 'Arial', font_size: 40}
        }
    ],
    arr
]

var pObj = docx.createByJson(data);

var out = fs.createWriteStream('../public/tmp/test1.docx');

out.on('error', function (err) {
    console.log(err);
});
docx.generate(out);