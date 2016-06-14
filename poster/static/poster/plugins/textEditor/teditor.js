$(function(){
    $('#text-element-act').tEditor({});
    var postcontainer = $('.container-fluid').find('.yunye-template');
    $('#share-panel .share-edit').on('click',function(e){
        e.stopPropagation();
        $('.dropdown-panel').removeClass('open');
        $('.dropdown-toggle').removeClass('open');
        var $cnd = $('<div class="cnd-element text-element"><div class="el-content">请修改文字</div><div class="el-rotate"></div><div class="el-editor"></div></div>');
        postcontainer.append($cnd);
        $cnd.css({'top':'20px','left':'100px'});
        $cnd.children('.el-content').trigger('click');
    });

    $('#text-slide-down').on('click',function(e){
        e.stopPropagation();
        editor('close');
        //$('#text-model').animate({'bottom':'-300px'},200);
    });
    postcontainer.on('click','.el-content',function(event){
        event.stopPropagation();
        var ths = $(this).parent();
        $('.cnd-element').removeClass('active');
        $('.text-element').removeClass('text-element-act').css('z-index','100');
        ths.addClass('text-element-act').addClass('active').css('z-index','110');
        ths.tEditor({});
        ths.domRotate({ebox:postcontainer});
        $('#share-panel').addClass('open').siblings('.dropdown-panel').removeClass('open');
        $('#share-toggle').addClass('open').siblings('.dropdown-toggle').removeClass('open');
        $('.bar-footer').addClass('footer-hide');
    });
    $('.text-element').removeClass('text-element-act');
    $('.ele-rotate-ctrl').remove();
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
    $('#ele-editor-ctrl').off('touchstart').on('touchstart',function(event){
        event.preventDefault();
        event.stopPropagation();
    });
    postcontainer.on('touchend click','#ele-editor-ctrl',function(event){
        event.stopPropagation();
        if(event.type=='touchend'){
            //$(document).trigger('clsdp',event.currentTarget);
            var bot = parseInt($('#text-model').css('bottom'));
            if(bot<0){
                $('#text-model').addClass('open');
                //$('#text-model').animate({'bottom':'0px'},200);
                editor('open',$('.text-element-act'));
            }else{
                $('#text-model').removeClass('open')
                //$('#text-model').animate({'bottom':'-300px'},200);
                editor('close');
            }
        }
    });


});
