$(function(){
    $("#catelist .item-link").click(function(){
        if($(this).parent().hasClass('open')){
             $(this).parent().find('.sublist').slideUp(200);
            $(this).parent().removeClass('open');
        }else{
            $(this).parent().addClass('open');
            $(this).parent().siblings().removeClass('open').find('.sublist').slideUp(200);
            $(this).parent().find('.sublist').slideDown(200);
        }

    });
    $('#btn-create').click(function(){
        var login_url = $(this).data('login');
        if(login_url != ""){
            yyAlert("您需要登录才能创建海报", function () {
                window.location.href = login_url;
            });
            return false;
        }
        if($('#type-model').hasClass('open')){
            $('#type-model').removeClass('open');
            $('#type-model').off('touchstart');
        }else{
            $('#type-model').css('top',$('body').scrollTop()+'px');
            $('#type-model').addClass('open');
            var top,startY;
            $('#type-model .type-model-containar').on({
                'touchstart':function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    e.preventDefault();e.stopPropagation();
                    var touch = e.touches[0];
                    startY = touch.pageY;
                    top = $('#type-model').find('.type-model-inner').scrollTop();
                },
                'touchmove':function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    var touch = e.touches[0];
                    var endY = touch.pageY;
                    var st = startY - endY +top;
                    $('#type-model').find('.type-model-inner').animate({scrollTop: st},0);
                },
                'touchend':function(event){
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }
    });
    $('#hide-cate').click(function(){
        $('#type-model').removeClass('open');
    });
})
/*
var cate = document.querySelector('#catelist').childNodes;
cate.onclick = function(event){
    alert(event.currentTarget.children.length);
}*/
