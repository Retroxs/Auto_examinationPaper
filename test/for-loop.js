/**
 * Created by HUI on 2017/2/25.
 */

function randArray(m, len) {
    m.sort(function () {
        return Math.random() - 0.5;
    });
    return m.slice(0, len);
}
let a=[1,2,3,4];
let b=5;
function calTips(a, b) {
    if (a.length >= b) {
        return randArray(a, b);
    }
    //检索出的知识点数数量小于题量(从知识点中随即筛选)
    else {

        let tips_selectedTmp = a;
        let c =parseInt(b/a.length)
        for (let x = 1; x<c; x++) {
            //如果是倍数增长就把数组复制相应份数组合
            a = a.concat(tips_selectedTmp);
            console.log(a)


        }
        let tip1 = randArray(tips_selectedTmp, b % a.length);
        return a.concat(tip1);
    }
}

console.log(calTips(a,b).length)
