/**
 * Created by chulin on 16-5-26.
 */


$(function(){
    var id = $('#posterid').val();
    var consumer_id= $('#consumerid').val();
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
    var lastPrice;
    getBargainsList();
    getChatsList();
    getAnsList();

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

    /* share-controller */
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
    ///*
    //接受服务提供者的报价
    $('#accept-price').on('click',function(){
        yyConfirm('温馨提示：一旦接受报价，您就不能再出价，您确定要接受当前的报价吗？',function(){
            $.ajax({
                type: 'PATCH',
                data:{accepted:true,refused:false},
                url: '/api/v1/poster/'+id+'/bargains/'+lastPrice['id'],
                success:function(){
                    //yyAlert('您的出价发送成功!');
                    $('#price-accept').find('.q-c-name').html('您接受对方的报价');
                    $('.price-li').hide();
                    $('#price-accept').show();
                },
                error: function(xhr, status, statusText){
                    yyAlert('网络错误,请稍候再试!');
                }
            });
        });
    });
    //*/
    ///*
    //拒绝服务提供者的报价
    $('#refuse-price').on('click',function(){
        yyConfirm('温馨提示：一旦拒绝对方报价，将只能等待对方再次报价，如果您不认可当前价格，可以直接出价。',function(){
            $.ajax({
                type: 'PATCH',
                data:{accepted:false,refused:true},
                url: '/api/v1/poster/'+id+'/bargains/'+lastPrice['id'],
                success:function(){
                    //yyAlert('您的出价发送成功!');
                    $('#price-refuse').find('.bid-tips').html('您拒绝了对方的报价,请等待对方再次出价').next().hide();
                    $('.price-li').hide();
                    $('#price-refuse').show();
                },
                error: function(xhr, status, statusText){
                    yyAlert('网络错误,请稍候再试!');
                }
            });
        });
    });
    //*/
    $('.bid-price').on('click',function(){
        $('#price-quote').hide();
        $('#price-bid').show();
    });
    /* bargained bid-price */
    //服务需求者出价
    $('#set-price').on('click',function(){
        var price = $.trim($('#bPrice').val());
        var reg = new RegExp("^[0-9]*$");
        if(!reg.test(price) || price == ''){
            yyAlert('请输入数字!');
        }else{
            console.log('bid-price:'+price);
            $.ajax({
                type: 'POST',
                data:{price:price,note:''},
                url: '/api/v1/poster/'+id+'/bargains',
                success:function(){
                    $('#price-quote').children('.price-icon').children().html('你的报价');
                    $('#price-quote').find('.value-num').html(price);
                    $('#accept-price').hide();
                    $('#refuse-price').hide();
                    $('.price-li').hide();
                    $('#price-quote').show();
                },
                error: function(xhr, status, statusText){
                    yyAlert('网络错误,请稍候再试!');
                }
            });
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

    //获取双发讨价还价的历史记录
    function getBargainsList(){
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/bargains?consumer_id='+consumer_id,
            success:function(data){
                if(!$.isEmptyObject(data)){
                    var num = data.length;
                    var h = '<div class="main-plist-ul"><ul>';
                    for(var i=0;i<num;i++){
                        if(data[i]["accepted"]){
                            h+= '<li class="plist-over">';
                        }else{
                            if(data[i]["consumer"]['id'] == data[i]["creator"]['id']){
                                h+= '<li class="plist-active">';
                            }else{
                                h+= '<li>';
                            }
                        }
                        if(data[i]["consumer"]['id'] != data[i]["creator"]['id']){
                            h+= '<span class="plist-name">对方报价</span>';
                        }else{
                            h+= '<span class="plist-name">我的报价</span>';
                        }
                        h+= '<span class="plist-value">'+data[i]["price"]+'</span>';
                        h+= '<span class="plist-time">'+data[i]["created_at"]+'</span>';
                        h+= '</li>';
                    }
                    h += '</ul></div>';
                    $('#main-plist').append(h);
                    //showPriceli(data[num-1]);
                    lastPrice=data[0];
                    showPriceli(lastPrice);

                }else{
                    $('#main-plist').append('<span class="error-msg">当前没有任何报价信息</span>');
                }
            },
            error: function(xhr, status, statusText){
                $('#main-plist').append('<span class="error-msg">服务超时</span>');
            }
        });
    }
    //展示当前讨价还价的状态
    function showPriceli(lastPriceData){
        $('#price-quote,#price-accept,#price-refuse').find('.value-num').html(lastPriceData["price"]);
        $('.price-li').hide();
        if(lastPriceData["accepted"]){
            if(lastPriceData["consumer"]['id'] != lastPriceData["creator"]['id']){
                $('#price-accept').find('.q-c-name').html('您接受对方的报价');
            }else{
                $('#price-accept').find('.q-c-name').html('对方接受您的报价');
            }
            $('#price-accept').show();
        }else if(lastPriceData["refused"]){
            if(lastPriceData["consumer"]['id'] == lastPriceData["creator"]['id']){
                $('#price-refuse').find('.bid-tips').html('您的报价被对方拒绝,请再次');
            }else{
                $('#price-refuse').find('.bid-tips').html('您拒绝了对方的报价,请等待对方再次出价').next().hide();
            }
            $('#price-refuse').show();
        }else{
            if(lastPriceData["consumer"]['id'] == lastPriceData["creator"]['id']){
                $('#price-quote').children('.price-icon').children().html('你的报价');
                $('#accept-price').hide();
                $('#refuse-price').hide();
            }
            $('#price-quote').show();
        }
    }
    //获取双方交流的信息列表
    function getChatsList(){
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/chats?receiver_id='+consumer_id,
            success:function(data){
                if(!$.isEmptyObject(data)){
                    var h = '<ul>';
                    for(var i=0;i<data.length;i++){
                        h+= '<li>';
                        h+= '   <div class="mess-checkbox"></div>';
                        h+= '   <div class="mess-info">';
                        h+= '       <div class="mess-info-title"><span>'+data[i]["username"]+'</span><span>'+data[i]["cteate_at"]+'</span></div>';
                        h+= '       <div class="mess-info-cont">'+data[i]["content"]+'</div>';
                        h+= '   </div>';
                        h+= '</li>';
                    }
                    h += '</ul>';
                    $('#message-list').append(h);
                }else{
                    $('#message-list').append('<span class="error-msg">当前没有任何信息</span>');
                }
            },
            error: function(xhr, status, statusText){
                $('#message-list').append('<span class="error-msg">服务超时</span>');
            }
        });
    }

    //获取服务需求方提交的服务调查问卷信息,即我的资讯信息
    function getAnsList(){
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
                    showLoading(false);
                }
            },
            error: function(xhr, status, statusText){
                $('#tips-info').append('<span class="error-msg">服务超时</span>');
            }
        });
    }


});
