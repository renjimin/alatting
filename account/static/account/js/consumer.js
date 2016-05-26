/**
 * Created by chulin on 16-5-26.
 */


$(function(){

    $('#ctrl-share').on('click',function(){
        showShare(true);
    });
    $('#body-share').on('click',function(){
        showShare(false);
    });
    $('#accept-price').on('click',function(){
        $('#price-quote').hide();
        $('#price-accept').show();
    });
    $('#bid-price').on('click',function(){
        $('#price-quote').hide();
        $('#price-bid').show();
    });
    $('#cancel-price').on('click',function(){
        $('#price-bid').hide();
        $('#price-quote').show();
    });
    $('#quote-consult').on('click',function(){
        $('#body-tips').fadeIn(200);
    });
    $('#close-tips').on('click',function(){
        $('#body-tips').fadeOut(200);
    });
    $('.main-menu-li').on('click',function(){
        $('.main-menu-li').removeClass('main-menu-act');
        $(this).addClass('main-menu-act');
        var item = $(this).attr('data-item');
        $('.mainli').hide();
        $('#main-'+item).show();
    });

    function showShare(type){
        var chd = $('#body-share').children();
        var num = chd.length-2;
        var top = 80;
        if(type){
            $('#body-share').fadeIn(200);
            for(var i=0;i<num;i++){
                var tops  = top+80*(i+1);
                var index = i+2;
                chd.eq(index).animate({top:tops+'px'},400);
            }
        }else{
            $('#body-share').fadeOut(200);
            for(var i=0;i<num;i++){
                var index= i+2;
                chd.eq(index).animate({top:top+'px'},400);
            }
        }
    }

});
