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

})
/*
var cate = document.querySelector('#catelist').childNodes;
cate.onclick = function(event){
    alert(event.currentTarget.children.length);
}*/