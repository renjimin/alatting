/**
 * Created by zhangjie on 2016/5/30.
 */
$(function(){

    var wh = $(window).height();
    var bh = $('.body-header').height();
    $('#body-vip').css({'height':(wh-bh)+'px','top':bh+'px'});

    var serverProvideTmpl = $('#serverProvideTmpl').html();
    $.template('serverProvideTmpl',serverProvideTmpl);
    var serverNeedTmpl = $('#serverNeedTmpl').html();
    $.template('serverNeedTmpl',serverNeedTmpl);
    var defImg = '/static/account/img/hb001.png';
    var userinfo;

    /* 头部两类海报列表切换 */
    $('.head-bot-li').on('click',function(){
        var ths =$(this);
        var item = ths.attr('data-item');
        $('#pageType').val(item);
        $('.head-bot-li').removeClass('head-bot-act');
        ths.addClass('head-bot-act');
        $('.main-list').hide();
        $('#main-'+item).show();
    });
    /* 根据当前链接激活相应的海报列表 */
    var lurl= location.search;
    var pos = lurl.indexOf('=');
    var type = lurl.substring(pos+1, lurl.length);
    if(type == 'server'){
        $('.head-provide').trigger('click');
    }else if(type == 'consumer'){
        $('.head-need').trigger('click');
    }else{}

    /* 获取个人信息 */
    $.ajax({
        type: 'GET',
        url: '/api/v1/account/profile',
        success:function(data){
            if(data.person){
                $('#uIcon').children('img').attr('src',data.person.avatar);
            }
            $('#uName').html(data.username);
            $('#userid').val(data.id);
            userinfo = data;
        },
        error: function(xhr,status,statusText){
            yyAlert("服务超时,请稍候再试!");
        }
    });

    /* 获取当前用户提供的所有海报列表 */
    $.ajax({
        type: 'GET',
        url: '/api/v1/account/posters/server',
        success:function(data){
            for(var i=0;i<data.length;i++){
                var pd = {
                    posterid:data[i].id,
                    snapshot:(data[i].snapshot)?data[i].snapshot:defImg,
                    postername:data[i]['unique_name'],
                    mobileEditUrl:data[i]["mobile_edit_url"]
                };
                $.tmpl('serverProvideTmpl',pd).appendTo('#main-provide');
            }
            showLoading(false);
        },
        error: function(xhr, status, statusText){
            showLoading(false);
            $('#main-provide').append('<span class="error-msg">网络错误,请稍候再试!</span>');
        }
    });

    /* 获取当前用户所有预约的海报列表 */
    $.ajax({
        type: 'GET',
        url: '/api/v1/account/posters/consumer',
        success:function(data){
            for(var i=0;i<data.length;i++){
                var pd = {
                    posterid:data[i].id,
                    creatorid:data[i].creator,
                    snapshot:(data[i].snapshot)?data[i].snapshot:defImg,
                    postername:data[i]['unique_name']
                };
                $.tmpl('serverNeedTmpl',pd).appendTo('#main-need');
            }
        },
        error: function(xhr, status, statusText){
            $('#main-need').append('<span class="error-msg">网络错误,请稍候再试!</span>');
        }
    });

    /* 退出暂时放在个人设置那里 */
    $('#user-setting').on('click',function(){
        yyConfirm("您确定要退出吗?",function(){
            location.href='/mobile/account/logout';
        });
    });

    /* 菜单栏的固定置顶 */
    $(document).scroll(function(){
        var h = $('.body-header').outerHeight();
        var sh = $('body').scrollTop();
        if(sh>h){
            $('#main-head').css('position','fixed');
            $('#ctrl-add').css({'position':'fixed','top':'50px'});
        }else{
            $('#main-head').css('position','absolute');
            $('#ctrl-add').css({'position':'absolute','top':'10px'});
        }
    });
    /* 创建新的海报 */
    $('#ctrl-add').on('click',function(){
        location.href='/?main_category_id=1';
    });
    /* 显示用户的会员等级 */
    $('.user-level').on('click',function(event){
        event.stopPropagation();
        var tur = $('#body-vip');
        var view = tur.css('display');
        if(view == 'block'){
            $('.body-container').attr('style','');
            tur.css('display','none');
        }else{
            $('.body-container').css({'overflow':'hidden','height':wh+'px'});
            tur.css('display','block');
            //var rate = Math.floor(100*userinfo.score/userinfo.levelScore);
            var rate = Math.floor(100*6128/10000);
            showProcess(rate);
        }
    });

    /* 显示当前海报的操作控件 */
    $('.body-main').on('click','.p-cont',function(event){
        event.stopPropagation();
        var ths = $(this);
        var obj = ths.next();
        var mli = ths.parent().parent();
        if(!mli.hasClass('main-li-act')){
            var actmli = $('.main-li').filter('.main-li-act');
            if(actmli.length != 0){
                var actObj = actmli.eq(0).children().children('.p-ctrl');
                moveCtrl(actObj,false);
            }
            $('.main-li').removeClass('main-li-act');
            mli.addClass('main-li-act');
            moveCtrl(obj,true);
        }
    });
    /* 隐藏当前海报的操作控件 */
    $('.body-main').on('click','.p-ctrl',function(){
        $(this).parent().parent().removeClass('main-li-act');
        moveCtrl($(this),false);
    });
    /* 查看当前海报的信息 */
    $('.body-main').on('click','.ctrl-view',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        var pageType= $('#pageType').val();
        if(pageType == 'provide'){
            //console.log('view:provide:'+id);
            location.href = '/mobile/account/posters/'+id+'/server.html';
        }else{
            location.href = '/mobile/account/posters/'+id+'/consumer.html?consumerid='+$('#userid').val();
        }
    });
    /* 收藏当前海报 */
    $('.body-main').on('click','.ctrl-favorite',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        console.log('favorite:'+id);
        var status = $(this).attr('data-fav');
        if(status == 0){
            $(this).find('.fa').css('color','#feba01');
            $(this).attr('data-fav','1');
        }else{
            $(this).find('.fa').css('color','#808080');
            $(this).attr('data-fav','0');
        }
    });
    /* 查看海报的统计信息 */
    $('.body-main').on('click','.ctrl-statistics',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        console.log('statistics:'+id);

    });
    /* 分享当前海报 */
    $('.body-main').on('click','.ctrl-share',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        $('#shareId').val(id);
        $('.main-li').removeClass('main-li-act');
        moveCtrl($(this).parent(),false);
        moveShareBtn(true);
        console.log('share:'+id);
    });
    /* 进入海报编辑 */
    $('.body-main').on('click','.ctrl-edit',function(event){
        event.stopPropagation();
        var url = $(this).attr('data-url');
        if(url){
            location.href = url;
        }
        console.log('edit:none');
    });
    /* 删除海报 */
    $('.body-main').on('click','.ctrl-delete',function(event){
        event.stopPropagation();
        var mli = $(this).parent();
        var id= mli.attr('data-id');
        yyConfirm('此操作将删除海报关联的所有信息、统计数据等.无法恢复!确定要退出吗？',function(){
            $.ajax({
                type: 'DELETE',
                url: '/api/v1/poster/posters/'+id,
                success:function(){
                    yyAlert("删除成功!");
                    mli.parent().parent().remove();
                },
                error: function(){
                    yyAlert("服务超时,请稍候再试!");
                }
            });
        });
        console.log('delete:'+id);
    });
    /* 退出分享 */
    $('#body-share').on('click',function(){
        moveShareBtn(false);
    });

	/* 海报分享菜单的显示与隐藏 */
    function moveCtrl(obj,type){
        if(type){
            obj.fadeIn(200);
            obj.children().animate({top:'50%',left:'50%'},300);
        }else{
            obj.fadeOut(200);
            obj.children('.ctrl-lefttop').animate({top:'0',left:'0'},300);
            obj.children('.ctrl-righttop').animate({top:'0',left:'100%'},300);
            obj.children('.ctrl-leftbot').animate({top:'100%',left:'0'},300);
            obj.children('.ctrl-rightbot').animate({top:'100%',left:'100%'},300);
        }
    }
	/* 海报分享菜单的动画 */
    function moveShareBtn(type){
        var ths = $('#body-share');
        var chl = ths.children();
        var num = chl.length-1;
        if(type){
            var pos = getSixPos();
            ths.fadeIn(200);
            for(var i=0;i<num;i++){
                var index = i+1;
                chl.eq(index).animate({marginLeft:pos[i].left+'px',marginTop:pos[i].top+'px'},400);
            }
        }else{
            ths.fadeOut(200);
            chl.animate({marginLeft:'-35px',marginTop:'-35px'},400);
        }
    }
    function getSixPos(){
        var pos = [],left,top,r=35,leng=90;
        /*top*/
        left = -r;
        top = -(leng+r);
        pos.push({left:left,top:top});
        /*top-right*/
        left = leng*Math.pow(3,0.5)/2-r;
        top = -leng/2-r;
        pos.push({left:left,top:top});
        /*bot-right*/
        top = leng/2-r;
        pos.push({left:left,top:top});
        /*bot-left*/
        left = -leng*Math.pow(3,0.5)/2-r;
        pos.push({left:left,top:top});
        /*top-left*/
        top = -leng/2-r;
        pos.push({left:left,top:top});
        /*bot*/
        //left = -r;
        //top = leng-r;
        //pos.push({left:left,top:top});
        return pos;
    }
  
    /*长按显示菜单
    var hold=false;
    $('.p-cont').on('touchstart touchend',function(event){
        event.stopPropagation();
        if(event.type == 'touchstart'){
            hold= true;
            var ths=$(this);
            setTimeout(function(){
                if(hold){
                    moveCtrl(ths.next(),true);
                }
            },1000);
        }else{
            hold =false;
            console.log('click');
        }
    });
    */
    // 个人积分显示动画
    var ptm=0;
    function showProcess(percent){
        var rate=2;
        setTimeout(function(){
            if(ptm<percent*rate){
                ptm++;
                $('#vip-process').text(ptm/rate);
                drawProcess();
                showProcess(percent);
            }
        },10);
    }
    function drawProcess() {
        $('#vip-process').each(function() {
            var process = $(this).text();
            var canvas = this;
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, 300, 300);
            context.beginPath();
            context.moveTo(280, 280);
            context.arc(150, 150, 120, -Math.PI * 0.5, Math.PI * 1.5, false);
            context.closePath();
            context.fillStyle = 'rgba(78,79,83,1)';
            context.fill();

            context.beginPath();
            context.moveTo(150, 150);
            context.arc(150, 150, 120, -Math.PI * 0.5,  -Math.PI * 0.5+Math.PI * 2* process / 100, false);
            context.closePath();
            context.fillStyle = 'rgb(255,200,37)';
            context.fill();

            context.beginPath();
            context.moveTo(150, 150);
            context.arc(150, 150, 80, -Math.PI * 0.5, Math.PI * 1.5, true);
            context.closePath();
            context.fillStyle = 'rgba(51,51,51,1)';
            context.fill();
        });
    }
    function showLoading(type){
        if(type){
            $('#body-loading').show();
        }else{
            $('#body-loading').hide();
        }
    }
})

