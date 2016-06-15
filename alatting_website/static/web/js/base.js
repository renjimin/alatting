
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
            $('.login-leftbtn').text('登陆');
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


