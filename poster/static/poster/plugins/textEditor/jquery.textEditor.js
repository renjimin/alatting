

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
    Plugin.prototype.open = function(){
        $('#text-model').animate({'bottom':'0px'},200);
    }
    Plugin.prototype.init=function(){
        var _this = this;
        var option = _this.option;
        var $element = $(_this.$element);
        var pluginBox = $('#'+pluginName);
        var move=false,color;
        var storage = window.localStorage;
        var domColor = ($element.attr('data-color'))?$element.attr('data-color'):'';
        /*适应yunye-template缩放*/
        var rate = $('body').width()/$('.container-fluid').find('.yunye-template').width();
        /*载入控件dom*/
        var ch = pluginBox.children().length;
        if(!ch){
            var cdiv = initHtml(option);
            pluginBox.append(cdiv);

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
            vGrad.addColorStop(0, 'rgba(255,255,255,0)');
            vGrad.addColorStop(1, 'rgba(255,255,255,1)');
            ctx.fillStyle = vGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }else{
            var canvas = document.getElementById("bot-cbox-canvas");
            var ctx=canvas.getContext("2d");
        }
        if(storage.getItem('colorSet')){
            var colorSet = storage.getItem('colorSet');
            colorSet = colorSet.split(';');
            var his= $('#ted-color-his').children('.ted-his-li');
            var num  = colorSet.length;
            for(var i=0;i<num;i++){
                his.eq(i).css('background',colorSet[i]).attr('data-color',colorSet[i]);
            }
        }else{
            var colorSet = [];
        }
        var putColorStor = function(colorset,color){
            var num = colorset.length;
            if(num==3){
                colorset.shift();
            }
            colorset.push(color);
            var his= $('#ted-color-his').children('.ted-his-li');
            for(var i=0;i<num;i++){
                his.eq(i).css('background',colorset[i]).attr('data-color',colorset[i]);
            }
            colorset = colorset.join(';');
            storage.setItem('colorSet',colorset);
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
        /*隐藏文字编辑输入框*/
        $('.ted-text-content').fadeOut(200);

        /*------------控件操作事件-------------*/
        /*删除文本*/
        pluginBox.off('click','#ted-delete').on('click','#ted-delete',function(e){
            e.stopPropagation();
            var $prevElement = $element.siblings('.text-element');
            $element.remove();
            if($prevElement.length){
                var $ele = $prevElement.last();
                $ele.children('.el-content').trigger('click');
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
            $newel.children('.el-content').trigger('click');
        });
        /*文字内容编辑*/
        pluginBox.off('click','#ted-edit').on('click','#ted-edit',function(){
            $('.ted-text-content').fadeIn(200);
            if(option.pluginType == 'main'){
                var cont = $element.children('.el-content').html();
            }else if(option.pluginType == 'other'){
                var cont = $element.html();
            }else{}
            cont = cont.replace(/<br>/g,'\n');
            $('#tt-content').val(cont);
        });
        pluginBox.off('input propertychange','#tt-content').on('input propertychange','#tt-content',function(){
            var cont = $('#tt-content').val();
            cont = cont.replace(/<\/?.+?>/g,"");
            cont = cont.replace(/&nbsp;/g,"");
            cont = cont.replace(/\n/g,'<br>');
            if(option.pluginType == 'main'){
                $element.children('.el-content').html(cont);
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
            $element.attr('data-color',color).css('color',color);
            putColorStor(colorSet,color);
        });
        pluginBox.off('click','#bot-cbox-canvas').on('click','#bot-cbox-canvas',function(e){
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;
            var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
            $('.color-li').removeClass('color-act');
            $('#ted-color-tips').css({left:canvasX+'px','top':canvasY+'px'});
            $element.attr('data-color',color).css('color',color);
            putColorStor(colorSet,color);
        });
        var _x,_y;
        pluginBox.off('touchstart touchmove touchend','#bot-cbox-canvas').on('touchstart touchmove touchend','#bot-cbox-canvas',function(event){
            if(event.type == "touchstart" ){
                $('.color-li').removeClass('color-act');
            }else if(event.type == "touchmove" ){
                event.preventDefault();
                var e = event.originalEvent.targetTouches[0];
                move=true;
                if(move){
                    $('#bot-color-selected').show();
                    $('#ted-color-tips').hide();
                    var canvasOffset = $(canvas).offset();
                    var canvasX = Math.floor(e.pageX - canvasOffset.left);
                    var canvasY = Math.floor(e.pageY - canvasOffset.top);
                    _x = canvasX;
                    _y = canvasY;
                    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                    var pixel = imageData.data;
                    color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
                    var s_left = canvasX-20;
                    var s_top = canvasY-45;
                    $('#bot-color-selected').css({'left':s_left+'px',top:s_top+'px','background':color});
                    $element.css('color',color);
                }
            }else{
                if(move){
                    $element.attr('data-color',color);
                    putColorStor(colorSet,color);
                }
                move=false;
                $('#ted-color-tips').css({left:_x+'px','top':_y+'px'}).show();
                $('#bot-color-selected').hide();
            }
        });
        /*历史色块的选择*/
        pluginBox.off('click','.ted-his-li').on('click','.ted-his-li',function(){
            var color = $(this).attr('data-color');
            $element.attr('data-color',color).css('color',color);
        });
        /* 复位颜色 */
        $('#ted-color-reset').off('click').on('click',function(){
            $element.attr('data-color',domColor).css('color',domColor);
        });
        /*---设置颜色值---*/
        $('#ted-color-setval').off('click').on('click', function () {
            $('.ted-color-cvbox').fadeIn(200);
        });
        $('.cvbox-li-rgb input').off('input propertychange').on('input propertychange',function(){
            var rgb = {
                r:(parseInt($('#ted-cv-r').val()))?parseInt($('#ted-cv-r').val()):0,
                g:(parseInt($('#ted-cv-g').val()))?parseInt($('#ted-cv-g').val()):0,
                b:(parseInt($('#ted-cv-b').val()))?parseInt($('#ted-cv-b').val()):0
            };
            if(rgb.r>=0 && rgb.r<=255 && rgb.g>=0 && rgb.g<=255 && rgb.b>=0 && rgb.b<=255){
                var rColor = rgbToHex(rgb);
                $('#ted-cv-hex').val(rColor);
                color = '#'+rColor;
                $element.attr('data-color',color).css('color',color);
            }
        });
        $('#ted-cv-hex').off('input propertychange').on('input propertychange',function(){
            var hColor = $(this).val();
            hColor = hColor.toLowerCase();
            var reg = /^([0-9a-fA-f]{6})$/;
            if(hColor && reg.test(hColor)){
                color = '#'+hColor;
                var rgb = hexToRgb(hColor);
                $('#ted-cv-r').val(rgb.r);
                $('#ted-cv-g').val(rgb.g);
                $('#ted-cv-b').val(rgb.b);
                $element.attr('data-color',color).css('color',color);
            }
        });
        $('#ted-cv-set').off('click').on('click',function(){
            if(color){
                putColorStor(colorSet,color);
                color = '';
            }
            $('.ted-color-cvbox').fadeOut(200);
        });

        /* RGB格式转为16进制颜色 */
        function rgbToHex(rgb) {
			var hex = [rgb.r.toString(16),rgb.g.toString(16),rgb.b.toString(16)];
			$.each(hex, function(nr, val) {
				if (val.length === 1) hex[nr] = '0' + val;
			});
			return hex.join('');
		}
        /* 16进制颜色转为RGB格式 */
        function hexToRgb(str) {
            /* 16进制颜色值的正则表达式 */
            var reg = /^([0-9a-fA-f]{6})$/;
            var sColor = str.toLowerCase();
            if (sColor && reg.test(sColor)) {
                /* 处理六位的颜色值 */
                var sColorChange = [];
                for (var i = 0; i < 6; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return { 'r': sColorChange[0], 'g': sColorChange[1], 'b': sColorChange[2] };
            } else {
                return sColor;
            }
        }


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
        cdiv += '<div class="ted-ctrl-li ted-ctrl-color" id="ted-ctrl-color"><div class="ted-color-his" id="ted-color-his"><div class="ted-color-set" id="ted-color-reset">复位</div><div class="ted-color-set" id="ted-color-setval">颜色值</div><div class="ted-his-li"></div><div class="ted-his-li"></div><div class="ted-his-li"></div></div><div class="ted-color-main"><div class="ted-color-top"><ul class="color-list">';
        for(var i=0;i<option.colorArr.length;i++){
            cdiv += '<li class="color-li" style="background:'+option.colorArr[i]+';" data-color="'+option.colorArr[i]+'"></li>';
        }
        cdiv += '</ul></div><div class="ted-color-bot"><div class="bot-cbox"><div id="ted-color-tips"></div><div id="bot-color-selected" class="ted-color-selected"></div><canvas id="bot-cbox-canvas" width="800" height="200"></canvas></div></div></div></div>';
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
        cdiv += '<div class="ted-color-cvbox"><div class="ted-cvbox-li cvbox-li-rgb"><div class="ted-cvbox-lili">R:<input type="text" id="ted-cv-r"></div><div class="ted-cvbox-lili">G:<input type="text" id="ted-cv-g"></div><div class="ted-cvbox-lili">B:<input type="text" id="ted-cv-b"></div></div><div class="cvbox-li cvbox-li-hex"><div class="ted-cvbox-lili">#:<input type="text" id="ted-cv-hex"></div><div class="ted-cvbox-lili"></div><div class="ted-cvbox-lili">&nbsp;&nbsp;&nbsp;<input type="button" id="ted-cv-set" value="关闭"></div></div></div>';

        return cdiv;
    }

    $.fn.tEditor = function(option){
        var tedit = new Plugin(this,option);
        tedit.init();
    }

})(jQuery,window,document,undefined);

