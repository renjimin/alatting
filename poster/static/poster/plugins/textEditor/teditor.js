$(function(){

    /* 初始化面板 */
    var teditOption = {
        colorArr:
            ['#f8aba6','#f58f98','#f391a9','#f05b72','#d93a49','#b3424a','#a7324a','#840228','#6b2c25','#54211d',
            '#8e3e1f','#b4532a','#de773f','#f47920','#faa755','#fab27b','#dea32c','#ffc20e','#fdb933','#ffe600',
            '#f0dc70','#fcf16e','#b2d235','#a3cf62','#7fb80e','#78a355','#769149','#817936','#87843b','#454926',
            '#2e3a1f','#122e29','#274d3d','#225a1f','#007947','#508a88','#70a19f','#008792','#78cdd1','#afdfe4',
            '#90d7ec','#7bbfea','#009ad6','#228fbd','#2570a1','#2468a2','#145b7d','#2a5caa','#224b8f','#2b4490',
            '#1b315e','#11264f','#45224a','#543044','#63434f','#594c6d','#6950a1','#6f60aa','#9b95c9','#afb4db',
            '#fffffb','#f6f5ec','#f2eada','#d3d7d4','#a1a3a6','#999d9c','#72777b','#4f5555','#3e4145','#281f1d',
            '#130c0e'],
        fontFamily:
            ['Helvetica','Microsoft YaHei','Helvetica Neue','Arial Bold Italic','Arial Black','Arial Narrow','Avant Garde','Avantgarde',
            'Century Gothic','AppleGothic','Calibri','Candara','Segoe UI','Optima','Candara','Calibri','Franklin Gothic Medium','Franklin Gothic',
            'Futura','Trebuchet MS','Impact','Haettenschweiler','Optima','Tahoma','Verdana','Geneva','Baskerville','Baskerville Old Face',
            'Times New Roman','Garamond','Big Caslon','Bodoni MT','Cambria','Didot','Didot LT STD','Lucida Bright','Palatino','Palatino Linotype',
            'Perpetua','Baskerville','Rockwell','Courier','Andale Mono','Courier New','Lucida Console','Lucida Sans Typewriter','Brush Script MT',
            'Copperplate'],
        colorCanvas:document.getElementById("bot-cbox-canvas"),
        nElement:''
    };
    (function(){
        var cdiv='';
        for(var i=0;i<teditOption.colorArr.length;i++){
            cdiv += '<li class="color-li" style="background:'+teditOption.colorArr[i]+';" data-color="'+teditOption.colorArr[i]+'"></li>';
        }
        $('#ted-color-list').append(cdiv);
        $('#effects-color-list').append(cdiv);
        var fdiv = '';
        for(var i=0;i<teditOption.fontFamily.length;i++){
            fdiv += '<li class="ted-font-li" style="font-family:\''+teditOption.fontFamily[i]+'\';" data-fm="'+teditOption.fontFamily[i]+'">'+teditOption.fontFamily[i]+'</li>';
        }
        $('#ted-font-list').append(fdiv);

        var canvas = document.getElementById("bot-cbox-canvas");
        var ctx=canvas.getContext("2d");
        canvas.width=parseInt($('.bot-cbox').width());
        canvas.height=parseInt($('.bot-cbox').height());
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            hGrad.addColorStop(0 / 6, '#F00');
            hGrad.addColorStop(1 / 6, '#FF0');
            hGrad.addColorStop(2 / 6, '#0F0');
            hGrad.addColorStop(3 / 6, '#0FF');
            hGrad.addColorStop(4 / 6, '#00F');
            hGrad.addColorStop(5 / 6, '#F0F');
            hGrad.addColorStop(6 / 6, '#F00');
        ctx.fillStyle = hGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        vGrad.addColorStop(0, 'rgba(255,255,255,1)');
        vGrad.addColorStop(1/2, 'rgba(255,255,255,0)');
        vGrad.addColorStop(1/2, 'rgba(0,0,0,0)');
        vGrad.addColorStop(2/2, 'rgba(0,0,0,1)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    })();

    /* 文字元素管理 */
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
