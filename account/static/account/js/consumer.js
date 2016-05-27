/**
 * Created by chulin on 16-5-26.
 */


$(function(){
    var id = $('#posterid').val();
    ///*
    $.ajax({
        type: 'GET',
        url: '/api/v1/poster/'+id+'/consumer/ans',
        success:function(data){
            var ans = data[0].ans;
            var h = '<ul>';
            for(var i=0;i<ans.length;i++){
                h+= '<li><span class="tips-name">'+ans[i]["question"]["short_text"]+'</span><span class="tips-cont">'+ans[i]["answer"]+'</span></li>';
            }
                h += '</ul>';
            $('#tips-info').append(h);
        },
        error: function(xhr, status, statusText){
            $('#tips-info').append('<span class="error-msg">服务超时</span>');
        }
    });
    //*/
    showLoading(false);

    /* favorite */
    $('#ctrl-favorite').on('click',function(){
        var status = $(this).attr('data-fav');
        if(status == 0){
            $(this).find('.fa').css('color','#feba01');
            $(this).attr('data-fav','1');
        }else{
            $(this).find('.fa').css('color','#808080');
            $(this).attr('data-fav','0');
        }
    });
    /* show share */
    $('#ctrl-share').on('click',function(){
        showShare(true);
    });
    /* close share */
    $('#body-share').on('click',function(){
        showShare(false);
    });
    /* view poster */
    $('#ctrl-view').on('click',function(){
        location.href = '/mobile/posters/12/';
    });
    /* statistics */
    $('#ctrl-statistics').on('click',function(){
        console.log('statistics:'+id);
    });


    /* bargained */
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

    /* my consult */
    $('#quote-consult').on('click',function(){
        $('#body-tips').fadeIn(200);

    });
    $('#close-tips').on('click',function(){
        $('#body-tips').fadeOut(200);
    });

    /* quote or price list */
    $('.main-menu-li').on('click',function(){
        $('.main-menu-li').removeClass('main-menu-act');
        $(this).addClass('main-menu-act');
        var item = $(this).attr('data-item');
        $('.mainli').hide();
        $('#main-'+item).show();
    });
    /* set message */
    $('#plyMess').on('click',function(){
        var cont = $('#mess').val();
            cont = cont.replace(/<\/?.+?>/g,"");
            cont = cont.replace(/&nbsp;/g,"");
        if(cont == ''){
            yyAlert('请填写您要告知给对方的信息!');
            return;
        }
        console.log('cont:'+cont);
    });

    /* back to usercenter */
    $('#page-close').on('click',function(){
        location.href='/mobile/account/profile.html';
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

    function showLoading(type){
        if(type){
            $('#body-loading').show();
        }else{
            $('#body-loading').hide();
        }
    }

});
