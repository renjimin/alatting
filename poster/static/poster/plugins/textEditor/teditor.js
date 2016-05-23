$(function(){
    $('#text-element-act').tEditor({});
    var postcontainer = $('.container-fluid').children('.yunye-template');
    $('#share-toggle').on('click',function(e){
        e.stopPropagation();
        $('.dropdown-panel').removeClass('open');
        $('.dropdown-toggle').removeClass('open');
        var cnd = $('<div class="cnd-element text-element"><div class="el-content">请修改文字</div><div class="el-rotate"></div><div class="el-editor"></div></div>');
        postcontainer.append(cnd);
        cnd.css({'top':'20px','left':'100px'});
    });

    $('#text-slide-down').on('click',function(e){
        e.stopPropagation();
        $('#text-model').animate({'bottom':'-300px'},200);
    });
    postcontainer.on('click','.text-element',function(event){
        event.stopPropagation();
        var ths = $(this);
        $('.cnd-element').removeClass('active');
        $('.text-element').removeClass('text-element-act').css('z-index','100');
        ths.addClass('text-element-act').css('z-index','110');
        ths.tEditor({});
        ths.domRotate({ebox:postcontainer});
    });
    $('.text-element').removeClass('text-element-act');
    $('.ele-rotate-ctrl').css({left:'-200px',top:'-200px',display:'block'});
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
    postcontainer.on('click','#ele-editor-ctrl',function(e){
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
