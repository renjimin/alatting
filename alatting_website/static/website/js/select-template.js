$(function () {
    var selectTemplateId = "";

    $('#templates-list li').click(function () {
        if (!$('#templates-list').hasClass('cover-item')) {
            $('#templates-list').addClass('cover-item');
        }
        $(this).addClass('active').siblings().removeClass('active');
        selectTemplateId = $(this).data('id');
        $("#template_id").val(selectTemplateId);
    });

    $(".create-template").click(function(){
        if (selectTemplateId == '') {
            yyAlert('请选择模版!');
            return false;
        }
        $.fn.yyTools.mask(1);
        $.get(
            "/api/v1/poster/templates/" + selectTemplateId,
            function(resp){
                if(!resp.file_exists){
                    $.fn.yyTools.mask();
                    yyAlert("所选模板暂不可用，请重新选择");
                    return false;
                }else{
                    $('#selForm').submit();
                }
            }
        );
    });

    $(".history-back").click(function () {
        window.location.href = $(this).data('back-url');
    });
});


window.onload = function () {
    $('#templates-list').addClass('active');
};