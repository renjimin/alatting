/**
 * Created by chulin on 16-5-26.
 */

$(function(){
    var id = $('#postid').val();
    var ch =$(window).height()-$('.main-title').outerHeight();
    $('.main-user-ctrl').css('height',ch+'px');
    ///*
    $.ajax({
        type: 'GET',
        url: '/api/v1/poster/'+id+'/consumer/answers',
        success:function(data){
            for(var i=0;i<data.length;i++){
                var mli = getMainLiHtml(data[i]);
                $('#main-list').append(mli);
            }
            showLoading(false);
        },
        error: function(xhr,status,statusText){
            yyAlert("data error");
        }
    });
    //*/

    function getMainLiHtml(d){
        var headIcon = (d.subject.person)?d.subject.person.avatar:'/static/account/img/headicon-default.jpg';
        var ans = d.ans;
        var h = '<div class="main-li">';
            h+= '   <div class="mli-header">';
            h+= '       <div class="mli-hd-right">'+ d.completed+'</div>';
            h+= '       <div class="mli-hd-left">';
            h+= '           <img src="'+headIcon+'" alt="img"><span>'+ d.subject.username+'</span>';
            h+= '       </div>';
            h+= '   </div>';
            h+= '   <div class="mli-cont tips-info">';
            h+= '       <ul>';
        for(var i=0;i<ans.length;i++){
            h+= '           <li><span class="tips-name">'+ans[i]["question"]["short_text"]+'</span><span class="tips-cont">'+ans[i]["answer"]+'</span></li>';
        }
            h+= '       </ul>';
            h+= '   </div>';
            h+= '   <div class="mli-toggle" data-type="up"><i class="fa fa-angle-down"></i></div>';
            h+= '   <div class="mli-tips"></div>';
            h+= '</div>';
        return h;
    }

    $('.mlist').on('click','.mli-toggle',function(){
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

    $('#main-list').on('click','.mli-header',function(){
        var ths = $(this);
        var $mli = ths.parent().clone();
        $('.main-goback').after($mli);
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
