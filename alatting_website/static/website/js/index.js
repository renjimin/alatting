$(function(){
    $("#catelist .item-link").click(function(){
        if($(this).parent().hasClass('open')){
             $(this).parent().find('.sublist').slideUp(200);
            $(this).parent().removeClass('open');
        }else{
            $(this).parent().addClass('open');
            $(this).parent().siblings().removeClass('open').find('.sublist').slideUp(200);
            $(this).parent().find('.sublist').slideDown(200);
        }

    });
    $('#btn-create').click(function(){
        var login_url = $(this).data('login');
        if(login_url != ""){
            yyAlert("您需要登录才能创建海报", function () {
                window.location.href = login_url;
            });
            return false;
        }
        if($('#type-model').hasClass('open')){
            $('#type-model').removeClass('open');
        }else{
            $('#type-model').addClass('open');
        }
    });
    $('#hide-cate').click(function(){
        $('#type-model').removeClass('open');
    });
/*footer 类型选择*/
    $('#type-model-ftcat').height($(window).height() - 60);
    $('#type-model-ftcat-container').css("max-height", ($(window).height() - 70)+'px');
    $("#ftcatelist .ftcat-item-link").click(function(){
        $(this).siblings('.ftcat-item-sbt').removeClass('hidden');
        $(this).parent().siblings().find('.ftcat-item-sbt').addClass('hidden');
        $(this).parent().addClass('open');
        $(this).parent().siblings().removeClass('open').find('.ftcat-item-sublist').slideUp(200);
        $(this).parent().find('.ftcat-item-sublist').slideDown(200);
    });
    $('#ftcat').click(function(){
        if($('#type-model-ftcat').hasClass('open')){
            $('#type-model-ftcat').removeClass('open');
        }else{
            $('#type-model-ftcat').addClass('open');
        }
    });
    $('#hide-ftcate').click(function(){
        $('#type-model-ftcat').removeClass('open');
    });
    $(".ftcat-item-sbt").click(function(){
        var state_id = $(this).attr('id')
        var ftcat_item_id = state_id.substr(state_id.lastIndexOf('-') + 1);
        var hrefURL = '/?category='+ftcat_item_id;

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
/*
var cate = document.querySelector('#catelist').childNodes;
cate.onclick = function(event){
    alert(event.currentTarget.children.length);
}*/