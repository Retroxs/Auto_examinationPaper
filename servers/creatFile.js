/**
 * Created by HUI on 23/01/2017.
 */
let fs = require("fs");
let path = require("path");
let filePath = path.join(__dirname, '../public/tmp/paper_tmp');
let officegen = require('officegen');
let docx = officegen('docx');

function createFile(type1_list,type2_list,type3_list,type4_list,type5_list,req,paper) {
    docx.on('finalize', function (written) {
        console.log('Finish to create Word file.\nTotal bytes created: ' + written + '\n');
    });
    docx.on('error', function (err) {
        console.log(err);
    });

    let arr_paper1 = [{}];
    let arr_paper2 = [{}];
    let arr_paper3 = [{}];
    let arr_paper4 = [{}];
    let arr_paper5 = [{}];

    for (let i = 0; i < type1_list.length; i++) {
        arr_paper1.push(
            {
                type: "dotlist"
            },
            {
                type: "text",
                text: "dottype1_list.",
                val: type1_list[i].level + ' ' + type1_list[i].type + ' ' + type1_list[i].tips + ' ' + type1_list[i].question
            }
        )
    }
    for (let i = 0; i < type2_list.length; i++) {
        arr_paper2.push(
            {
                type: "dotlist"
            },
            {
                type: "text",
                text: "dottype1_list.",
                val: type2_list[i].level + ' ' + type2_list[i].type + ' ' + type2_list[i].type + ' ' + type2_list[i].tips + ' ' + type2_list[i].question
            }
        )
    }
    for (let i = 0; i < type3_list.length; i++) {
        arr_paper3.push(
            {
                type: "dotlist"
            },
            {
                type: "text",
                text: "dottype1_list.",
                val: type3_list[i].level + ' ' + type3_list[i].type + ' ' + type3_list[i].tips + ' ' + type3_list[i].question
            }
        )
    }
    for (let i = 0; i < type4_list.length; i++) {
        arr_paper4.push(
            {
                type: "dotlist"
            },
            {
                type: "text",
                text: "dottype1_list.",
                val: type4_list[i].level + ' ' + type4_list[i].type + ' ' + type4_list[i].tips + ' ' + type4_list[i].question
            }
        )
    }
    for (let i = 0; i < type5_list.length; i++) {
        arr_paper5.push(
            {
                type: "dotlist"
            },
            {
                type: "text",
                text: "dottype1_list.",
                val: type5_list[i].level + ' ' + type5_list[i].type + ' ' + type5_list[i].tips + ' ' + type5_list[i].question
            }
        )
    }

    let data_paper = [
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
                val: "XXX大学期末试卷(" + req.session.user.subject_default + ")",
                opt: {font_face: 'Arial', font_size: 30}
            }
        ],

        [
            {align: 'left'},
            {
                type: "text",
                val: "选择题",
                opt: {font_face: 'Arial', font_size: 20}
            }
        ],
        arr_paper1,
        [
            {align: 'left'},
            {
                type: "text",
                val: "填空题",
                opt: {font_face: 'Arial', font_size: 20}
            }
        ],
        arr_paper2,
        [
            {align: 'left'},
            {
                type: "text",
                val: "判断题",
                opt: {font_face: 'Arial', font_size: 20}
            }
        ],
        arr_paper3,
        [
            {align: 'left'},
            {
                type: "text",
                val: "解答题",
                opt: {font_face: 'Arial', font_size: 20}
            }
        ],
        arr_paper4,
        [
            {align: 'left'},
            {
                type: "text",
                val: "简答题",
                opt: {font_face: 'Arial', font_size: 20}
            }
        ],
        arr_paper5

    ];

    let pObj = docx.createByJson(data_paper);

    let out = fs.createWriteStream(filePath + '/' +paper.date + '.docx');

    out.on('error', function (err) {
        console.log(err);
    });
    docx.generate(out);
}
module.exports.createFile=createFile;