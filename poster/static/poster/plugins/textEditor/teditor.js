
$(function(){
    $('#text-element-act').tEditor({});

    $('.share-text').on('touchend',function(e){
        e.stopPropagation();
        addDefTextElement();
    });
/*
    $('.share-edit').on('click',function(){
        var bot = parseInt($('#text-model').css('bottom'));
        if(bot<0){
            $('#text-model').animate({bottom:'0px'},200);
        }else{
            $('#text-model').animate({bottom:'-265px'},200);
        }
    });
*/
    $('#text-slide-down').on('click',function(e){
        e.stopPropagation();
        var height = $('#text-model').outerHeight();
        $('#text-model').animate({bottom:'-'+height+'px'},200);
    });

    fullcontainer.on('click','.text-element',function(e){
        e.stopPropagation();
        $('.text-element').removeClass('text-element-act').css('z-index','100');
        $(this).addClass('text-element-act').css('z-index','110');
        var bot = parseInt($('#text-model').css('bottom'));
        if(bot<0){
            $('#text-model').animate({bottom:'0px'},200);
        }
        $(this).tEditor({});
    });


    /*element 移动*/
    var bx,by,_bx,_by,barx,bary,move;
    fullcontainer.on('touchstart touchmove touchend','.text-element',function(event){
        var e = event.originalEvent.targetTouches[0];
        if(event.type == "touchstart" ){
            barx = parseInt($(this).css('left'));
            bary = parseInt($(this).css('top'));
            _bx= e.pageX;
            _by= e.pageY;
            move=true;
        }else if(event.type == "touchmove" ){
            event.preventDefault();
            if(move){
                bx= e.pageX;
                by= e.pageY;
                var sx = bx-_bx+barx;
                var sy = by-_by+bary;
                $(this).css({'left':sx+'px',top:sy+'px'});
            }
        }else{
            move=false;
        }
    });

});


var addDefTextElement = function(){
    var cnd = $('<div class="cnd-element text-element">'
        +'<div class="element-box">'
        +'	<div class="element-box-contents">请修改文字</div>'
        +'</div>'
//        +'<div class="nbar nbar-rotate nbar-radius"></div>'
//        +'<div class="nbar nbar-line"></div>'
//        +'<div class="nbar nbar-n"><div class="nbar-radius"></div></div>'
//        +'<div class="nbar nbar-s"><div class="nbar-radius"></div></div>'
//        +'<div class="nbar nbar-e"><div class="nbar-radius"></div></div>'
//        +'<div class="nbar nbar-w"><div class="nbar-radius"></div></div>'
//        +'<div class="nbar nbar-nw nbar-radius nbar-edit" style="display: none;"><i class="glyphicon glyphicon-pencil"></i></div>'
//        +'<div class="nbar nbar-se nbar-radius"></div>'
//        +'<div class="nbar nbar-sw nbar-radius"></div>'
//        +'<div class="nbar nbar-ne nbar-radius"></div>'
        +'</div>');
    fullcontainer.append(cnd);
    cnd.css({'top':$(window).height()/2-cnd.height()/2+'px','left':$(window).width()/2-cnd.width()/2+'px'});
//    scale(cnd);
    cnd.tEditor({});
}