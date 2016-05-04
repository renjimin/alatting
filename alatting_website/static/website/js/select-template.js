var templateid = '';
$(function(){
    $('#templates-list li').click(function(){
        if(! $('#templates-list').hasClass('cover-item')){
            $('#templates-list').addClass('cover-item');
        }
        $(this).addClass('active').siblings().removeClass('active');
        templateid = $(this).data('id');
    });
})
window.onload=function(){
    $('#templates-list').addClass('active');
}
var request = GetRequest();


function createTemplate(){
    if(templateid == ''){
        yyAlert('请选择模版!');
        return false;
    }
    location.href = "/poster/1/?unique_name=" + request.unique_name + "&short_description=" + request.short_description + "&phone=" + request.phone + "&mobile=" + request.mobile + "&email=" + request.email + "&address="+request.address;
}