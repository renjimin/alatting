
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
});


