/**
 * Created by HUI on 2016/11/16.
 */
var mongoose = require('mongoose');
var Bank = mongoose.model('Bank');
var Paper = mongoose.model('Paper');
var q = require('q');

function getAll(findByTips,type_num,type_items,paper_list,level_random,randArray,level_select) {
    var delay = q.defer();
    for (var i = 0; i < type_items.length; i++) {
        (function (arg1) {
            Bank.find({tips: {$in: findByTips}, type: type_items[i]}, {"type": 1, "tips": 1, "level": 1},
                function (err, docs) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        var M = docs.map(function (o) {
                            return o.tips;
                        });
                        var findByTips_selected = Array.from(new Set(M));

                        var findByTipsBY_type = randArray(findByTips_selected, type_num[arg1]);
                        for (var j = 0; j < type_num[arg1]; j++) {
                            (function (arg,arg4) {
                                Bank.find({tips: findByTipsBY_type[i], type: type_items[arg1]}, {
                                        "type": 1,
                                        "tips": 1,
                                        "level": 1
                                    },
                                    function (err, docs) {
                                        if (err) {
                                            res.send(err);

                                        } else {
                                            level_random();
                                            Bank.find({
                                                    tips: findByTipsBY_type[arg],
                                                    type: type_items[arg1],
                                                    level: level_select
                                                }, {
                                                    "type": 1,
                                                    "tips": 1,
                                                    "level": 1
                                                },
                                                function (err, docs) {
                                                    var rdIndex = Math.ceil(Math.random() * (docs.length - 1));
                                                    var select_finally = docs[rdIndex]

                                                    // console.log(select_finally)
                                                    arg4.push(select_finally)
                                                    // console.log(arg4)
                                                })

                                        }

                                    })

                            })(j,paper_list)
                        }
                    }
                })

        })(i)
    }
    delay.resolve(paper_list)
    return delay.promise
};


module.exports.getAll = getAll;
