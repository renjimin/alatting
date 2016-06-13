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
        this.select = $.extend({},this.defOption,option);

    }

    ColorSl.prototype.init = function(){
        var box = $('#'+this.select.clbox);
        var ch = box.children().length;
        var ele = this.$element;
        var fun = this.func;
        var storage = window.localStorage;
        if(storage.getItem('colorSet')){
            var colorSet = storage.getItem('colorSet');
            var his= $('#js-color-his').children('.js-his-li');
            var num  = colorSet.length;
            for(var i=0;i<num;i++){
                his.eq(i+1).css('background',colorSet[i]).data('data-color',colorSet[i]);
            }
        }else{
            var colorSet = [];
        }
        if(!ch){
            var cdiv= '<div class="js-colorselect"><div class="js-color-title">颜色面板<span class="glyphicon glyphicon-remove" id="csclose"></span></div>';
            cdiv+= '<div class="js-color-his" id="js-color-his"><div class="js-his-li" id="js-color-reset">复位</div><div class="js-his-li"></div><div class="js-his-li"></div><div class="js-his-li"></div></div>';
            cdiv+= '<div class="js-color-main"><div class="js-color-box"><ul class="color-list">';
            for(var i=0;i<this.select.colorArr.length;i++){
                cdiv += '<li class="color-li" style="background:'+this.select.colorArr[i]+'" data-color="'+this.select.colorArr[i]+'"></li>';
            }
            cdiv += '</ul></div>';
            cdiv += '<div class="js-color-canvas"><div id="js-color-tips"></div><div id="js-color-selected"></div><canvas id="js-color-canvas" width="800" height="200"></canvas></div></div>';
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
            vGrad.addColorStop(0, 'rgba(255,255,255,0)');
            vGrad.addColorStop(1, 'rgba(255,255,255,1)');
            ctx.fillStyle = vGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }else{
            var canvas = document.getElementById("js-color-canvas");
            var ctx=canvas.getContext("2d");
            box.fadeIn(200);
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
        box.off('click').on('click','.color-li',function(){
            var color = $(this).attr('data-color');
            $('.color-li').removeClass('color-act');
            $(this).addClass('color-act');
            putColorStor(colorSet,color);
            fun(ele,color);
        });
        /*色块的关闭*/
        $('#csclose').off('click').on('click', function () {
            box.fadeOut(200);
        });
        function putColorStor(colorset,color){
            var num = colorset.length;
            if(num==3){
                colorset.shift();
            }
            colorset.push(color);
            storage.setItem('colorSet',colorset);
            var his= $('#js-color-his').children('.js-his-li');
            for(var i=0;i<num;i++){
                his.eq(i+1).css('background',colorset[i]).data('data-color',colorset[i]);
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





