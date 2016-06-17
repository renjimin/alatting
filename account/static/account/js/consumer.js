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
    var lastPrice,head_default='/static/account/img/headicon-default.jpg';

    /* 获取海报详情信息 */
    $.ajax({
        type: 'GET',
        url: '/api/v1/poster/posters/'+id,
        success:function(data){
            $('#body-main-title').children('.title-name').html(data['unique_name']);
        },
        error: function(xhr, status,statusText){
            $('#body-main-title').children('.title-name').html('获取数据错误');
        }
    });
    getBargainsList($('#main-plist'),id,consumer_id);
    getChatsList($('#message-list'),id,consumer_id);
    getAnsList();

    /* 收藏当前海报 */
    $('#ctrl-favorite').on('click',function(){
        var ths = $(this);
        var status = ths.attr('data-fav');
        if(status == 0){
            $.ajax({
                type: 'POST',
                url: '/api/v1/posters/'+id+'/favorites/bookmark/',
                success:function(){
                    ths.find('.fa').css('color','#feba01');
                    ths.attr('data-fav','1');
                },
                error: function(xhr, status, statusText){
                    yyAlert('网络错误,请稍候再试!');
                }
            });
        }else{
            $.ajax({
                type: 'DELETE',
                url: '/api/v1/posters/'+id+'/favorites/bookmark/',
                success:function(){
                    ths.find('.fa').css('color','#808080');
                    ths.attr('data-fav','0');
                },
                error: function(xhr, status, statusText){
                    yyAlert('网络错误,请稍候再试!');
                }
            });

        }
    });

    /* ----分享功能模块---- */
    /* 显示分享菜单 */
    $('#ctrl-share').on('click',function(){
        showShare(true);
    });
    /* 关闭分享菜单 */
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

    /* 浏览海报信息 */
    $('#ctrl-view').on('click',function(){
        location.href = '/mobile/posters/'+id+'/';
    });
    /* 显示海报统计信息 */
    $('#ctrl-statistics').on('click',function(){
        location.href = '/mobile/account/posters/'+id+'/statistics.html';
    });


    /*-------- 讨价还价功能模块 ---------*/
    /* 接受服务提供者的报价 */
    $('#accept-price').on('click',function(){
        yyConfirm('温馨提示：一旦接受报价，您就不能再出价，您确定要接受当前的报价吗？',function(){
            $.ajax({
                type: 'PATCH',
                data:{accepted:true,refused:false},
                url: '/api/v1/poster/'+id+'/bargains/'+lastPrice['id'],
                success:function(){
                    //yyAlert('您的出价发送成功!');
                    $('#price-accept').find('.trade-price-mess').html('您接受对方的报价');
                    $('.trade-price-li').hide();
                    $('#price-accept').show();
                    $('#main-plist').find('li').last().addClass('plist-over');
                },
                error: function(xhr, status, statusText){
                    yyAlert('网络错误,请稍候再试!');
                }
            });
        });
    });
    $('#trade-make-comt').on('click',function(){
        $('.body-li').hide();
        $('#body-makecomt').show();
    });
    /* 拒绝服务提供者的报价 */
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
    /* 服务需求者出价 */
    $('#set-price').on('click',function(){
        var ths = $(this);
        ths.prop('disabled','disabled');
        var price = $.trim($('#bPrice').val());
        if(!$.isNumeric(price) || price <= 0){
            yyAlert('请输入大于0的数字!');
        }else{
            console.log('bid-price:'+price);
            $.ajax({
                type: 'POST',
                data:{price:price,note:''},
                url: '/api/v1/poster/'+id+'/bargains',
                success:function(){
                    $('#price-quote').children('.trade-price-icon').children().html('你的报价');
                    $('#accept-price').hide();
                    $('#refuse-price').hide();
                    $('#price-quote').find('.value-num').html(price);
                    $('.trade-price-li').hide();
                    $('#price-quote').show();

                    if($('#cancel-price').css('display')== 'none'){
                        $('#cancel-price').show().siblings('.trade-first-bid').remove();
                    }
                    modifyPlist(price);
                    ths.removeProp('disabled');
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

    /* 取消出价，回到报价面板 */
    $('#cancel-price').on('click',function(){
        $('#price-bid').hide();
        $('#price-quote').show();
    });

    /* 打开我的资讯信息层 */
    $('#quote-consult').on('click',function(){
        $('#body-tips').fadeIn(200);
    });
    /* 关闭我的资讯信息层 */
    $('#close-tips').on('click',function(){
        $('#body-tips').fadeOut(200);
    });

    /* 报价与记录信息页的切换 */
    $('.two-menu-li').on('click',function(){
        $('.two-menu-li').removeClass('two-menu-act');
        $(this).addClass('two-menu-act');
        var item = $(this).attr('data-item');
        $('.mainli').hide();
        $('#main-'+item).show();
    });
    /* 发送消息 */
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
        $.ajax({
            type: 'POST',
            data:{content:cont},
            url: '/api/v1/poster/'+id+'/chats',
            success:function(){
                yyAlert('消息发送成功!',function(){
                    $('#mess').val('');
                    ths.removeProp('disabled');
                });
                var h= '<li class="mn-mess-li">';
                    h+= '   <div class="mn-mess-image"><img src="'+userInfo.hdicon+'" alt="headicon"></div>';
                    h+= '   <div class="mn-mess-info">';
                    h+= '       <div class="mess-info-title"><span class="info-title-name">'+userInfo.name+'</span><span class="info-title-time">'+nowTime()+'</span></div>';
                    h+= '       <div class="mess-info-cont">'+cont+'</div>';
                    h+= '   </div>';
                    h+= '</li>';
                if($('#message-list').children().length==0){
                    h = '<ul>'+h+'</ul>';
                    $('#message-list').append(h);
                }else{
                    $('#message-list ul').append(h);
                }
            },
            error: function(xhr, status, statusText){
                yyAlert('网络错误,请稍候再试!');
            }
        });
    });

    /* 服务需求者给服务提供者评价 */
    /* 评分 */
    $('#body-makecomt li').on('click',function(){
        var num = $(this).attr('data-item');
        $('#star-comt').val(num);
        $('#body-makecomt li').css('color','#d3d3d3');
        $(this).css('color','#feba01');
        $(this).prevAll().css('color','#feba01');
    });
    /* 发送评论 */
    $('#submit-comt').on('click',function(){
        var ths = $(this);
        var star = $('#star-comt').val();
        if(star == ''){
            yyAlert('请您给本次服务评分!');
            return;
        }
        var cont = $('#serve-comt').val();
            cont = cont.replace(/<\/?.+?>/g,"");
            cont = cont.replace(/&nbsp;/g,"");
        if(cont == ''){
            yyAlert('请填写您的评价内容!');
            return;
        }
        ths.hide();
        $.ajax({
            type: 'POST',
            data:{content:cont,rating:star},
            url: '/api/v1/poster/'+id+'/servicecomments',
            success:function(){
                yyAlert('感谢您的评价，欢迎再次预约服务!',function(){
                    ths.show();
                    $('#star-comt').val('');
                    $('#serve-comt').val('');
                    $('#body-makecomt li').css('color','#d3d3d3');
                    $('#body-comments').empty();
                    $('#body-main-title').trigger('click');
                });
            },
            error: function(xhr, status, statusText){
                yyAlert('网络错误,请稍候再试!');
            }
        });
    });
    /* 取消评论 */
    $('#cancel-comt').on('click',function(){
        $('.body-li').hide();
        $('#body-main').show();
    });
    /* 再次预约 */
    $('#mcom-order').on('click',function(){
        //location.href='';
        console.log('order again');
    });

    /* 点击头部海报名称显示当前海报的所有用户评价信息 */
    $('#body-main-title').on('click',function(){
        var $bdcomt = $('#body-comments');
        if($bdcomt.css('display') == 'none'){
            $('.body-li').hide();
            $bdcomt.show();
            if($bdcomt.children().length == 0){
                getCommentsList($bdcomt,id);
            }
        }else{
            $('.body-li').hide();
            $('#body-main').show();
        }
    });

    /* 回到个人中心主页面 */
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

    /* 获取双发讨价还价的历史记录 */
    function getBargainsList($obj,id,consumerid){
        showLoadTips($obj,'show');
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/bargains?consumer_id='+consumerid,
            success:function(data){
                showLoadTips($obj,'success');
                if(!$.isEmptyObject(data)){
                    var num = data.length;
                    var h = '<div class="trade-plist-ul"><ul>';
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
                    $obj.append(h);

                    lastPrice=data[num-1];
                    showPriceli(lastPrice);
                }else{
                    showPriceli();
                    $obj.append('<span class="error-msg">当前没有任何报价信息</span>');
                }
            },
            error: function(xhr, status, statusText){
                showLoadTips($obj,'error');
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

        $('#price-quote,#price-accept,#price-refuse').find('.value-num').html(lastPriceData["price"]);
        if(lastPriceData["accepted"]){
            if(lastPriceData["consumer"]['id'] != lastPriceData["creator"]['id']){
                $('#price-accept').find('.trade-price-mess').html('您接受对方的报价');
            }else{
                $('#price-accept').find('.trade-price-mess').html('对方接受您的报价');
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
                $('#price-quote').children('.trade-price-icon').children().html('你的报价');
                $('#accept-price').hide();
                $('#refuse-price').hide();
            }
            $('#price-quote').show();
        }
    }
    /* 获取双方交流的信息列表 */
    function getChatsList($obj,id,consumerid){
        showLoadTips($obj,'show');
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/chats?receiver_id='+consumerid,
            success:function(data){
                showLoadTips($obj,'success');
                if(!$.isEmptyObject(data)){
                    var h = '<ul>';
                    for(var i=0;i<data.length;i++){
                        var img = (data[i]["sender"]["person"])?data[i]["sender"]["person"]["avatar"]:userInfo.defHdIcon;
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
                    $obj.append(h);
                }else{
                    $obj.append('<span class="error-msg">当前没有任何信息</span>');
                }
            },
            error: function(xhr, status, statusText){
                showLoadTips($obj,'error');
            }
        });
    }

    /* 获取服务需求方提交的服务调查问卷信息,即我的资讯信息 */
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
                        h+= '<li><span class="sans-name">'+ans[i]["question"]["short_text"]+'</span><span class="sans-cont">'+ans[i]["answer"]+'</span></li>';
                    }
                    h += '</ul>';
                    $('#tips-info').append(h);
                }else{
                    $('#tips-info').append('<span class="error-msg">当前没有任何信息</span>');
                }
            },
            error:function(xhr, status, statusText){
                showLoadTips($('#tips-info'),'error');
            }
        });
    }

    /* 获取用户评论信息 */
    function getCommentsList($obj,id){
        showLoadTips($obj,'show');
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/'+id+'/servicecomments',
            success:function(data){
                showLoadTips($obj,'success');
                if(!$.isEmptyObject(data)){
                    var h = '<ul>';
                    for(var i=0;i<data.length;i++){
                        var hdicon = data[i]['creator']['person']['avatar'];
                        hdicon = (hdicon)?hdicon:head_default;
                        var rating = 2*data[i]['rating'];
                        var username = getUserName(data[i]['creator']);
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
                    $obj.append(h);
                }else{
                    $obj.append('<span class="error-msg">当前没有任何信息</span>');
                }
            },
            error: function(xhr, status, statusText){
                showLoadTips($obj,'error');
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
