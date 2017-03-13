/**
 * Created by HUI on 2017/3/13.
 */
/**
 * 计算每个知识点所需要的题目数量
 * @param doc
 * @param type_num
 * @returns {Array}
 */
const arrCheck=require('./arrCheck').arrCheck;
const randArray=require('./randArray').randArray
exports.calTips=function calTips(doc, type_num) {

    let M = doc.map(function (o) {
        return o.tips;
    });

    let tips_selected = Array.from(new Set(M));//对检索出的知识点进行去重

    //检索出的知识点数数量大于题量(从知识点中随即筛选)
    if (tips_selected.length >= type_num) {
        return arrCheck(randArray(tips_selected, type_num));

    }
    //检索出的知识点数数量小于题量(从知识点中随即筛选)
    else {
        let tips_selectedTmp = tips_selected;
        let parse_int = parseInt(type_num / tips_selected.length)
        for (let x = 1; x < parse_int; x++) {
            //如果是倍数增长就把数组复制相应份数组合
            tips_selected = tips_selected.concat(tips_selectedTmp);
        }

        let tip1 = randArray(tips_selectedTmp, type_num % tips_selected.length);
        return arrCheck(tips_selected.concat(tip1));
    }
};

