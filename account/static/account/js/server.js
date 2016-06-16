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
    showLoadTips($('#main-list'),'show');
    $.ajax({
        type: 'GET',
        url: '/api/v1/poster/'+id+'/consumer/answers',
        success:function(data){
            showLoadTips($('#main-list'),'success');
            if(!$.isEmptyObject(data)){
                var mli = '';
                for(var i=0;i<data.length;i++){
                    mli += getMainLiHtml(data[i]);
                }
                $('#main-list').append(mli);
            }else{
                $('#main-list').append('<span class="error-msg">当前没有任何信息</span>');
            }
        },
        error: function(xhr,status,statusText){
            showLoadTips($('#main-list'),'error');
        }
    });
    function getMainLiHtml(d){
        var headIcon = (d.subject.person)?d.subject.person.avatar:head_default;
        var ans = d.ans;
        var username = getUserName(d.subject);
        var h = '<div class="main-li" data-csid="'+d.subject.id+'">';
            h+= '   <div class="mli-header">';
            h+= '       <div class="mli-hd-right">'+ d.completed+'</div>';
            h+= '       <div class="mli-hd-left">';
            h+= '           <img src="'+headIcon+'" alt="img"><span>'+username+'</span>';
            h+= '       </div>';
            h+= '   </div>';
            h+= '   <div class="mli-cont survey-ans">';
            h+= '       <ul>';
        for(var i=0;i<ans.length;i++){
            h+= '           <li><span class="sans-name">'+ans[i]["question"]["short_text"]+'</span><span class="sans-cont">'+ans[i]["answer"]+'</span></li>';
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
                    $('#price-accept').find('.trade-price-mess').html('您接受对方的报价');
                    $('.trade-price-li').hide();
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
            $.ajax({
                type: 'PATCH',
                data:{accepted:false,refused:true},
                url: '/api/v1/poster/'+id+'/bargains/'+lastPrice['id'],
                success:function(){
                    //yyAlert('您的出价发送成功!');
                    $('#price-refuse').find('.bid-tips').html('您拒绝了对方的报价,请等待对方再次出价').next().hide();
                    $('.trade-price-li').hide();
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
        $('.trade-price-li').hide();
        $('#price-bid').show();
    });
    /* 服务提供者出价 */
    $('#set-price').on('click',function(){
        var price = $.trim($('#bPrice').val());
        if(!$.isNumeric(price) || price <= 0){
            yyAlert('请输入大于0的数字!');
        }else{
            $.ajax({
                type: 'POST',
                data:{"consumer_id":consumer_id,price:price,note:''},
                url: '/api/v1/poster/'+id+'/bargains',
                success:function(){
                    $('#price-quote').children('.trade-price-icon').children().html('你的报价');
                    $('#price-quote').find('.value-num').html(price);
                    $('.trade-price-li').hide();
                    $('#price-quote').show();
                    if($('#cancel-price').css('display')== 'none'){
                        $('#cancel-price').show().siblings('.trade-first-bid').remove();
                    }
                    modifyPlist(price);
                },
                error: function(xhr, status, statusText){
                    yyAlert('网络错误,请稍候再试!');
                }
            });
        }
    });
    function modifyPlist(price){
        var h= '<li class="plist-active">';
            h+= '<span class="plist-name">我的报价</span>';
            h+= '<span class="plist-value">'+price+'</span>';
            h+= '<span class="plist-time">'+nowTime()+'</span>';
            h+= '</li>';

        if($('#main-plist').children().length == 0){
            h = '<div class="trade-plist-ul"><ul>'+h+'</ul></div>';
            $('#main-plist').append(h);
        }else{
            $('#main-plist ul').append(h);
        }
    }
    function nowTime(){
        var d = new Date();
        var addZero = function(num){
            if(num<10){
                num = '0'+num;
            }
            return num;
        }
        var year = d.getFullYear();
        var month = addZero(d.getMonth()+1);
        var day = addZero(d.getDate());
        var hours = addZero(d.getHours());
        var minute = addZero(d.getMinutes());
        var seconds = addZero(d.getSeconds());
        return year+'-'+month+'-'+day+' '+hours+':'+minute+':'+seconds;
    }
    /* 取消出价 */
    $('#cancel-price').on('click',function(){
        $('#price-bid').hide();
        $('#price-quote').show();
    });
    /* 报价与记录信息页的切换 */
    $('.two-menu-li').on('click',function(){
        $('.two-menu-li').removeClass('two-menu-act');
        $(this).addClass('two-menu-act');
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

    /* 获取双发讨价还价的历史记录 */
    function getBargainsList(){
        showLoadTips($('#main-plist'),'show');
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/bargains?consumer_id='+consumer_id,
            success:function(data){
                showLoadTips($('#main-plist'),'success');
                if(!$.isEmptyObject(data)){
                    var h = '<div class="trade-plist-ul"><ul>';
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
                    showPriceli();
                    $('#main-plist').append('<span class="error-msg">当前没有任何报价信息</span>');
                }
            },
            error: function(xhr, status, statusText){
                showLoadTips($('#main-plist'),'error');
            }
        });
    }

    /* 展示当前讨价还价的状态 */
    function showPriceli(lastPriceData){
        $('.trade-price-li').hide();
        if(lastPriceData == undefined){
            $('#set-price').before('<span class="trade-first-bid">您还没有出价,请出价</span>');
            $('#cancel-price').hide();
            $('#price-bid').show();
            return;
        }

        $('#price-quote,#price-accept,#price-refuse').find('.value-num').html(lastPriceData['price']);
        if(lastPriceData['accepted']){
            if(lastPriceData['consumer']['id'] == lastPriceData['creator']['id']){
                $('#price-accept').find('.trade-price-mess').html('您已接受报价');
            }else{
                $('#price-accept').find('.trade-price-mess').html('对方已接受报价');
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
                $('#price-quote').children('.trade-price-icon').children().html('你的报价');
                $('#accept-price').hide();
                $('#refuse-price').hide();
            }
            $('#price-quote').show();
        }
    }

    /* 获取双方交流的信息列表 */
    function getChatsList(){
        showLoadTips($('#message-list'),'show');
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/chats?receiver_id='+consumer_id,
            success:function(data){
                showLoadTips($('#message-list'),'success');
                if(!$.isEmptyObject(data)){
                    var h = '<ul>';
                    for(var i=0;i<data.length;i++){
                        var img = (data[i]["sender"]["person"])?head_default:data[i]["sender"]["person"]["avatar"];
                        var username = getUserName(data[i]["sender"]);
                        h+= '<li class="mn-mess-li">';
                        h+= '   <div class="mn-mess-image"><img src="'+img+'" alt="headicon"></div>';
                        h+= '   <div class="mn-mess-info">';
                        h+= '       <div class="mess-info-title"><span class="info-title-name">'+username+'</span><span class="info-title-time">'+data[i]["created_at"]+'</span></div>';
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
                showLoadTips($('#message-list'),'error');
            }
        });
    }

    /* 获取服务需求方提交的服务调查问卷信息 */
    function getAnsList(){
        showLoadTips($('#tips-info'),'show');
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/consumer/ans',
            success:function(data){
                showLoadTips($('#tips-info'),'success');
                if(!$.isEmptyObject(data)){
                    var ans = data[0].ans;
                    var h = '<ul>';
                    for(var i=0;i<ans.length;i++){
                        h+= '<li><span class="sans-name">'+ans[i]['question']['short_text']+'</span><span class="sans-cont">'+ans[i]['answer']+'</span></li>';
                    }
                    h += '</ul>';
                    $('#tips-info').append(h);
                }else{
                    $('#tips-info').append('<span class="error-msg">当前没有任何信息</span>');
                }
            },
            error: function(xhr, status, statusText){
                showLoadTips($('#tips-info'),'error');
            }
        });
    }

    /* 获取用户评论信息 */
    function getCommentsList(){
        showLoadTips($('#body-comments'),'show');
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/servicecomments',
            success:function(data){
                showLoadTips($('#body-comments'),'success');
                if(!$.isEmptyObject(data)){
                    var h = '<ul>';
                    for(var i=0;i<data.length;i++){
                        var username = getUserName(data[i]['creator']);
                        var rating = 2*data[i]['rating'];
                        var hdicon = data[i]['creator']['person']['avatar'];
                        hdicon = (hdicon)?hdicon:head_default;
                        h+= '<li>';
                        h+= '   <div class="com-headicon"><img src="'+hdicon+'" alt="img"></div>';
                        h+= '   <div class="com-main">';
                        h+= '       <div class="com-main-top">';
                        h+= '           <span class="com-username">'+username+'</span>';
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
                showLoadTips($('#body-comments'),'error');
            }
        });
    }

    /* 加载动画的显示与隐藏 */
    function showLoadTips($obj,type){
        if(type == 'show'){
            $obj.append('<div class="data-loading"><i class="fa fa-spinner fa-pulse fa-5x"></i><br>数据加载中,请稍等...</div>');
        }
        if(type == 'success'){
            $obj.children('.data-loading').remove();
        }
        if(type == 'error'){
            $obj.children('.data-loading').remove();
            $obj.append('<span class="error-msg">网络错误,请稍候再试!</span>');
        }
    }

    function getUserName(d){
        return (d.person.phonenumber)?d.person.phonenumber:d.email;
    }
});
