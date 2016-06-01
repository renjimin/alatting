/**
 * Created by zhangjie on 2016/5/30.
 */
$(function(){

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
        $.ajax({
            type: '',
            url: '/api/v1/account/posters/server',
            success:function(data){
                var headIcon = data.person.avatar;
                headIcon = headIcon?'/static/account/img/headicon-default.jpg':headIcon;
                $('#uIcon').children('img').attr('src',headIcon);
                $('#uName').html(data.username);
            },
            error: function(xhr, status, statusText){
                /*
                if(xhr.status == 403) {
                    yyAlert("用户名已经存在,请更换");
                }else if(xhr.status == 401) {
                    yyAlert("请使用"+text+"注册");
                }
                else{
                    yyAlert("参数错误");
                }
                */
            }
        });



    $('.p-cont').on('click',function(event){
        event.stopPropagation();
        var ths=$(this).next();
        moveCtrl(ths,true);
    });
    $('.p-ctrl').on('click',function(){
        moveCtrl($(this),false);
    });
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
        if(type){
            var pos = getSixPos();
            ths.fadeIn(200);
            ths.children('.share-weixin').animate({marginLeft:pos[0].left+'px',marginTop:pos[0].top+'px'},400);
            ths.children('.share-friend').animate({marginLeft:pos[1].left+'px',marginTop:pos[1].top+'px'},400);
            ths.children('.share-weibo').animate({marginLeft:pos[2].left+'px',marginTop:pos[2].top+'px'},400);
            ths.children('.share-qq').animate({marginLeft:pos[3].left+'px',marginTop:pos[3].top+'px'},400);
            ths.children('.share-twitter').animate({marginLeft:pos[4].left+'px',marginTop:pos[4].top+'px'},400);
            ths.children('.share-facebook').animate({marginLeft:pos[5].left+'px',marginTop:pos[5].top+'px'},400);
        }else{
            ths.fadeOut(200);
            ths.children().animate({marginLeft:'-35px',marginTop:'-35px'},400);
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
        left = -r;
        top = leng-r;
        pos.push({left:left,top:top});
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
});
