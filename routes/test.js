/**
 * Created by HUI on 2017/2/21.
 */
/**
 * testAPI
 **/

//造数据
router.get('/addtestdata', function (req, res, next) {
    let data = Mock.mock({
        'list|10000': [{
            user_id: "582e96460522740cd397ccfa",
            "subject|1": ["物理", "高数", "英语"],
            "type|1": ["选择题", "判断题", "填空题", "简答题", "解答题"],
            tips: /知识点[0-4][0-9]/,
            "level|1": ["易", "中", "难"],
            "public|1": true,
            question: /题目[a-z]+[A-Z]+[1-9]/,
            answer: /答案[a-z]+[A-Z]+[1-9]/,
            qimgPath: ''
        }]
    });
    Bank.collection.insert(data.list, onInsert);
    function onInsert(err, docs) {
        if (err) {
            res.end("error");
            return next();
        } else {
            res.status(200).send({message: "done"});
        }
    }

});