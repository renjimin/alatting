/**
 * Created by zhangjie on 2016/5/30.
 */
$(function(){

    var serverProvideTmpl = $('#serverProvideTmpl').html();
    $.template('serverProvideTmpl',serverProvideTmpl);
    var data = [
        {
            posterid:1,
            snapshot:'/static/account/img/hb001.png',
            postername:'yigehaibao2'
        },
        {
            posterid:2,
            snapshot:'/static/account/img/hb001.png',
            postername:'yigehaibao3'
        },
        {
            posterid:3,
            snapshot:'/static/account/img/hb001.png',
            postername:'yigehaibao4'
        },
        {
            posterid:4,
            snapshot:'/static/account/img/hb001.png',
            postername:'yigehaibao5'
        },
        {
            posterid:3,
            snapshot:'/static/account/img/hb001.png',
            postername:'yigehaibao4'
        },
        {
            posterid:4,
            snapshot:'/static/account/img/hb001.png',
            postername:'yigehaibao5'
        },
        {
            posterid:3,
            snapshot:'/static/account/img/hb001.png',
            postername:'yigehaibao4'
        },
        {
            posterid:4,
            snapshot:'/static/account/img/hb001.png',
            postername:'yigehaibao5'
        }
    ];
    for(var i=0;i<data.length;i++){
        $.tmpl('serverProvideTmpl',data[i]).appendTo('#main-provide');
    }
    $(document).scroll(function(){
        var h = $('.body-header').outerHeight();
        var sh = $('body').scrollTop();
        if(sh>h){
            $('#main-head').css('position','fixed');
        }else{
            $('#main-head').css('position','absolute');
        }
        if(sh>h){
            $('#ctrl-add').css({'position':'fixed','top':'50px'});
        }else{
            $('#ctrl-add').css({'position':'absolute','top':'10px'});
        }
    });
    /*
    $.ajax({
        type: 'GET',
        url: '/api/v1/account/profile',
        success:function(data){
            //var headIcon = data.person?'/static/account/img/headicon-default.jpg':data.person.avatar;
            var headIcon = '/static/account/img/headicon-default.jpg';
            $('#uIcon').children('img').attr('src',headIcon);
            $('#uName').html(data.username);
        },
        error: function(xhr,status,statusText){
            yyAlert("data error");
        }
    });

    var serverProvideTmpl = $('#serverProvideTmpl').html();
    $.template('serverProvideTmpl',serverProvideTmpl);
    $.ajax({
        type: 'GET',
        url: '/api/v1/account/posters/server',
        success:function(data){
            for(var i=0;i<data.length;i++){
                var pd = {
                    posterid:data[i].id,
                    snapshot:data[i].snapshot,
                    postername:data[i]['unique_name']
                };
                $.tmpl('serverProvideTmpl',pd).appendTo('#main-provide');
            }
        },
        error: function(xhr, status, statusText){
            if(xhr.status == 403) {
                yyAlert("用户名已经存在,请更换");
            }else if(xhr.status == 401) {
                yyAlert("请使用"+text+"注册");
            }
            else{
                yyAlert("参数错误");
            }
        }
    });
    var serverNeedTmpl = $('#serverNeedTmpl').html();
    $.template('serverNeedTmpl',serverNeedTmpl);
    $.ajax({
        type: 'GET',
        url: '/api/v1/account/posters/consumer',
        success:function(data){
            for(var i=0;i<data.length;i++){
                var pd = {
                    posterid:data[i].id,
                    snapshot:data[i].snapshot,
                    postername:data[i]['unique_name']
                };
                $.tmpl('serverNeedTmpl',pd).appendTo('#main-need');
            }
        },
        error: function(xhr, status, statusText){
            if(xhr.status == 403) {
                yyAlert("用户名已经存在,请更换");
            }else if(xhr.status == 401) {
                yyAlert("请使用"+text+"注册");
            }
            else{
                yyAlert("参数错误");
            }
        }
    });
*/
    $('.p-cont').on('click',function(event){
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
    $('.p-ctrl').on('click',function(){
        $(this).parent().parent().removeClass('main-li-act');
        moveCtrl($(this),false);
    });
    /*user-level*/
    $('.user-level').on('click',function(event){
        event.stopPropagation();
        $('#body-vip').toggle();
        showProcess(50);
    })
    /*view*/
    $('.ctrl-view').on('click',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        var pageType= $('#pageType').val();
        if(pageType == 'provide'){
            console.log('view:provide:'+id);
        }else{
            console.log('view:need:'+id);
        }
    });
    /*favorite*/
    $('.ctrl-favorite').on('click',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        console.log('favorite:'+id);
    });
    /*statistics*/
    $('.ctrl-statistics').on('click',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        console.log('statistics:'+id);

    });
    /*share*/
    $('.ctrl-share').on('click',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        $('#shareId').val(id);
        moveCtrl($(this).parent(),false);
        moveShareBtn(true);
        console.log('share:'+id);
    });
    /*edit*/
    $('.ctrl-edit').on('click',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        console.log('edit:'+id);

    });
    /*delete*/
    $('.ctrl-delete').on('click',function(event){
        event.stopPropagation();
        var id= $(this).parent().attr('data-id');
        console.log('delete:'+id);

    });
    /*quit share*/
    $('#body-share').on('click',function(){
        moveShareBtn(false);
    });
    /*poster-list switchover*/
    $('.head-bot-li').on('click',function(){
        var ths =$(this);
        var item = ths.attr('data-item');
        $('#pageType').val(item);
        $('.head-bot-li').removeClass('head-bot-act');
        ths.addClass('head-bot-act');
        $('.main-list').hide();
        $('#main-'+item).show();
    });
	/* show the controller of the poster */
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
	/* show share controller */
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
                    ths.next().fadeIn(200);
                    moveCtrl(ths.next(),true);
                }
            },1000);
        }else{
            hold =false;
            console.log('click');
        }
    });
    */
    var ptm=0;
    function showProcess(percent){
        var rate=2;
        var t= setTimeout(function(){
            if(ptm<percent*rate){
                ptm++;
                $('#vip-process').text(ptm/rate);
                drawProcess();
                showProcess(percent);
            }else{
                clearTimeout(t);
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
})

