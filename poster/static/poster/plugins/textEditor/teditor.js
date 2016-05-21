
$(function(){
    $('#text-element-act').tEditor({});

    $('#share-toggle').on('click',function(e){
        e.stopPropagation();
        var cnd = $('<div class="text-element"><div class="el-content">请修改文字</div><div class="el-editor"></div></div>');
        fullcontainer.append(cnd);
        cnd.css({'top':'20px','left':'100px'});
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
    fullcontainer.on('click','#ele-editor-ctrl',function(e){
        e.stopPropagation();
        $(document).trigger('clsdp');
        var bot = parseInt($('#text-model').css('bottom'));
        if(bot<0){
            $('#text-model').animate({'bottom':'0px'},200);
        }else{
            $('#text-model').animate({'bottom':'-300px'},200);
        }
    });


});
