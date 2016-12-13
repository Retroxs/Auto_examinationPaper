/**
 * Created by HUI on 12/12/2016.
 */
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
    "tips": [
        "知识点32",
        "知识点11",
        "知识点04",
        "知识点38",
        "知识点22",
        "知识点48",
        "知识点31",
        "知识点47"
    ],
    "__v": 0
};

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

console.log(arr)