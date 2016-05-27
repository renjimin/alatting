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
        var ch = box.find('.ele-rotate-ctrl').length;
        if(!ch){
            var cdiv = '<div id="ele-rotate-ctrl" class="ele-rotate-ctrl"><span class="glyphicon glyphicon-refresh"></span></div>';
            cdiv += '<div id="ele-editor-ctrl" class="ele-rotate-ctrl"><span class="glyphicon glyphicon-pencil"></span></div>';
            box.append($(cdiv));
        }
        var $etrl = $('#ele-editor-ctrl');
        var $ctrl = $('#ele-rotate-ctrl');
        var rate = $('body').width()/box.width();/*适应yunye-template缩放*/
        moveCtrlBtn($element.children('.el-rotate'),$element.parent(),$ctrl);
        moveCtrlBtn($element.children('.el-editor'),$element.parent(),$etrl);

//        $ctrl.css({width:'20px',height:'20px',background:'#03ad52',color:'#ffffff',position:'absolute',top:'-20px',left:'-20px','z-index':400,'margin-left':'-10px','margin-top':'-10px','border-radius':'3px','text-align':'center'});

        var bx, by, _bx, _by, eleft, etop,move=false;
        var midp={},botp={},rbotp={},movp={},dlength;
        /*element 移动*/
        box.off('touchstart touchmove touchend','.el-content').on('touchstart touchmove touchend','.el-content',function(event){
            event.stopPropagation();
            var e = event.originalEvent.targetTouches[0];
            if (event.type == "touchstart"){
                _bx = e.pageX;
                _by = e.pageY;
                eleft = parseInt($element.css('left'));
                etop = parseInt($element.css('top'));
            } else if (event.type == "touchmove") {
                event.preventDefault();
                move = true;
                if (move){
                    bx = e.pageX;
                    by = e.pageY;
                    /*
                    var sx = bx - _bx + eleft;
                    var sy = by - _by + etop;
                    */
                    /*适应yunye-template缩放*/
                    var sx  =  modifyRate(bx-_bx,rate,0)+eleft;
                    var sy  =  modifyRate(by-_by,rate,0)+etop;
                    $element.css({'left': sx + 'px', top: sy + 'px'});
                    moveCtrlBtn($element.children('.el-rotate'),$element.parent(),$ctrl);
                    moveCtrlBtn($element.children('.el-editor'),$element.parent(),$etrl);
                }
            }else{
                if(!move){
                    moveCtrlBtn($element.children('.el-rotate'),$element.parent(),$ctrl);
                    moveCtrlBtn($element.children('.el-editor'),$element.parent(),$etrl);
                }
                move = false;
            }
        });

        /*element 旋转缩放*/
        box.off('touchstart touchmove touchend','#ele-rotate-ctrl').on('touchstart touchmove touchend','#ele-rotate-ctrl', function(event){
            var e = event.originalEvent.targetTouches[0];
                event.stopPropagation();
                event.preventDefault();
                if (event.type == "touchstart"){
                    _bx = e.pageX;
                    _by = e.pageY;
                    /*右下角现在的位置*/
                    var pos = $element.children('.el-rotate').offset();
                    var fbox = $element.parent().offset();
                    rbotp.left = pos.left-fbox.left;
                    rbotp.top = pos.top-fbox.top;
                    /*中点，原右下角的位置*/
                    eleft = parseInt($element.css('left'));
                    etop = parseInt($element.css('top'));
                    var ewidth = parseInt($element.outerWidth());
                    var eheight = parseInt($element.outerHeight());
                    midp.left = eleft+ewidth/2;
                    midp.top = etop+eheight/2;
                    botp.left = eleft+ewidth;
                    botp.top = etop+eheight;
                    dlength = getTwoPointDistance(midp,botp);
                } else if (event.type == "touchmove") {
                    move = true;
                    if (move){
                        bx = e.pageX;
                        by = e.pageY;
                        movp.left = rbotp.left + bx - _bx;
                        movp.top = rbotp.top + by - _by;

                        /*适应yunye-template缩放*/
                        movp.left  =  modifyRate(movp.left,rate,0);
                        movp.top  =  modifyRate(movp.top,rate,0);

                        var bvl = getTwoPointDistance(botp,movp);
                        var mbl = getTwoPointDistance(midp,botp);
                        var mvl = getTwoPointDistance(midp,movp);
                        var ndeg = getTwoLineDeg(mbl,mvl,bvl);
                        var nrate = mvl/dlength;
                        if(getRotateDirect(midp,botp,movp)>0){
                            ndeg = -180*ndeg/Math.PI;
                        }else{
                            ndeg = 180*ndeg/Math.PI;
                        }
                        ndeg = keepTwoValid(ndeg);
                        nrate = keepTwoValid(nrate);
                        var tranf = 'rotate('+ndeg+'deg) scale('+nrate+')';
                        $element.css({"transform":tranf});
                        $element.attr('data-rotate',ndeg);
                        $element.attr('data-scale',nrate);
                        moveCtrlBtn($element.children('.el-rotate'),$element.parent(),$ctrl);
                        moveCtrlBtn($element.children('.el-editor'),$element.parent(),$etrl);
                    }
                } else {
                    move = false;
                }

        });

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
        /*
        function setDomTranStyle(ele,value){
            var csobj={};
            var csss = ele.attr('style');
            csss = csss.substr(0,csss.length-1);
            csss = csss.split(';');
            for(var i=0;i<csss.length;i++){
                var sa= csss[i].split(':');
                csobj[sa[0]]=sa[1];
            }
            csobj['transform']=value;
            csobj['-webkit-transform']=value;
            csobj['-moz-transform']=value;
            csobj['-ms-transform']=value;
            csobj['-o-transform']=value;
            csss = JSON.stringify(csobj);
            csss = csss.replace(/,/g,';');
            csss = csss.substr(1,csss.length-2);
            csss = csss.replace(/"/g,'');
            csss += ';';
            ele.attr('style',csss);
        }*/

        /*适应yunye-template缩放*/
        function modifyRate(num,rate,type){
            if(type){
                return num*rate;
            }else{
                return num/rate;
            }
        }


    }

    $.fn.domRotate= function(option){
        var domrotate = new Plugin(this,option);
        domrotate.init();
    }
})(jQuery,window,document);
