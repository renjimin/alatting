/**
 * Created by chulin on 16-5-26.
 */

$(function(){
    var id = $('#posterid').val();
    var ch =$(window).height()-$('.main-title').outerHeight();
    $('#main-user-ctrl,#body-comments').css('height',ch+'px');
    var lastPrice,consumer_id,head_default='/static/account/img/headicon-default.jpg';

    /* 获取海报详情信息 */
    $.ajax({
        type: 'GET',
        url: '/api/v1/poster/posters/'+id,
        success:function(data){
            $('#title-name').html(data['unique_name']);
        },
        error: function(xhr, status,statusText){
            $('#title-name').html('获取数据错误');
        }
    });

    /* 获取当前海报所有预约用户填写的调查问卷 */
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
    function getMainLiHtml(d){
        var headIcon = (d.subject.person)?d.subject.person.avatar:head_default;
        var ans = d.ans;
        var h = '<div class="main-li" data-csid="'+d.subject.id+'">';
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
    /* 展示所用用户对海报的评价 */
    $('#title-name').on('click',function(){
        if($('#body-comments').css('display') == 'none'){
            $('#main-list').css({height:ch+'px','min-height':'0px','overflow':'hidden'});
            $('#body-comments').show();
            if($('#body-comments').children().length == 0){
                getCommentsList();
            }
        }else{
            if($('#main-user-ctrl').css('display') == 'none'){
                $('#main-list').attr('style','');
            }
            $('#body-comments').hide();
        }
    });

    /* 展示或隐藏更多的调查问卷信息 */
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

    /* 进入当前用户的预约详情页面 */
    $('#main-list').on('click','.mli-header',function(){
        var ths = $(this);
        $('#main-list').css({height:ch+'px','min-height':'0px','overflow':'hidden'});
        var $mli = ths.parent().clone();
        $('.main-goback').after($mli);
        consumer_id = ths.parent().attr('data-csid');
        $('#main-user-ctrl').fadeIn(200);
        getBargainsList();
        getChatsList();
    });
    /* 返回所有用户预约信息页面 */
    $('#main-goback').on('click',function(){
        $('#main-list').attr('style','');
        $('#main-user-ctrl').fadeOut(200).children('.main-li').remove();
        $('#main-plist').empty();
        $('#message-list').empty();
    });
    /* 回到个人中心主页面 */
    $('#page-close').on('click',function(){
        location.href='/mobile/account/profile.html';
    });

    /* ----讨价还价功能模块---- */
    /* 接受服务需求者的报价 */
    $('#accept-price').on('click',function(){
        yyConfirm('温馨提示：一旦接受报价，您就不能再出价，您确定要接受当前的报价吗？',function(){
            $.ajax({
                type: 'PATCH',
                data:{"accepted":true,"refused":false},
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
    /* 拒绝服务需求者的报价 */
    $('#refuse-price').on('click',function(){
        yyConfirm('温馨提示：一旦拒绝对方报价，将只能等待对方再次报价，如果您不认可当前价格，可以直接出价。',function(){
            console.log('refuse-price');
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
    /* 打开出价面板 */
    $('.bid-price').on('click',function(){
        $('#price-quote').hide();
        $('#price-bid').show();
    });
    /* 服务提供者出价 */
    $('#set-price').on('click',function(){
        var price = $.trim($('#bPrice').val());
        if(!$.isNumeric(price) || price <= 0){
            yyAlert('请输入大于0的数字!');
        }else{
            console.log('bid-price:'+price);
            $.ajax({
                type: 'POST',
                data:{"consumer_id":consumer_id,price:price,note:''},
                url: '/api/v1/poster/'+id+'/bargains',
                success:function(){
                    //yyAlert('您的出价发送成功!');
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
    /* 取消出价 */
    $('#cancel-price').on('click',function(){
        $('#price-bid').hide();
        $('#price-quote').show();
    });
    /* 报价与记录的切换 */
    $('.main-menu-li').on('click',function(){
        $('.main-menu-li').removeClass('main-menu-act');
        $(this).addClass('main-menu-act');
        var item = $(this).attr('data-item');
        $('.mainli').hide();
        $('#main-'+item).show();
    });

    /* 服务提供者发送消息 */
    $('#plyMess').on('click',function(){
        var ths = $(this);
        ths.prop('disabled','disabled');
        var cont = $('#mess').val();
            cont = cont.replace(/<\/?.+?>/g,"");
            cont = cont.replace(/&nbsp;/g,"");
        if(cont == ''){
            yyAlert('请填写您要告知给对方的信息!');
            return;
        }
        console.log('cont:'+cont);
        $.ajax({
            type: 'POST',
            data:{content:cont,"receiver_id":consumer_id,},
            url: '/api/v1/poster/'+id+'/chats',
            success:function(){
                ths.removeProp('disabled');
            },
            error: function(xhr, status, statusText){
                yyAlert('网络错误,请稍候再试!');
            }
        });
    });

    function showLoading(type){
        if(type){
            $('#body-loading').show();
        }else{
            $('#body-loading').hide();
        }
    }

    /* 获取双发讨价还价的历史记录 */
    function getBargainsList(){
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/bargains?consumer_id='+consumer_id,
            success:function(data){
                if(!$.isEmptyObject(data)){
                    var h = '<div class="main-plist-ul"><ul>';
                    var num = data.length;
                    for(var i=0;i<num;i++){
                        if(data[i]["accepted"]){
                            h+= '<li class="plist-over">';
                        }else{
                            if(data[i]["consumer"]['id'] != data[i]["creator"]['id']){
                                h+= '<li class="plist-active">';
                            }else{
                                h+= '<li>';
                            }
                        }
                        if(data[i]["consumer"]['id'] == data[i]["creator"]['id']){
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

                    lastPrice=data[num-1];
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

    /* 展示当前讨价还价的状态 */
    function showPriceli(lastPriceData){
        $('#price-quote,#price-accept,#price-refuse').find('.value-num').html(lastPriceData['price']);
        $('.price-li').hide();
        if(lastPriceData['accepted']){
            if(lastPriceData['consumer']['id'] == lastPriceData['creator']['id']){
                $('#price-accept').find('.q-c-name').html('您已接受报价');
            }else{
                $('#price-accept').find('.q-c-name').html('对方已接受报价');
            }
            $('#price-accept').show();
        }else if(lastPriceData['refused']){
            if(lastPriceData['consumer']['id'] != lastPriceData['creator']['id']){
                $('#price-refuse').find('.bid-tips').html('您的报价被对方拒绝,请再次');
            }else{
                $('#price-refuse').find('.bid-tips').html('您拒绝了对方的报价,请等待对方再次出价').next().hide();
            }
            $('#price-refuse').show();
        }else{
            if(lastPriceData['consumer']['id'] != lastPriceData['creator']['id']){
                $('#price-quote').children('.price-icon').children().html('你的报价');
                $('#accept-price').hide();
                $('#refuse-price').hide();
            }
            $('#price-quote').show();
        }
    }

    /* 获取双方交流的信息列表 */
    function getChatsList(){
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/chats?receiver_id='+consumer_id,
            success:function(data){
                if(!$.isEmptyObject(data)){
                    var h = '<ul>';
                    for(var i=0;i<data.length;i++){
                        var img = (data[i]["sender"]["person"])?head_default:data[i]["sender"]["person"]["avatar"];
                        h+= '<li class="mess-li">';
                        h+= '   <div class="mess-image"><img src="'+img+'" alt="headicon"></div>';
                        h+= '   <div class="mess-info">';
                        h+= '       <div class="mess-info-title"><span class="info-title-name">'+data[i]["sender"]["username"]+'</span><span class="info-title-time">'+data[i]["created_at"]+'</span></div>';
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

    /* 获取服务需求方提交的服务调查问卷信息 */
    function getAnsList(){
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/consumer/ans',
            success:function(data){
                if(!$.isEmptyObject(data)){
                    var ans = data[0].ans;
                    var h = '<ul>';
                    for(var i=0;i<ans.length;i++){
                        h+= '<li><span class="tips-name">'+ans[i]['question']['short_text']+'</span><span class="tips-cont">'+ans[i]['answer']+'</span></li>';
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

    /* 获取用户评论信息 */
    function getCommentsList(){
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/servicecomments',
            success:function(data){
                if(!$.isEmptyObject(data)){
                    var h = '<ul>';
                    for(var i=0;i<data.length;i++){
                        var rating = 2*data[i]['rating'];
                        var hdicon = data[i]['creator']['person']['avatar'];
                        hdicon = (hdicon)?hdicon:head_default;
                        h+= '<li>';
                        h+= '   <div class="com-headicon"><img src="'+hdicon+'" alt="img"></div>';
                        h+= '   <div class="com-main">';
                        h+= '       <div class="com-main-top">';
                        h+= '           <span class="com-username">username</span>';
                        h+= '           <span class="com-pstar p-star p-star-'+rating+'"></span>';
                        h+= '       </div>';
                        h+= '       <div class="com-main-cont">'+data[i]['content']+'</div>';
                        h+= '       <div class="com-main-bot"><span class="com-time">'+data[i]['created_at']+'</span></div>';
                        h+= '   </div>';
                        h+= '</li>';
                    }
                    h += '</ul>';
                    $('#body-comments').append(h);
                }else{
                    $('#body-comments').append('<span class="error-msg">当前没有任何信息</span>');
                }
            },
            error: function(xhr, status, statusText){
                $('#body-comments').append('<span class="error-msg">服务超时</span>');
            }
        });
    }
});
