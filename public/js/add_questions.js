/**
 * Created by HUI on 2016/11/10.
 */

function createQuestion() {
    var addQ_obj = {};
    var tips = document.getElementById("tips");
    // var tips_index = tips.selectedIndex;

    var type = document.getElementById("type");
    var type_index = type.selectedIndex;

    addQ_obj.filepath="../uploads/"+$("#attachment").val()
    addQ_obj.subject = subject.value;
    addQ_obj.type = type.options[type_index].text;
    addQ_obj.tips = tips.value;
    addQ_obj.level = $("input[name='level']:checked").val();
    addQ_obj.question = $('#question').val();
    addQ_obj.answer = $('#answer').val();
    addQ_obj.public = $("#isPublic").is(':checked');
    if(addQ_obj.tips&&addQ_obj.question&&addQ_obj.answer){
        $.ajax({
            url: '/api/bank/create',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(addQ_obj),
            beforeSend: function (a) {
                // layer.load(1, {
                //     shade: [0.1, '#fff'] //0.1透明度的白色背景
                // });
            },
            success: function () {
                layer.open({
                    content: '录入成功',
                    yes: function (index, layero) {
                        window.location.href='/home '
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                })

            },
            error: function () {

            }
        })
    }
    else {
            layer.alert('请填写必要项')
    }


}


function updateQuestion(id) {
    var addQ_obj = {};
    var tips = document.getElementById("tips");
    // var tips_index = tips.selectedIndex;

    var type = document.getElementById("type");
    var type_index = type.selectedIndex;
    addQ_obj.subject = subject.value;
    addQ_obj.type = type.options[type_index].text;
    addQ_obj.tips = tips.value;
    addQ_obj.level = $("input[name='level']:checked").val();
    addQ_obj.question = $('#question').val();
    addQ_obj.answer = $('#answer').val();
    addQ_obj.public = $("#isPublic").is(':checked');
    addQ_obj.filepath="../uploads/"+$("#attachment").val()
    if(addQ_obj.tips&&addQ_obj.question&&addQ_obj.answer){
        $.ajax({
            url: '/api/bank/'+id+'/update',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(addQ_obj),
            beforeSend: function (a) {
                // layer.load(1, {
                //     shade: [0.1, '#fff'] //0.1透明度的白色背景
                // });
            },
            success: function () {
                layer.open({
                    content: '修改成功',
                    yes: function (index, layero) {
                        window.location.href='/home '
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                })

            },
            error: function () {

            }
        })
    }
    else {
        layer.alert('请填写必要项')
    }


}
