/**
 * Created by HUI on 2017/3/13.
 */
/**
 * 检查数组元素的数量
 * @param arr
 * @returns {Array}
 */
exports.arrCheck=function arrCheck(arr) {
    let newArr = {};
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i];
        let count = 0;
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] == temp) {
                count++;
                arr[j] = -1;
            }
        }
        if (temp != -1) {
            newArr[temp]=count
        }
    }
    return newArr;
}