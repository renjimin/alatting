
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
        $('#text-model').animate({'bottom':'-300px'},200);
    });


    fullcontainer.on('click','.text-element',function(e){
        e.stopPropagation();
        var ths = $(this);
        $('.text-element').removeClass('text-element-act').css('z-index','100');
        ths.addClass('text-element-act').css('z-index','110');
        ths.tEditor({});
        ths.domRotate({ebox:fullcontainer});
    });
    /*
    var hidtime = 3;
    function hideAct(obj){
        setTimeout(function(){
            hidtime--;
            if(hidtime<=0){
                obj.removeClass('text-element-act');
                $('#ele-rotate-ctrl').css({left:'-200px',top:'-200px'});
            }else{
                hideAct(obj);
            }
        },1000);
    }
    */

    fullcontainer.on('click','.el-editor',function(e){
        e.stopPropagation();
        var bot = parseInt($('#text-model').css('bottom'));
        if(bot<0){
            $('#text-model').animate({'bottom':'0px'},200);
        }else{
            $('#text-model').animate({'bottom':'-300px'},200);
        }
    });



    fullcontainer.on('dblclick','.text-element',function(e){
        e.stopPropagation();
        $('.text-element').removeClass('text-element-act').css('z-index','100');
        $(this).addClass('text-element-act').css('z-index','110');
        $(this).domRotate({ebox:fullcontainer});
    });



});
