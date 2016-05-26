
$(document).ready(function(){
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
    $('#posters .poster-item').hover(function(){
        $(this).addClass('hover');
    },function(){
        $(this).removeClass('hover');
    });

    $('body').on('click',function(){
        $('#searchBtn').removeClass('active');
        $('#searchBar').removeClass('open');
    });

    $('.poster-list .poster-item').imgshow();
    $('.dropdown-toggle').dropdown()
});
