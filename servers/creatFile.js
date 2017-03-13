/**
 * Created by HUI on 23/01/2017.
 */
let async = require('async');
let fs = require("fs");
let path = require("path");
let filePath = path.join(__dirname, '../public/tmp/paper_tmp');
let officegen = require('officegen');

exports.create = function (type1_list, type2_list, type3_list, type4_list, type5_list, time,id) {
    // console.log(type1_list.length+','+type2_list.length+','+type3_list.length+','+type4_list.length+','+type5_list.length)
    let docx = officegen('docx')
    docx.on('error', function (err) {
        console.log(err);
    });

    var pObj = docx.createP({align: 'center'});
    pObj.addText(' 苏州科技大学试卷', {font_face: 'Arial', font_size: 40});
    pObj.addLineBreak();

    var pObj = docx.createP({align: 'left'});
    pObj.addText('选择题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type1_list.length; i++) {

        var pObj = docx.createListOfNumbers();
        pObj.addText(type1_list[i].level + ' ' + type1_list[i].type + ' ' + type1_list[i].tips + ' ' + type1_list[i].question);

    }

    var pObj = docx.createP({align: 'left'});
    pObj.addText('填空题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type2_list.length; i++) {

        var pObj = docx.createListOfNumbers();

        pObj.addText(type2_list[i].level + ' ' + type2_list[i].type + ' ' + type2_list[i].tips + ' ' + type2_list[i].question);


    }

    var pObj = docx.createP({align: 'left'});
    pObj.addText('判断题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type3_list.length; i++) {

        var pObj = docx.createListOfNumbers();

        pObj.addText(type3_list[i].level + ' ' + type3_list[i].type + ' ' + type3_list[i].tips + ' ' + type3_list[i].question);


    }

    var pObj = docx.createP({align: 'left'});
    pObj.addText('简答题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type4_list.length; i++) {
        var pObj = docx.createListOfNumbers();

        pObj.addText(type4_list[i].level + ' ' + type4_list[i].type + ' ' + type4_list[i].tips + ' ' + type4_list[i].question);

    }

    var pObj = docx.createP({align: 'left'});
    pObj.addText('解答题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type5_list.length; i++) {
        var pObj = docx.createListOfNumbers();

        pObj.addText(type5_list[i].level + ' ' + type5_list[i].type + ' ' + type5_list[i].tips + ' ' + type5_list[i].question);
        pObj.addImage (path.join(__dirname, type5_list[i].filepath), { cx: 100, cy: 100 }  );


    }

    var pObj = docx.createP({align: 'center'});
    pObj.addText(' 答案', {font_face: 'Arial', font_size: 40});
    pObj.addLineBreak();

    var pObj = docx.createP({align: 'left'});
    pObj.addText('选择题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type1_list.length; i++) {

        var pObj = docx.createListOfNumbers();

        pObj.addText(type1_list[i].answer);


    }

    var pObj = docx.createP({align: 'left'});
    pObj.addText('判断题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type2_list.length; i++) {

        var pObj = docx.createListOfNumbers();

        pObj.addText(type2_list[i].answer);


    }

    var pObj = docx.createP({align: 'left'});
    pObj.addText('填空题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type3_list.length; i++) {

        var pObj = docx.createListOfNumbers();

        pObj.addText(type3_list[i].answer);


    }

    var pObj = docx.createP({align: 'left'});
    pObj.addText('简答题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type4_list.length; i++) {
        var pObj = docx.createListOfNumbers();

        pObj.addText(type4_list[i].answer);

    }

    var pObj = docx.createP({align: 'left'});
    pObj.addText('解答题', {font_face: 'Arial', font_size: 14});
    pObj.addLineBreak();
    for (let i = 0; i < type5_list.length; i++) {
        var pObj = docx.createListOfNumbers();

        pObj.addText(type5_list[i].answer);
    }

    let out = fs.createWriteStream(filePath + "/" + id + time + ".docx");

    out.on('error', function (err) {
        console.log(err);
    });

    async.parallel([
        function (done) {
            out.on('close', function () {
                console.log('Finish to create a DOCX file.');
                done(null);
            });
            docx.generate(out);
        }

    ], function (err) {
        if (err) {
            console.log('error: ' + err);
        } // Endif.
    });
}