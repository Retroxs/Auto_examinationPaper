/**
 * Created by HUI on 2017/3/13.
 */
/**
 * 计算随机难度
 * @param level
 * @returns {*}
 */
exports.level_random=function level_random(level) {
    let rand = Math.random();
    if (rand <= 0.5) {
        return "中"
    } else if (rand > 0.5 && rand <= 0.5 + (level * 0.5)) {
        return "难"
    } else {
        return "易"
    }

}