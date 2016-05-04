$(function(){
    $('#templates-list li').click(function(){
        if(! $('#templates-list').hasClass('cover-item')){
            $('#templates-list').addClass('cover-item');
        }
        $(this).addClass('active').siblings().removeClass('active');
    });
})