

;(function(){
    var defaults, pluginName;
    var colorArr =
    ['#f8aba6','#f58f98','#f391a9','#f05b72','#d93a49','#b3424a','#a7324a','#840228','#6b2c25','#54211d',
    '#8e3e1f','#b4532a','#de773f','#f47920','#faa755','#fab27b','#dea32c','#ffc20e','#fdb933','#ffe600',
    '#f0dc70','#fcf16e','#b2d235','#a3cf62','#7fb80e','#78a355','#769149','#817936','#87843b','#454926',
    '#2e3a1f','#122e29','#274d3d','#225a1f','#007947','#508a88','#70a19f','#008792','#78cdd1','#afdfe4',
    '#90d7ec','#7bbfea','#009ad6','#228fbd','#2570a1','#2468a2','#145b7d','#2a5caa','#224b8f','#2b4490',
    '#1b315e','#11264f','#45224a','#543044','#63434f','#594c6d','#6950a1','#6f60aa','#9b95c9','#afb4db',
    '#fffffb','#f6f5ec','#f2eada','#d3d7d4','#a1a3a6','#999d9c','#72777b','#4f5555','#3e4145','#281f1d',
    '#130c0e'];
    var fontFamily= ['Helvetica','Microsoft YaHei','楷体','幼圆','隶书','华文新宋','华文彩云','华文行楷','苹果丽黑','华康中黑字体','华康娃娃体','华康少女字体'];
    pluginName = "teditor";
    defaults = {
        colorArr:colorArr,
        fontFamily:fontFamily,
        textDelete:true,
        textCopy:true,
        pluginType:'main'
    };

    var Plugin = function(ele,option){
        this.$element = ele;
        this.defaults=defaults;
        this.option= $.extend({},this.defaults,option);
    }
    Plugin.prototype.init=function(){
        var _this = this;
        var option = _this.option;
        var $element = $(_this.$element);
        var pluginBox = $('#'+pluginName);
        var move=false;
        /*适应yunye-template缩放*/
        var rate = $('body').width()/$('.container-fluid').find('.yunye-template').width();
        /*载入控件dom*/
        var ch = pluginBox.children().length;
        if(!ch){
            var cdiv = initHtml(option);
            pluginBox.append(cdiv);

            var canvas = document.getElementById("bot-cbox-canvas");
            var ctx=canvas.getContext("2d");
            var boxwidth=parseInt($('.bot-cbox').width());
            var boxheight=parseInt($('.bot-cbox').height());
            var grd=ctx.createLinearGradient(0,0,boxwidth,0);
                grd.addColorStop(0,"red");
                grd.addColorStop(0.15,"#f96");
                grd.addColorStop(0.35,"yellow");
                grd.addColorStop(0.50,"green");
                grd.addColorStop(0.70,"#ace");
                grd.addColorStop(0.85,"blue");
                grd.addColorStop(1,"blueviolet");
                ctx.fillStyle=grd;
                ctx.fillRect(0,0,boxwidth,boxheight);
        }else{
            var canvas = document.getElementById("bot-cbox-canvas");
            var ctx=canvas.getContext("2d");
        }

        if(option.textCopy){
            $('#ted-copy').css('display','block');
        }else{
            $('#ted-copy').css('display','none');
        }
        if(option.textDelete){
            $('#ted-delete').css('display','block');
        }else{
            $('#ted-delete').css('display','none');
        }
        if(option.pluginType == 'main'){
            $('#ted-fontsizebig').css('display','none');
            $('#ted-fontsizesml').css('display','none');
        }else if(option.pluginType == 'other'){
            $('#ted-fontsizebig').css('display','block');
            $('#ted-fontsizesml').css('display','block');
        }else{}

        /*------------控件操作事件-------------*/
        /*删除文本*/
        pluginBox.off('click','#ted-delete').on('click','#ted-delete',function(e){
            e.stopPropagation();
            var $prevElement = $element.siblings('.text-element');
            $element.remove();
            if($prevElement.length){
                var $ele = $prevElement.last();
                $ele.trigger('click');
            }else{
                $('#text-model').animate({'bottom':'-300px'},200);
                $('.ele-rotate-ctrl').css({left:'-200px',top:'-200px'});
            }
        });
        /*复制文本*/
        pluginBox.off('click','#ted-copy').on('click','#ted-copy',function(){
            var $newel =$element.clone();
            var top= parseInt($element.css('top'))+30;
            $element.parent().append($newel);
            $newel.css({'top':top+'px'});
            $newel.trigger('click');
        });
        /*文字内容编辑*/
        pluginBox.off('click','#ted-edit').on('click','#ted-edit',function(){
            $('.ted-text-content').fadeIn(200);
            if(option.pluginType == 'main'){
                var cont = $element.find('.el-content').html();
            }else if(option.pluginType == 'other'){
                var cont = $element.html();
            }else{}
            cont = cont.replace('<br>','\n');
            $('#tt-content').val(cont);
        });
        pluginBox.off('input propertychange','#tt-content').on('input propertychange','#tt-content',function(){
            var cont = $('#tt-content').val();
            cont = cont.replace('\n','<br>');
            if(option.pluginType == 'main'){
                $element.find('.el-content').html(cont);
            }else if(option.pluginType == 'other'){
                $element.html(cont);
            }else{}
            moveCtrlPos($element);
        });
        pluginBox.off('click','#tt-cont-confirm').on('click','#tt-cont-confirm',function(){
            $('.ted-text-content').fadeOut(200);
        });

        /*设置文字字体*/
        pluginBox.off('click','.ted-font-li').on('click','.ted-font-li',function(){
            var fontfm = $(this).attr('data-fm');
            $element.css('font-family',fontfm);
            $('.ted-font-li').css('color','#fff');
            $(this).css('color','#00e8d4');
        });
        /*设置文字颜色*/
        pluginBox.off('click','.color-li').on('click','.color-li',function(){
            var color = $(this).attr('data-color');
            $('.color-li').removeClass('color-act');
            $(this).addClass('color-act');
            $element.css('color',color);
        });
        pluginBox.off('click','#bot-cbox-canvas').on('click','#bot-cbox-canvas',function(e){
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;
            var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
            $('.color-li').removeClass('color-act');
            $element.css('color',color);
        });

        pluginBox.off('touchstart touchmove touchend','#bot-cbox-canvas').on('touchstart touchmove touchend','#bot-cbox-canvas',function(event){
            if(event.type == "touchstart" ){
                move=true;
                $('.color-li').removeClass('color-act');
            }else if(event.type == "touchmove" ){
                event.preventDefault();
                var e = event.originalEvent.targetTouches[0];
                if(move){
                    $('#bot-color-selected').show();
                    var canvasOffset = $(canvas).offset();
                    var canvasX = Math.floor(e.pageX - canvasOffset.left);
                    var canvasY = Math.floor(e.pageY - canvasOffset.top);
                    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                    var pixel = imageData.data;
                    var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
                    var s_left = canvasX-20;
                    var s_top = canvasY-45;
                    $('#bot-color-selected').css({'left':s_left+'px',top:s_top+'px','background':color});
                    $element.css('color',color);
                }
            }else{
                move=false;
                $('#bot-color-selected').hide();
            }
        });

        /*设置文字加粗*/
        pluginBox.off('click','#ted-fontweight').on('click','#ted-fontweight',function(){
            var weight = $element.css('font-weight');
            if(weight == 600){
                $element.css('font-weight',300);
            }else{
                $element.css('font-weight',600);
            }
            moveCtrlPos($element);
        });
        /*设置文字倾斜*/
        pluginBox.off('click','#ted-fontstyle').on('click','#ted-fontstyle',function(){
            var style = $element.css('font-style');
            if(style == 'normal'){
                $element.css('font-style','italic');
            }else{
                $element.css('font-style','normal');
            }
        });
        /*设置文字下划线*/
        pluginBox.off('click','#ted-underline').on('click','#ted-underline',function(){
            var style = $element.css('text-decoration');
            if(style == 'underline'){
                $element.css('text-decoration','none');
            }else{
                $element.css('text-decoration','underline');
            }
        });

        if(option.pluginType == 'other'){
            /*增大文字字号*/
            pluginBox.off('click','#ted-fontsizebig').on('click','#ted-fontsizebig',function(){
                var size = parseInt($element.css('font-size'));
                if(size<72){
                    size +=1;
                    $element.css('font-size',size+'px');
                }
            });
            /*增大文字字号*/
            pluginBox.off('click','#ted-fontsizesml').on('click','#ted-fontsizesml',function(){
                var size = parseInt($element.css('font-size'));
                if(size>12){
                    size -=1;
                    $element.css('font-size',size+'px');
                }
            });
        }

        /*设置文字左对齐*/
        pluginBox.off('click','#ted-leftalign').on('click','#ted-leftalign',function(){
            $element.css('text-align','left');
        });
        /*设置文字居中对齐*/
        pluginBox.off('click','#ted-centeralign').on('click','#ted-centeralign',function(){
            $element.css('text-align','center');
        });
        /*设置文字右对齐*/
        pluginBox.off('click','#ted-rightalign').on('click','#ted-rightalign',function(){
            $element.css('text-align','right');
        });
        /*设置文字等宽对齐*/
        pluginBox.off('click','#ted-justify').on('click','#ted-justify',function(){
            $element.css('text-align','justify');
        });

        var _x, x,barx,blwidth,bawidth,max,min = 0;
        blwidth=parseInt($('.slideline').outerWidth());
        bawidth=parseInt($('.sl-bar').outerWidth());
        max = blwidth-bawidth;
        /*阴影参数*/
        var ef={
            color:'#00e8d4',
            distance:'2',
            blur:'0'
        };
        pluginBox.off('touchstart touchmove touchend','.sl-bar').on('touchstart touchmove touchend','.sl-bar',function(event){
            if(event.type == "touchstart" ){
                var e = event.originalEvent.targetTouches[0];
                move=true;
                _x = e.pageX;//鼠标点击的位置
                barx=parseInt($(this).css('left'));
            }else if(event.type == "touchmove" ){
                event.preventDefault();
                var e = event.originalEvent.targetTouches[0];
                if(move){
                    x= e.pageX;//鼠标移动时的位置
                    var s = x-_x+barx;
                    var ths = $(this);
                    var item = ths.attr('data-item');
                    if(item == 'shadow'){
                        max = blwidth-bawidth/2;
                        min = bawidth/2;
                    }
                    s = (s>max)?max:s;
                    s = (s<min)?min:s;
                    var rate = Math.round(s*100/max);
                    ths.css('left',s+'px');

                    /*设置元素属性效果*/
                    if(item == 'wordspace'){
                        var size = Math.floor(20*rate/100);
                        if(option.pluginType == 'other'){
                            $element.css("letter-spacing", size+'px');
                        }else{
                            moveCtrlPos($element);
                            $element.children('.el-content').css("letter-spacing", size+'px');
                        }
                    }
                    if(item == 'lineheight'){
                        var lh= 1+rate/25;
                        if(option.pluginType == 'other'){
                            $element.css("line-height", lh+'em');
                        }else{
                            moveCtrlPos($element);
                            $element.children('.el-content').css("line-height", lh+'em');
                        }
                    }
                    if(item == 'opacity'){
                        rate = 100 - rate;
                        var op = rate/100;
                        $element.css("opacity",op);
                    }
                    /*滑块设置阴影*/
                    if(item == 'shadow'){
                        if(s>blwidth/2){
                            rate = Math.round(((s-max/2)*50)/(max/2));
                        }else{
                            rate = -Math.round(((max/2-s+min)*50)/(max/2));
                        }
                        ef.distance = 10*rate/50;
                        var efstyle = ef.color+' '+ef.distance+'px '+ef.distance+'px ';
                        if(ef.blur != '0'){efstyle += '5px';}
                        $element.css("text-shadow", efstyle)
                        var obtog = ths.parents('.ted-effects-top').siblings('.teb-effects-bot').children('.base-bot-name').children('.toggle');
                        openEff(obtog);
                    }
                    ths.parents('.base-bot-slide').siblings('.base-bot-value').html(rate);
                }
            }else{
                move=false;
            }
        });

//        pluginBox.off('click','.ef-color-li').on('click','.ef-color-li',function(e){
//            e.stopPropagation();
//            var color = $(this).attr('data-color');
//            ef.color = color;
//            setEff($element,ef);
//            var obtog = $(this).parents('.teb-effects-bot').children('.base-bot-name').children('.toggle');
//            openEff(obtog);
//        });
        /*阴影的关闭与打开*/
        pluginBox.off('click','.toggle').on('click','.toggle',function(){
            var ths = $(this);
            var tgo = ths.children('.tog-line');
            var open = ths.attr('data-tog');
            if(open == '0'){
                tgo.animate({left:'0px'},100);
                ths.attr('data-tog','1');
                if(ef.blur != '0'){ef.blur = '5px';}
                setEff($element,ef);
            }else{
                tgo.animate({left:'-30px'},100);
                ths.attr('data-tog','0');
                $element.css('text-shadow','');
            }
        });
        /*阴影的模糊与变硬*/
        pluginBox.off('click','.effects-style').on('click','.effects-style',function(){
            if($(this).hasClass('es-act')){
                ef.blur = '0';
                $(this).removeClass('es-act');
            }else{
                ef.blur = '5px';
                $(this).addClass('es-act');
            }
            setEff($element,ef);
            var obtog = $(this).siblings('.base-bot-name').children('.toggle');
            openEff(obtog);
        });
        /*阴影的颜色设置*/
        pluginBox.off('touchstart touchmove touchend','#effects-color-list').on('touchstart touchmove touchend','#effects-color-list',function(event){
            event.preventDefault();
            event.stopPropagation();
            var e = event.originalEvent.targetTouches[0];
            if(event.type == "touchstart" ){
                var targ=$(event.target);
                ef.color = targ.attr('data-color');
                var tbox= $('#teditor').offset();
                var tX = Math.floor(e.pageX-tbox.left)-20;
                var tY = Math.floor(e.pageY-tbox.top)-45;
                $('#eff-color-selected').show().css({'left':tX+'px',top:tY+'px','background':ef.color});
                setEff($element,ef);
                var obtog = $(this).parents('.teb-effects-bot').children('.base-bot-name').children('.toggle');
                openEff(obtog);
            }else if(event.type == "touchmove" ){
                move=true;
                if(move){
                    $('#eff-color-selected').show();
                    var tbox= $('#teditor').offset();
                    var tX = Math.floor(e.pageX-tbox.left)-20;
                    var tY = Math.floor(e.pageY-tbox.top)-45;
                    var uleft = $('#effects-color-list').offset().left;
                    var utop = $('#effects-color-list').offset().top;
                    var uwidth = $('#effects-color-list').parent().outerWidth();
                    if(utop+20>e.pageY && e.pageY>utop && uleft+uwidth>e.pageX && e.pageX>uleft ){
                        var distance = Math.floor(e.pageX-uleft);
                        var num = Math.floor(distance/5);
                        ef.color = $('#effects-color-list').children().eq(num).attr('data-color');
                        $('#eff-color-selected').show().css({'left':tX+'px',top:tY+'px','background':ef.color});
                        setEff($element,ef);
                    }else{
                        $('#eff-color-selected').hide();
                    }
                    var obtog = $(this).parents('.teb-effects-bot').children('.base-bot-name').children('.toggle');
                    openEff(obtog);
                }
            }else{
                move=false;
                $('#eff-color-selected').hide();
            }
        });
        function openEff(ths){
            var tgo = ths.children('.tog-line');
            var open = ths.attr('data-tog');
            if(open == '1'){return;}
            tgo.animate({left:'0px'},100);
            ths.attr('data-tog','1');
        }
        function setEff(ths,ef){
            var efstyle =ef.color+' '+ef.distance+'px '+ef.distance+'px ';
            if(ef.blur != '0'){
                efstyle += ef.blur;
            }
            ths.css('text-shadow',efstyle);
        }

        /*操作后样式控制*/
        pluginBox.off('click','.ted-menu-li').on('click','.ted-menu-li',function(){
            $('.ted-menu-li').removeClass('ted-menu-act');
            $(this).addClass('ted-menu-act');
            var item = $(this).attr('data-item');
            $('.ted-ctrl-li').fadeOut(200);
            $('#ted-ctrl-'+item).fadeIn(200);
        });

        function moveCtrlPos($ele){
            var $etrl = $('#ele-editor-ctrl');
            var $ctrl = $('#ele-rotate-ctrl');
            moveCtrlBtn($ele.children('.el-rotate'),$ele.parent(),$ctrl);
            moveCtrlBtn($ele.children('.el-editor'),$ele.parent(),$etrl);
        }
        function moveCtrlBtn($pos,$fbox,$ctrol){
            var pos = $pos.offset();
            var fbox = $fbox.offset();
            var sx = pos.left-fbox.left;
            var sy = pos.top-fbox.top;
            /*适应yunye-template缩放*/
            sx  =  modifyRate(sx,rate,0);
            sy  =  modifyRate(sy,rate,0);
            $ctrol.css({left:sx+'px',top:sy+'px'});
        }
        /*适应yunye-template缩放*/
        function modifyRate(num,rate,type){
            if(type){
                return num*rate;
            }else{
                return num/rate;
            }
        }

    };

    function initHtml(option){
        var cdiv = '';
        cdiv += '<div class="ted-ctrl"><div class="ted-ctrl-li ted-ctrl-base" id="ted-ctrl-base"><div class="ted-base-top">';
        cdiv += '<div class="base-top-group"><div class="base-top-font btn-group">';
        cdiv += '<button type="button" class="btn btn-default" id="ted-edit"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>';
        cdiv += '<button type="button" class="btn btn-default" id="ted-copy"><span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></button>';
        cdiv += '<button type="button" class="btn btn-default" id="ted-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
        cdiv += '</div><div class="base-top-align btn-group">';
        cdiv += '<button type="button" class="btn btn-default" id="ted-fontweight">B</button><button type="button" class="btn btn-default" id="ted-fontstyle">/</button>';
        cdiv += '<button type="button" class="btn btn-default" id="ted-underline">U</button></div></div>';
        cdiv += '<div class="base-top-group">';
        cdiv += '<div class="base-top-font btn-group"><button type="button" class="btn btn-default" id="ted-fontsizebig"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>';
        cdiv += '<button type="button" class="btn btn-default" id="ted-fontsizesml"><span class="glyphicon glyphicon-zoom-out" aria-hidden="true"></span></button></div>';
        cdiv += '<div class="base-top-align btn-group">';
        cdiv += '<button type="button" class="btn btn-default" id="ted-leftalign"><span class="glyphicon glyphicon-align-left" aria-hidden="true"></span></button>';
        cdiv += '<button type="button" class="btn btn-default" id="ted-centeralign"><span class="glyphicon glyphicon-align-center" aria-hidden="true"></span></button>';
        cdiv += '<button type="button" class="btn btn-default" id="ted-rightalign"><span class="glyphicon glyphicon-align-right" aria-hidden="true"></span></button>';
        cdiv += '<button type="button" class="btn btn-default" id="ted-justify"><span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span></button>';
        cdiv += '</div></div></div>';
        cdiv += '<div class="ted-base-bot"><div class="base-bot-name">字间宽</div><div class="base-bot-value">0</div><div class="base-bot-slide"><div class="slideline"><div class="sl-bar" data-item="wordspace"></div></div></div></div>';
        cdiv += '<div class="ted-base-bot"><div class="base-bot-name">行高</div><div class="base-bot-value">0</div><div class="base-bot-slide"><div class="slideline"><div class="sl-bar" data-item="lineheight"></div></div></div></div></div>';
        cdiv += '<div class="ted-ctrl-li ted-ctrl-color" id="ted-ctrl-color"><div class="ted-color-top"><ul class="color-list">';
        for(var i=0;i<option.colorArr.length;i++){
            cdiv += '<li class="color-li" style="background:'+option.colorArr[i]+';" data-color="'+option.colorArr[i]+'"></li>';
        }
        cdiv += '</ul></div><div class="ted-color-bot"><div class="bot-cbox"><div id="bot-color-selected" class="ted-color-selected"></div><canvas id="bot-cbox-canvas" width="800" height="200"></canvas></div></div></div>';
        cdiv += '<div class="ted-ctrl-li ted-ctrl-font" id="ted-ctrl-font"><div class="font-list"><ul>';
        for(var i=0;i<option.fontFamily.length;i++){
            cdiv += '<li class="ted-font-li" style="font-family:\''+option.fontFamily[i]+'\';" data-fm="'+option.fontFamily[i]+'">'+option.fontFamily[i]+'</li>';
        }
        cdiv += '</ul></div></div>';
        cdiv += '<div class="ted-ctrl-li ted-ctrl-effects" id="ted-ctrl-effects">';
        cdiv += '<div class="ted-effects-li ted-effects-opacity"><div class="base-bot-name">透明度</div><div class="base-bot-value">100</div><div class="base-bot-slide"><div class="slideline"><div class="sl-bar" data-item="opacity"></div></div></div></div>';
        cdiv += '<div class="ted-effects-li"><div class="ted-effects-top"><div class="base-bot-name">阴影</div> <div class="base-bot-value">0</div> <div class="base-bot-slide"> <div class="slideline"> <div class="sl-bar ted-eff-bar" data-item="shadow"></div> </div> </div> </div>';
        cdiv += '<div class="teb-effects-bot"> <div class="base-bot-name"> <div class="toggle" data-tog="0"> <div class="tog-line"> <div class="line-left"></div> <div class="tog-btn"></div> </div> </div> </div> <div class="base-bot-value effects-style">模糊</div> <div class="base-bot-slide"><div id="eff-color-selected" class="ted-color-selected"></div><div class="effects-color"><ul id="effects-color-list">';
        for(var i=0;i<option.colorArr.length;i++){
            cdiv += '<li class="ef-color-li" style="background:'+option.colorArr[i]+';" data-color="'+option.colorArr[i]+'"></li>';
        }
        cdiv += '</ul></div></div></div></div></div></div>';
        cdiv += '<div class="ted-menu"><ul><li class="ted-menu-li ted-menu-base ted-menu-act" data-item="base">基本</li><li class="ted-menu-li ted-menu-color" data-item="color">颜色</li><li class="ted-menu-li ted-menu-font " data-item="font">字体</li><li class="ted-menu-li ted-menu-effects" data-item="effects">特效</li></ul></div>';
        cdiv += '<div class="ted-text-content"><div class="tt-cont-back"></div><div class="tt-cont-main"><div class="tt-cont-confirm" id="tt-cont-confirm"><span class="glyphicon glyphicon-chevron-left"></span></div><textarea type="text" id="tt-content" placeholder="点击输入文字"></textarea></div></div>';
        return cdiv;
    }

    $.fn.tEditor = function(option){
        var tedit = new Plugin(this,option);
        tedit.init();
    }

})(jQuery,window,document,undefined);

