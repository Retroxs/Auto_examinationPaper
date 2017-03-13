/**
 * Created by HUI on 2017/3/13.
 */

/**
 * 数组 m 中随机取出 n 个值(m is array;len is num)
 * @param m
 * @param len
 * @returns {string|ArrayBuffer|Query|Blob|Array.<T>|*}
 */
exports.randArray=function randArray(m, len) {
    m.sort(function () {
        return Math.random() - 0.5;
    });
    return m.slice(0, len);
}