/**
 * Created by HUI on 2016/11/10.
 */
function submitTest() {
    const addQ_obj = {};
    const subject=document.getElementById("subject");
    var subject_index=subject.selectedIndex ;
    const type=document.getElementById("type");
    var type_index=type.selectedIndex ;

    addQ_obj.subject = subject.options[subject_index].text;
    addQ_obj.type = type.options[type_index].text;
    addQ_obj.tips = $('#tips').val();
    addQ_obj.level = $("input[name='level']:checked").val();
    addQ_obj.question = $('#question').val();
    addQ_obj.answer = $('#answer').val();
    addQ_obj.public = $("#isPublic").is(':checked');

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
           alert('success')
        },
        error: function () {

        }
    })

}
