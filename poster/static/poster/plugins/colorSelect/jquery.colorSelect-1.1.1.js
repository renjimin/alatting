/**
*Created by zhangjie on 2016/5/9.
*/

;(function($,window,document,undefined){
    var ColorSl = function(ele,option,func){
        var defColorArr = [
            '#f8aba6','#f58f98','#f391a9','#f05b72','#d93a49','#b3424a','#a7324a','#840228','#6b2c25','#54211d',
            '#8e3e1f','#b4532a','#de773f','#f47920','#faa755','#fab27b','#dea32c','#ffc20e','#fdb933','#ffe600',
            '#f0dc70','#fcf16e','#b2d235','#a3cf62','#7fb80e','#78a355','#769149','#817936','#87843b','#454926',
            '#2e3a1f','#122e29','#274d3d','#225a1f','#007947','#508a88','#70a19f','#008792','#78cdd1','#afdfe4',
            '#90d7ec','#7bbfea','#009ad6','#228fbd','#2570a1','#2468a2','#145b7d','#2a5caa','#224b8f','#2b4490',
            '#1b315e','#11264f','#45224a','#543044','#63434f','#594c6d','#6950a1','#6f60aa','#9b95c9','#afb4db',
            '#fffffb','#f6f5ec','#f2eada','#d3d7d4','#a1a3a6','#999d9c','#72777b','#4f5555','#3e4145','#281f1d',
            '#130c0e'];
        this.$element = ele;
        this.defOption = {
            colorArr:defColorArr,
            clbox:'cbox',
        }
        this.func = func;
        this.domColor = (ele.attr('data-color'))?ele.attr('data-color'):'';
        this.select = $.extend({},this.defOption,option);
    }

    ColorSl.prototype.init = function(){
        var box = $('#'+this.select.clbox);
        var ch = box.children().length;
        var ele = this.$element;
        var fun = this.func;
        var storage = window.localStorage;
        var domColor = this.domColor;
        var hex;

        if(!ch){
            var cdiv= '<div class="js-colorselect"><div class="js-color-title">颜色面板<span class="glyphicon glyphicon-remove" id="csclose"></span></div>';
            cdiv+= '<div class="js-color-his" id="js-color-his"><div class="js-color-set" id="js-color-reset">复位</div><div class="js-color-set" id="js-color-setval">颜色值</div><div class="js-his-li"></div><div class="js-his-li"></div><div class="js-his-li"></div></div>';
            cdiv+= '<div class="js-color-main"><div class="js-color-box"><ul class="color-list">';
            for(var i=0;i<this.select.colorArr.length;i++){
                cdiv += '<li class="color-li" style="background:'+this.select.colorArr[i]+'" data-color="'+this.select.colorArr[i]+'"></li>';
            }
            cdiv += '</ul></div>';
            cdiv += '<div class="js-color-canvas"><div id="js-color-tips"></div><div id="js-color-selected"></div><canvas id="js-color-canvas" width="800" height="200"></canvas></div></div>';
            cdiv += '<div class="js-color-cvbox"><div class="cvbox-li cvbox-li-rgb"><div class="cvbox-li-li">R:<input type="text" id="cv-r"></div><div class="cvbox-li-li">G:<input type="text" id="cv-g"></div><div class="cvbox-li-li">B:<input type="text" id="cv-b"></div></div><div class="cvbox-li cvbox-li-hex"><div class="cvbox-li-li">#:<input type="text" id="cv-hex"></div><div class="cvbox-li-li"></div><div class="cvbox-li-li">&nbsp;&nbsp;&nbsp;<input type="button" id="cv-set" value="关闭"></div></div></div>';
            box.append(cdiv);

            var canvas = document.getElementById("js-color-canvas");
            var ctx=canvas.getContext("2d");
            canvas.width=parseInt($('.js-color-canvas').width());
            canvas.height=parseInt($('.js-color-canvas').height());
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
        }else{
            var canvas = document.getElementById("js-color-canvas");
            var ctx=canvas.getContext("2d");
            box.fadeIn(200);
        }
        if(storage.getItem('colorSet')){
            var colorSet = storage.getItem('colorSet');
            colorSet = colorSet.split(';');
            var his= $('#js-color-his').children('.js-his-li');
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
            var his= $('#js-color-his').children('.js-his-li');
            for(var i=0;i<num;i++){
                his.eq(i).css('background',colorset[i]).attr('data-color',colorset[i]);
            }
            colorset = colorset.join(';');
            storage.setItem('colorSet',colorset);
        }

        $("#js-color-canvas").off('click').on('click',function(e){
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;
            var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
            $('.color-li').removeClass('color-act');
            var colorOffset = $('.js-colorselect').offset();
            var tipsX = Math.floor(e.pageX - colorOffset.left);
            var tipsY = Math.floor(e.pageY - colorOffset.top);
            $('#js-color-tips').css({left:tipsX+'px','top':tipsY+'px'});
            ele.attr('data-color',color);
            putColorStor(colorSet,color);
            fun(ele,color);
        });

        var move=false,_x,_y,color;
        $('#js-color-canvas').off('touchstart touchmove touchend').on({
            touchstart:function(){
                $('.color-li').removeClass('color-act');
            },
            touchmove:function(event){
                event.preventDefault();
                move=true;
                var e = event.originalEvent.targetTouches[0];
                if(move){
                    $('#js-color-selected').show();
                    $('#js-color-tips').hide();
                    _x = e.pageX;
                    _y = e.pageY;
                    var canvasOffset = $(canvas).offset();
                    var canvasX = Math.floor(_x - canvasOffset.left);
                    var canvasY = Math.floor(_y - canvasOffset.top);
                    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                    var pixel = imageData.data;
                    color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
                    var sleft = canvasX-5;
                    var stop = canvasY+40;
                    $('#js-color-selected').css({'left':sleft+'px',top:stop+'px','background':color});
                    fun(ele,color);
                }
            },
            touchend:function(){
                if(move){
                    ele.attr('data-color',color);
                    putColorStor(colorSet,color);
                }
                move=false;
                var colorOffset = $('.js-colorselect').offset();
                var tipsX = Math.floor(_x - colorOffset.left);
                var tipsY = Math.floor(_y - colorOffset.top);
                $('#js-color-tips').css({left:tipsX+'px','top':tipsY+'px'});
                $('#js-color-tips').show();
                $('#js-color-selected').hide();
            }
        });

        /*色块的选择*/
        box.off('click','.color-li').on('click','.color-li',function(){
            var color = $(this).attr('data-color');
            $('.color-li').removeClass('color-act');
            $(this).addClass('color-act');
            ele.attr('data-color',color);
            putColorStor(colorSet,color);
            fun(ele,color);
        });
        /*历史色块的选择*/
        box.off('click','.js-his-li').on('click','.js-his-li',function(){
            var color = $(this).attr('data-color');
            ele.attr('data-color',color);
            fun(ele,color);
        });
        /* 复位颜色 */
        $('#js-color-reset').off('click').on('click',function(){
            ele.attr('data-color',domColor);
            fun(ele,domColor);
        });
        /*色块的关闭*/
        $('#csclose').off('click').on('click', function () {
            box.fadeOut(200);
        });

        /*设置颜色值*/
        $('#js-color-setval').off('click').on('click', function () {
            $('.js-color-cvbox').fadeIn(200);
        });
        $('.cvbox-li-rgb input').off('input propertychange').on('input propertychange',function(){
            var rgb = {
                r:(parseInt($('#cv-r').val()))?parseInt($('#cv-r').val()):0,
                g:(parseInt($('#cv-g').val()))?parseInt($('#cv-g').val()):0,
                b:(parseInt($('#cv-b').val()))?parseInt($('#cv-b').val()):0
            };
            if(rgb.r>=0 && rgb.r<=255 && rgb.g>=0 && rgb.g<=255 && rgb.b>=0 && rgb.b<=255){
                var rColor = rgbToHex(rgb);
                $('#cv-hex').val(rColor);
                hex = '#'+rColor;
                fun(ele,hex);
            }
        });
        $('#cv-hex').off('input propertychange').on('input propertychange',function(){
            var hColor = $(this).val();
            hColor = hColor.toLowerCase();
            var reg = /^([0-9a-fA-f]{6})$/;
            if(hColor && reg.test(hColor)){
                hex = '#'+hColor;
                var rgb = hexToRgb(hColor);
                $('#cv-r').val(rgb.r);
                $('#cv-g').val(rgb.g);
                $('#cv-b').val(rgb.b);
                fun(ele,hex);
            }
        });
        $('#cv-set').off('click').on('click',function(){
            if(hex){
                putColorStor(colorSet,hex);
                hex = '';
            }
            $('.js-color-cvbox').fadeOut(200);
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


    }

    $.fn.colorSelect= function(option,func){
        var colorBox = new ColorSl(this,option,func);
        colorBox.init();
    }
})(jQuery,window,document);

/*
*** 插件的使用
* ths 当前需要修改的颜色的对象 nami-li
* {} 中可以做设置
*   colorArr 自定义色值数组
*   clbox    自定义颜色面板的存放的位置div.id值
    $('.name-li').on('click', function () {
        $(this).colorSelect({},function(ths,color){
            ths.css('color',color);
        });
    });
*/





