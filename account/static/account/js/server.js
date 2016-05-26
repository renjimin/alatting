/**
 * Created by chulin on 16-5-26.
 */

$(function(){
    var ch =$(window).height()-$('.main-title').outerHeight();
    $('.main-user-ctrl').css('height',ch+'px');


    showLoading(false);
    $('.mli-toggle').on('click',function(){
        var ths = $(this);
        var cont = ths.siblings('.mli-cont');
        var height = cont.children().outerHeight();
        var type = ths.attr('data-type');
        if(type == 'up'){
            cont.animate({height:height+'px'},200);
            ths.children().removeClass('fa-angle-down').addClass('fa-angle-up');
            ths.attr('data-type','down');
        }else{
            cont.animate({height:'100px'},200);
            ths.children().removeClass('fa-angle-up').addClass('fa-angle-down');
            ths.attr('data-type','up');
        }
    });

    $('.mli-header').on('click',function(){
        var ths = $(this);
        var id = ths.parent().attr('data-id');
        $('.main-user-ctrl').fadeIn(200);
    });
    $('#main-goback').on('click',function(){
        $('.main-user-ctrl').fadeOut(200);
    });
    $('#page-close').on('click',function(){
        location.href='/mobile/account/profile.html';
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
    $('.main-menu-li').on('click',function(){
        $('.main-menu-li').removeClass('main-menu-act');
        $(this).addClass('main-menu-act');
        var item = $(this).attr('data-item');
        $('.mainli').hide();
        $('#main-'+item).show();
    });


    function showLoading(type){
        if(type){
            $('#body-loading').show();
        }else{
            $('#body-loading').hide();
        }
    }


});
