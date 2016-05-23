/**
 * defOption 默认配置
 * ----ebox:控制块需要载入的容器对象(jquery对象)，保持其与其要控制的元素处于同一父级元素下
 *
 * Created by zhangjie on 2016/5/19.
 */
;(function($,window,document,undefined){
    var Plugin = function(ele,option){
        this.$element = ele;
        this.defOption = {
            ebox:''
        }
        this.option = $.extend({},this.defOption,option);
    }

    Plugin.prototype.init = function(){
        var _this = this;
        var $element = $(_this.$element);
        var box = _this.option.ebox;
        var boxpx= box.offset();
        var ch = box.find('#ele-rotate-ctrl').length;
        if(!ch){
            var cdiv = '<div id="ele-rotate-ctrl" class="ele-rotate-ctrl"><span class="glyphicon glyphicon-refresh"></span></div>';
            cdiv += '<div id="ele-editor-ctrl" class="ele-rotate-ctrl"><span class="glyphicon glyphicon-pencil"></span></div>';
            box.append($(cdiv));
        }
        var $etrl = $('#ele-editor-ctrl');
        var $ctrl = $('#ele-rotate-ctrl');
//        $ctrl.css({width:'20px',height:'20px',background:'#03ad52',color:'#ffffff',position:'absolute',top:'-20px',left:'-20px','z-index':400,'margin-left':'-10px','margin-top':'-10px','border-radius':'3px','text-align':'center'});

        var bx, by, _bx, _by, barx, bary,move=false;
        var midp={},botp={},rbotp={},movp={},deg,rotate={},ddl;
        var eed = $element.children('.el-editor');
        var editorp = eed.offset();
        barx = parseInt($element.css('left'));
        bary = parseInt($element.css('top'));
        if($.isEmptyObject($element.data('botp'))){
            var eleft = parseInt($element.css('left'));
            var etop = parseInt($element.css('top'));
            var ewidth = parseInt($element.outerWidth());
            var eheight = parseInt($element.outerHeight());
            midp.left = eleft+ewidth/2;
            midp.top = etop+eheight/2;
            botp.left = eleft+ewidth;
            botp.top = etop+eheight;
            rbotp.left = eleft+ewidth;
            rbotp.top = etop+eheight;
            var dlength = getTwoPointDistance(midp,botp);
            $element.data('botp',botp);
            $element.data('rbotp',rbotp);
            $element.data('midp',midp);
            $element.data('dlength',dlength);
        }else{
            botp = $element.data('botp');
            midp = $element.data('midp');
            rbotp = $element.data('rbotp');
        }
        $ctrl.css({left:rbotp.left+'px',top:rbotp.top+'px'});
        $etrl.css({left:keepTwoValid(editorp.left-boxpx.left)+'px',top:keepTwoValid(editorp.top-boxpx.top)+'px'});

        /*element 移动*/
        box.off('touchstart touchmove touchend','.el-content').on('touchstart touchmove touchend','.el-content',function(event){
            event.stopPropagation();
            var e = event.originalEvent.targetTouches[0];
            if (event.type == "touchstart"){
                barx = parseInt($element.css('left'));
                bary = parseInt($element.css('top'));
                _bx = e.pageX;
                _by = e.pageY;
                var ewidth = parseInt($element.outerWidth());
                var eheight = parseInt($element.outerHeight());
                if($.isEmptyObject($element.data('botp'))){
                    var eleft = parseInt($element.css('left'));
                    var etop = parseInt($element.css('top'));
                    midp.left = eleft+ewidth/2;
                    midp.top = etop+eheight/2;
                    botp.left = eleft+ewidth;
                    botp.top = etop+eheight;
                    rbotp.left = eleft+ewidth;
                    rbotp.top = etop+eheight;
                    var dlength = getTwoPointDistance(midp,botp);
                    $element.data('botp',botp);
                    $element.data('rbotp',rbotp);
                    $element.data('midp',midp);
                    $element.data('dlength',dlength);
                }else{
                    botp = $element.data('botp');
                    rbotp = $element.data('rbotp');
                    midp = $element.data('midp');
                }
            }else if(event.type == "touchmove"){
                move = true;
                event.preventDefault();
                if (move){
                    bx = e.pageX;
                    by = e.pageY;
                    var sx = bx - _bx + barx;
                    var sy = by - _by + bary;
                    $element.css({'left': sx + 'px', top: sy + 'px'});
                    sx = bx - _bx + rbotp.left;
                    sy = by - _by + rbotp.top;
                    $ctrl.css({left:sx+'px',top:sy+'px'});
                    editorp = eed.offset();
                    $etrl.css({left:keepTwoValid(editorp.left-boxpx.left)+'px',top:keepTwoValid(editorp.top-boxpx.top)+'px'});
                }
            }else{
                if(move){
                    midp.left += bx - _bx;
                    midp.top  += by - _by;
                    botp.left += bx - _bx;
                    botp.top  += by - _by;
                    rbotp.left += bx - _bx;
                    rbotp.top  += by - _by;
                    $element.data('botp',botp);
                    $element.data('rbotp',rbotp);
                    $element.data('midp',midp);
                }
                move = false;
            }
        });

        /*element 旋转缩放*/
        box.off('touchstart touchmove touchend','#ele-rotate-ctrl').on('touchstart touchmove touchend','#ele-rotate-ctrl', function(event){
            var e = event.originalEvent.targetTouches[0];
            event.stopPropagation();
            if (event.type == "touchstart"){
                botp= $element.data('botp');
                midp= $element.data('midp');
                rbotp= $element.data('rbotp');
                ddl = $element.data('dlength');
                _bx = e.pageX;
                _by = e.pageY;
            } else if (event.type == "touchmove") {
                event.preventDefault();
                move = true;
                if (move){
                    bx = e.pageX;
                    by = e.pageY;
                    movp.left = rbotp.left + bx - _bx;
                    movp.top = rbotp.top + by - _by;
                    var bvl = getTwoPointDistance(botp,movp);
                    var mbl = getTwoPointDistance(midp,botp);
                    var mvl = getTwoPointDistance(midp,movp);
                    var ndeg = getTwoLineDeg(mbl,mvl,bvl);
                    var nrate = mvl/ddl;
                    if(getRotateDirect(midp,botp,movp)>0){
                        ndeg = -180*ndeg/Math.PI;
                    }else{
                        ndeg = 180*ndeg/Math.PI;
                    }
                    ndeg = keepTwoValid(ndeg);
                    nrate = keepTwoValid(nrate);
                    var tranf = 'rotate('+ndeg+'deg) scale('+nrate+')';
                    $element.css({'transform':tranf});
                    $ctrl.css({left:movp.left+'px',top:movp.top+'px'});
                    editorp = eed.offset();
                    $etrl.css({left:keepTwoValid(editorp.left-boxpx.left)+'px',top:keepTwoValid(editorp.top-boxpx.top)+'px'});
                }
            }else{
                if(move){
                    rbotp.left = rbotp.left + bx - _bx;
                    rbotp.top = rbotp.top + by - _by;
                    $element.data('rbotp',rbotp);
                }
                move = false;
            }

        });

        function getTwoLineDeg(lone,ltwo,lthr){
            return (Math.acos((Math.pow(lone,2)+Math.pow(ltwo,2)-Math.pow(lthr,2))/(2*lone*ltwo))).toFixed(6);
        }
        function getTwoPointDistance(pone,ptwo){
            var x =  ptwo.left-pone.left;
            var y =  ptwo.top-pone.top;
            return Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5);
        }
        function getRotateDirect(a,b,c){
            return (c.left- a.left)*(b.top- a.top)-(b.left-a.left)*(c.top- a.top)
        }
        function keepTwoValid(num){
            num=parseFloat(num);
            return num.toFixed(2);
        }


    }

    $.fn.domRotate= function(option){
        var domrotate = new Plugin(this,option);
        domrotate.init();
    }
})(jQuery,window,document);
