/**
 * Created by HUI on 13/04/2017.
 */
function createPaper() {
    var paperRule = {};
    var type_items_obj = {}
    paperRule.tips = [];
    paperRule.type_items = type_items_obj;
    paperRule.level = $('#level').val();
    var obj = document.getElementsByName('tips');
    var obj1 = document.getElementsByName('type_items');
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].checked) {
            paperRule.tips.push(obj[i].title)
        }
    }
    for (var j = 0; j < obj1.length; j++) {
        if (obj1[j].value >= 0) {
            type_items_obj[obj1[j].id] = parseInt(obj1[j].value)
        }

    }
    $.ajax({
        url: '/api/make_paper',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(paperRule),
        beforeSend: function (a) {
            console.log('start')
            var layer = layui.layer
            layer.load(0, {
                shade: 0.3,
                scrollbar: false
            })
        },
        success: function (data) {
            layer.alert('试卷AB卷已加入试卷库\n重复率为：' + data.semblance)
            layer.closeAll('loading'); //关闭加载层
        },
        error: function (data) {
            layer.alert(data.responseText)
            layer.closeAll('loading'); //关闭加载层
        }
    })
}
layui.use(['form'], function () {
    var form = layui.form();
    $('#checkbox-all').click(function () {
        $("input[name='tips']").prop("checked", true);
        form.render('checkbox');
    });
    $('#checkbox-cancel').click(function () {
        $("input[name='tips']").prop("checked", false);
        form.render('checkbox');
    });
    $('#checkbox-reverse').click(function () {
        $("input[name='tips']").prop("checked", function (index, attr) {
            return !attr;
        });
        form.render('checkbox');
    });
});