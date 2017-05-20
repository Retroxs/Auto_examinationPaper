/**
 * Created by HUI on 2016/11/11.
 */
function show_question(self) {
    $.ajax({
        url: '/api/findQuestion/'+self.id,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (a) {
            // layer.load(1, {
            //     shade: [0.1, '#fff'] //0.1透明度的白色背景
            // });
        },
        success: function (qd) {
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.open({
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['420px', '240px'], //宽高
                    content: '科目：'+qd[0].subject+'<br>题型：'+qd[0].type+'<br>知识点：'+qd[0].tips+'<br>难度：'+qd[0].level+'<br>题目：'+qd[0].question+'<br>答案：'+qd[0].answer+'<br>'
                });
            });
        },
        error: function () {
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.open({
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['420px', '240px'], //宽高
                    content: '信息获取失败'
                });
            });
        }
    })
}

function delete_question(self) {
    $.ajax({
        url: '/api/bank/'+self.name+'/delete',
        type: 'delete',
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (a) {
            // layer.load(1, {
            //     shade: [0.1, '#fff'] //0.1透明度的白色背景
            // });
        },
        success: function (qd) {
            console.log('delete success'+qd[0]);
            location.reload()
        },
        error: function () {
            layer.alert('你无权限删除此条题目')

        }
    })
}

function add(self) {
    $.ajax({
        url: '/api/addtomybank/'+self.id,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (a) {
            // layer.load(1, {
            //     shade: [0.1, '#fff'] //0.1透明度的白色背景
            // });
        },
        success: function (qd) {
            location.reload()
        },
        error: function () {
            layer.alert('添加失败')
            console.log('delete failed');

        }
    })
}

function remove(self) {
    $.ajax({
        url: '/api/movefrommybank/'+self.id,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (a) {
            // layer.load(1, {
            //     shade: [0.1, '#fff'] //0.1透明度的白色背景
            // });
        },
        success: function (qd) {
            location.reload()
        },
        error: function () {
            layer.alert('移除失败')
            console.log('delete failed');

        }
    })
}