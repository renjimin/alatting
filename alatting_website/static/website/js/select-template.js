var templateid = '';
$(function(){
    $('#templates-list li').click(function(){
        if(! $('#templates-list').hasClass('cover-item')){
            $('#templates-list').addClass('cover-item');
        }
        $(this).addClass('active').siblings().removeClass('active');
        templateid = $(this).data('id');
        $("#template_id").val(templateid);
    });
})
window.onload=function(){
    $('#templates-list').addClass('active');
}


function createTemplate(){
    if(templateid == ''){
        yyAlert('请选择模版!');
        return false;
    }

    $('#selForm').submit();

}