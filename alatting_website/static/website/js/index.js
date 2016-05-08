$(function(){
    $("#catelist .item-link").click(function(){
        $(this).parent().addClass('open');
        $(this).parent().siblings().removeClass('open').find('.sublist').slideUp(200);
        $(this).parent().find('.sublist').slideDown(200);
    });
    $('#btn-create').click(function(){
        if($('#type-model').hasClass('open')){
            $('#type-model').removeClass('open');
        }else{
            $('#type-model').addClass('open');
        }
    });
    $('#hide-cate').click(function(){
        $('#type-model').removeClass('open');
    });

    $('#type-model-ftcat').height($(window).height() - 60);
    $('#type-model-ftcat-container').css("max-height", ($(window).height() - 70)+'px');
    $("#ftcatelist .item-link").click(function(){
        $(this).parent().addClass('open');
        $(this).parent().siblings().removeClass('open').find('.sublist').slideUp(200);
        $(this).parent().find('.sublist').slideDown(200);
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
})
/*
var cate = document.querySelector('#catelist').childNodes;
cate.onclick = function(event){
    alert(event.currentTarget.children.length);
}*/