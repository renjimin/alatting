/**
 * Created by chulin on 16-5-26.
 */


$(function(){
    var id = $('#posterid').val();
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);
    var pageInfo={
        id:id,
        sCont:'yunye',
        sDesc:'',
        sUrl:localhostPaht+'/mobile/poster/'+id+'/'
    };
    ///*
    $.ajax({
        type: 'GET',
        url: '/api/v1/poster/'+id+'/consumer/ans',
        success:function(data){
            if(!$.isEmptyObject(data)){
                var ans = data[0].ans;
                var h = '<ul>';
                for(var i=0;i<ans.length;i++){
                    h+= '<li><span class="tips-name">'+ans[i]["question"]["short_text"]+'</span><span class="tips-cont">'+ans[i]["answer"]+'</span></li>';
                }
                h += '</ul>';
                $('#tips-info').append(h);
            }
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
    $('#share-weibo').on('click',function(e){
        e.stopPropagation();
        var surl  = encodeURIComponent(pageInfo.sUrl);
        var url = 'http://service.weibo.com/share/share.php?url='+surl+'%230-tsina-1-81561-397232819ff9a47a7b7e80a40613cfe1&title='+pageInfo.sCont+'&appkey=1343713053&searchPic=true#_loginLayer_1465027314257';
        window.open(url);
    });
    $('#share-qq').on('click',function(e){
        e.stopPropagation();
        var surl  = encodeURIComponent(pageInfo.sUrl);
        var url = 'http://connect.qq.com/widget/shareqq/index.html?url='+surl+'%230-sqq-1-12603-9737f6f9e09dfaf5d3fd14d775bfee85&title='+pageInfo.sCont+'&desc='+pageInfo.sDesc+'&summary=';
        window.open(url);
    });
    $('#share-comment').on('click',function(e){
        e.stopPropagation();
        var surl  = encodeURIComponent(pageInfo.sUrl);
        var smsCont = '我在云页上找到一个不错的海报,推荐给你看看'+surl;
        var url = 'mailto:?body='+smsCont;
        location.href=url;
    });
    $('#share-envelope').on('click',function(e){
        e.stopPropagation();
        var surl  = encodeURIComponent(pageInfo.sUrl);
        var subject = '推荐一个不错的海报给你看看';
        var body = '我在云页上找到一个不错的海报,推荐给你看看'+surl;
        var url = 'mailto:?subject='+subject+'&body='+body;
        location.href=url;
    });
    $('#share-weixin').on('click',function(e){
        e.stopPropagation();
        console.log('weixin:none');
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
        yyConfirm('温馨提示：一旦接受报价，您就不能再出价，您确定要接受当前的报价吗？',function(){
            $('#price-quote').hide();
            $('#price-accept').show();
        });
    });
    $('#refuse-price').on('click',function(){
        yyConfirm('温馨提示：一旦拒绝对方报价，将只能等待对方再次报价，如果您不认可当前价格，可以直接出价。',function(){
            console.log('refuse-price');
        });
    });
    $('#bid-price').on('click',function(){
        $('#price-quote').hide();
        $('#price-bid').show();
    });
    /* bargained bid-price */
    $('#set-price').on('click',function(){
        var price = $.trim($('#bPrice').val());
        var reg = new RegExp("^[0-9]*$");
        if(!reg.test(price) || price == ''){
            yyAlert('请输入数字!');
        }else{
            console.log('bid-price:'+price);
        }
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
