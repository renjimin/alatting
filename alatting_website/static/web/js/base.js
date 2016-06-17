$(document).ready(function(){
    /* 配合css实现页面加载动画 */
    setTimeout(function(){
        $('body').addClass('active')
    },100);

    /*图片懒加载*/
    $('.lazy').lazyload({
        'placeholder':'',
        'data_attribute':'src',
        'effect':'fadeIn'
    });
    /*登陆注册事件*/
    $('.login-toggle').click(function(event){
        event.stopPropagation();
        $('.login-div').show();
    });
    $('.login-close').click(function(event){
        event.stopPropagation();
        $('.login-div').hide();
    });
    $('.login-leftbtn').click(function(event){
        event.stopPropagation();
        var btnvalue = $('.login-leftbtn').text();
        if(btnvalue == "注册"){
            $('.login-form').show();
            $('.regist-form').hide();
            $('.psd-right').hide();
            $('.login-right').show();
            $('.login-leftbtn').text('登录');
        }else{
            $('.login-form').hide();
            $('.regist-form').show();
            $('.psd-right').hide();
            $('.login-right').show();
            $('.login-leftbtn').text('注册');
        }
    });
    $('.fotgetpwd').click(function(event){
            $('.login-right').hide();
            //$('.regist-form').hied();
            $('.psd-right').show();
    })
    $('.rember-psd').click(function(event){
            $('.login-form').show();
            $('.regist-form').hide();
            $('.psd-right').hide();
            $('.login-right').show();
    })
    /*顶部搜索按钮*/
    $('#searchBtn').click(function(event){
        event.stopPropagation();
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('#searchBar').removeClass('open');
        }else{
            $(this).addClass('active');
            $('#searchBar').addClass('open');
        }
    });
    $('#searchBar').on('click',function(event){
        event.stopPropagation();
    });
    /* 海报列表hover效果 */
    $('.poster-list .poster-item').hover(function(){
        $(this).addClass('hover');
    },function(){
        $(this).removeClass('hover');
    });

    $('body').on('click',function(){
        $('#searchBtn').removeClass('active');
        $('#searchBar').removeClass('open');
    });

    $('.poster-list .poster-item').imgshow();
    $('.dropdown-toggle').dropdown();

    $('#friends-btn').click(function(){
        if($(this).hasClass('open')){
            $(this).removeClass('open');
            $('.usersshow-dialog').removeClass('open');
        }else{
            $('.usersshow-dialog').css({'height':$(window).height()-150+'px'});
            $(this).addClass('open');
            $('.usersshow-dialog').addClass('open');
        }
    });

    $("#searCatoBody a").click(function(){
        var $this = $(this);
        $this.parent().addClass('active').siblings().removeClass('active');
        $("#catId").val($this.attr('data-id'));
        setTimeout(function(){
            $this.parentsUntil('div').parent().removeClass("open");
        }, 300);
        if($.trim($("#q").val()) != ""){
            $("#search_form").submit();
        }
    });
    $("#share-btn").on('click',function(event){
        event.stopPropagation();
    });
});


(function () {
    function yyAlert(text,callback,params){
        var defaults = {
            'okText':'知道了'
        }
        var options = extend(defaults,params);

        var alertEle = document.getElementById('yyalert-dialog'), coverbox,popbox,yyBtnConfirm;

        if(alertEle == undefined || alertEle.length <= 0){
            var cover = '<div id="yyalert-cover" class="yyalert-cover" style=""><div class="yyalert-cover-inner"></div></div>';
            var divelement = '<div class="yyalert" id="yyalert"><div class="yyalert-text">'+text+'</div><div class="yyalert-footer"><a href="javascript:void(0);" id="yyBtnAlert" class="yyalert-btn">知道了</a></div></div>';
            alertEle = document.createElement('div');
            alertEle.setAttribute('id','yyalert-dialog');
            alertEle.innerHTML = cover + divelement;

            document.body.appendChild(alertEle);
        }
        coverbox = document.getElementById('yyalert-cover');
        popbox = document.getElementById('yyalert');
        yyBtnConfirm = document.getElementById('yyBtnAlert');

        /* set */
        yyBtnConfirm.innerHTML = options.okText;
        popbox.children[0].innerHTML = text;
        /* position */
        popbox.style.marginTop = - popbox.offsetHeight/2+'px';
        popbox.style.marginLeft =  -popbox.offsetWidth/2+'px';
        setTimeout(function(){
            alertEle.classList.add('open');
        },50);
        coverbox.onclick=function(){
            alertEle.classList.remove('open');
        }
        yyBtnConfirm.onclick=function(){
            alertEle.classList.remove('open');
            if(callback!=null && typeof(eval(callback)) == "function"){
                callback();
            }
        }
    }
    window.yyAlert = yyAlert;
})();
(function () {
    function yyConfirm(text,callback,params){
        var defaults = {
            'okText':'知道了',
            'cancelText':'取消',
            'cancelFun':null
        }
        var options = extend(defaults,params);

        var confirmEle = document.getElementById('yyconfirm-dialog'), coverbox, popbox, yyBtnConfirm,yyBtnCancel;
        if(confirmEle == undefined || confirmEle.length <= 0){
            var cover = '<div id="yyconfirm-cover" class="yyalert-cover" style=""><div class="yyalert-cover-inner"></div></div>';
            var divelement = '<div class="yyalert" id="yyconfirm"><div class="yyalert-text">'+text+'</div><div class="yyalert-footer"><a href="javascript:void(0);" id="yyBtnCancel" class="yyalert-btn">取消</a><a href="javascript:void(0);" id="yyBtnConfirm" class="yyalert-btn">知道了</a></div></div>';
            confirmEle = document.createElement('div');
            confirmEle.setAttribute('id','yyconfirm-dialog');
            confirmEle.innerHTML = cover + divelement;
                            document.body.appendChild(confirmEle);
        }
        coverbox = document.getElementById('yyconfirm-cover');
        popbox = document.getElementById('yyconfirm');
        yyBtnConfirm = document.getElementById('yyBtnConfirm');
        yyBtnCancel = document.getElementById('yyBtnCancel');
        /* set */
        yyBtnConfirm.innerHTML = options.okText;
        yyBtnCancel.innerHTML = options.cancelText;
        popbox.children[0].innerHTML = text;

        popbox.style.marginTop = - popbox.offsetHeight/2+'px';
        popbox.style.marginLeft =  - popbox.offsetWidth/2+'px';
        setTimeout(function(){
            confirmEle.classList.add('open');
        },50);
        coverbox.onclick=function(){
            confirmEle.classList.remove('open');
        }
        yyBtnCancel.onclick=function(){
            confirmEle.classList.remove('open');
            if(options.cancelFun!=null && typeof(eval(options.cancelFun)) == "function"){
                options.cancelFun();
            }
        }
        yyBtnConfirm.onclick=function(){
            confirmEle.classList.remove('open');
            if(callback!=null && typeof(eval(callback)) == "function"){
                callback();
            }
        }

    }
    window.yyConfirm = yyConfirm;
})();
(function () {
    function yyMessage(text){
        var yymessage = document.getElementById('yymessage');

        if(yymessage == undefined || yymessage.length <= 0){
            var divelement = '<div class="yymessage-txt"></div>';
            yymessage = document.createElement('div');
            yymessage.setAttribute('id','yymessage');
            yymessage.setAttribute('class','yymessage');
            yymessage.innerHTML = divelement;
            document.body.appendChild(yymessage);
        }

        yymessage.children[0].innerHTML = text;

        yymessage.classList.add('open');
        setTimeout(function(){
            yymessage.classList.remove('open');
        },3000);

    }
    window.yyMessage = yyMessage;
})();
function extend(destination, source) {
    for (var property in source)
    destination[property] = source[property];
    return destination;
}
