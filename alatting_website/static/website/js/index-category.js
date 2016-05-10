$(function(){
    /*footer*/
    $('.footer-tab li.active').removeClass("active");
    $('.footer-tab').find("li").eq(2).addClass("active");
    /*footer 类型选择*/
    $('#type-model-ftcat').height($(window).height() - 60);
    $('#type-model-ftcat-container').css("max-height", ($(window).height() - 70)+'px');
    $("#ftcatelist .ftcat-item-link").click(function(){
        if($(this).parent().hasClass('open')){
            $(this).parent().find('.ftcat-item-sublist').slideUp(200);
            $(this).parent().removeClass('open');
            $(this).parent().siblings().find('.ftcat-item-link').css("width", "100%");
            $(this).siblings('.ftcat-item-sbt').addClass('hidden');
        }else{
            $(this).parent().find('.ftcat-item-sublist').slideDown(200);
            $(this).parent().addClass('open');
            $(this).css("width", "64%");
            $(this).siblings('.ftcat-item-sbt').removeClass('hidden');
            
            $(this).parent().siblings().removeClass('open').find('.ftcat-item-sublist').slideUp(200);
            $(this).parent().siblings().find('.ftcat-item-sbt').addClass('hidden');
            $(this).parent().siblings().find('.ftcat-item-link').css("width", "100%");
        }
    });
    // $('#ftcat').click(function(){
    //     if($('#type-model-ftcat').hasClass('open')){
    //         $('#type-model-ftcat').removeClass('open');
    //     }else{
    //         $('#type-model-ftcat').addClass('open');
    //     }
    // });
    $('#hide-ftcate').click(function(){
        $('#type-model-ftcat').removeClass('open');
    });
    $(".ftcat-item-sbt").click(function(){
        var state_id = $(this).attr('id')
        var ftcat_item_id = state_id.substr(state_id.lastIndexOf('-') + 1);
        var hrefURL = '?category='+ftcat_item_id;

        var ftcat_subitem_name = "ftcat-subitem-"+ftcat_item_id;
        var ftcat_subitem_checkboxes = $("[name='" + ftcat_subitem_name + "']");
        for (var i = 0, n = ftcat_subitem_checkboxes.length; i < n; i++) {
            if (ftcat_subitem_checkboxes[i].checked) {
                hrefURL += '&subcategory='+ ftcat_subitem_checkboxes[i].value;
            }
        }
        window.location.href = hrefURL;
    });
})
