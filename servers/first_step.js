/**
 * Created by HUI on 2016/11/17.
 */
var tipsByType = randArray(tips_selected, type_num[arg1]);
for (var j = 0; j < type_num[arg1]; j++) {(function (arg, arg4,arg5) {
        Bank.find({tips: tipsByType[i], type: type_items[arg1]}, {"type": 1,"tips": 1,"level": 1},function (err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    level_random();
                    Bank.find({
                            tips: tipsByType[arg],
                            type: type_items[arg5],
                            level: level_select
                        }, {
                            "type": 1,
                            "tips": 1,
                            "level": 1
                        },
                        function (err, docs) {
                            if (docs.length>0) {
                                var rdIndex = Math.ceil(Math.random() * (docs.length-1));
                                var select_finally = docs[rdIndex]
                                arg4.push(select_finally)
                                if (arg4.length == total_length) {
                                    res.status(200).send({
                                        message: "ok",
                                        data: paper_list,
                                        length: paper_list.length
                                    });
                                }
                            }
                            else {
                                Bank.find({
                                    tips: tipsByType[arg],
                                    type: type_items[arg5],
                                }, {
                                    "type": 1,
                                    "tips": 1,
                                    "level": 1
                                }, function (err, doc) {
                                    var rdIndex = Math.ceil(Math.random() * (doc.length-1));
                                    var select_finally = doc[rdIndex]
                                    arg4.push(select_finally)
                                    if (arg4.length == total_length) {
                                        res.status(200).send({
                                            message: "ok",
                                            data: paper_list,
                                            length: paper_list.length
                                        });
                                    }
                                })
                            }
                        })
                }

            })

    })(j, paper_list,arg1)
}