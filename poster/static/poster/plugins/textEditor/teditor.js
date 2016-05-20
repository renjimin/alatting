
$(function(){
    $('#text-element-act').tEditor({});

    $('#share-toggle').on('touchend',function(e){
        e.stopPropagation();
        var cnd = $('<div class="cnd-element text-element"><div class="el-content">请修改文字</div><div class="el-editor"><span class="glyphicon glyphicon-pencil"></span></div></div>');
        fullcontainer.append(cnd);
        cnd.css({'top':fullcontainer.height()/2-cnd.height()/2+'px','left':fullcontainer.width()/2-cnd.width()/2+'px'});
    });

    $('#text-slide-down').on('click',function(e){
        e.stopPropagation();
        var height = $('#text-model').outerHeight();
        $('#text-model').animate({bottom:'-'+height+'px'},200);
    });

    fullcontainer.on('click','.text-element',function(e){
        e.stopPropagation();
        $('.text-element').removeClass('text-element-act').css('z-index','100');
        $(this).addClass('text-element-act').css('z-index','110');
//        $(this).children('.el-editor').show();
//        var bot = parseInt($('#text-model').css('bottom'));
//        if(bot<0){
//            $('#text-model').animate({bottom:'0px'},200);
//        }
        $(this).tEditor({});
        $(this).domRotate({ebox:fullcontainer});
    });

    fullcontainer.on('click','.el-editor',function(e){
        e.stopPropagation();
        var bot = parseInt($('#text-model').css('bottom'));
        if(bot<0){
            $('#text-model').animate({bottom:'0px'},200);
        }else{
            var height = $('#text-model').outerHeight();
            $('#text-model').animate({bottom:'-'+height+'px'},200);
        }
    });



    fullcontainer.on('dblclick','.text-element',function(e){
        e.stopPropagation();
        $('.text-element').removeClass('text-element-act').css('z-index','100');
        $(this).addClass('text-element-act').css('z-index','110');
        $(this).domRotate({ebox:fullcontainer});
    });



});
