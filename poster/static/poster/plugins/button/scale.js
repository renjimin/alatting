var scaleIndex = 20;
var scale = function(box,options){
    var defaults = {
        'box':'.cnd-element',
        'left':'0',
    	'top':'0',
        'width':'100',
        'height':'100',
    	'tx':'0',
    	'ty':'0',
    	'cx':'0',
    	'cy':'0',
    	'currentAngle':'0'
    }
    var opt = $.extend(defaults,options),s = this;
    s.opt=opt;
    var o,
    b,
    r,/*旋转点*/
    editBtn,/*编辑按钮*/
    ele,
    dragable=false,
    nbarse,/*右下角*/
    nbarne,/*右上角*/
    nbarsw,/*左下角*/
    nbarnw,/*左上角*/
    nbarn,/*上*/
    nbars,/*下*/
    nbare,/*右*/
    nbarw/*左*/;

    if(typeof(box) == 'undefined'|| box ==null || box.length <= 0){
        return;
    }
    s.o = box;
    b = s.o.find('.element-box');
    r = s.o.find('.nbar-rotate');
    editBtn = s.o.find('.nbar-edit');
    ele = s.o.find('.element');
    nbarse = s.o.find('.nbar-se');
    nbarne = s.o.find('.nbar-ne');
    nbarsw = s.o.find('.nbar-sw');
    nbarnw = s.o.find('.nbar-nw');
    nbarn = s.o.find('.nbar-n');
    nbars = s.o.find('.nbar-s');
    nbare = s.o.find('.nbar-e');
    nbarw = s.o.find('.nbar-w');



    s.initData = function(elementbox){
        s.o = elementbox.parent();
        b = s.o.find('.element-box');
        r = s.o.find('.nbar-rotate');
        editBtn = s.o.find('.nbar-edit');
        ele = s.o.find('.element');
        nbarse = s.o.find('.nbar-se');
        nbarne = s.o.find('.nbar-ne');
        nbarsw = s.o.find('.nbar-sw');
        nbarnw = s.o.find('.nbar-nw');
        nbarn = s.o.find('.nbar-n');
        nbars = s.o.find('.nbar-s');
        nbare = s.o.find('.nbar-e');
        nbarw = s.o.find('.nbar-w');

        if(s.o.position() == undefined){
            s.opt.left = 0;
            s.opt.top = 0
        }else{
            s.opt = s.o.position().left;
            s.opt.top = s.o.position().top
        }

        s.opt.cx = parseInt(s.opt.width)/2;/*计算圆心相对坐标*/
        s.opt.cy = parseInt(s.opt.height)/2;

        s.opt.width = ele.innerWidth() == 0 ? parseInt(ele.css('width')) : ele.innerWidth();
        s.opt.height = ele.innerHeight() == 0 ? parseInt(ele.css('height')) : ele.innerHeight();
        s.opt.currentAngle = s.o.data('rotate') == null ? '0': s.o.data('rotate');
    }
    s.initData(b);
    var touchEvents={
        'startX':0,
        'startY':0,
        'currentX':0,
        'currentY':0,
    }
    /*
    * 拖动 element-box
    */
    b.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
            $('.cnd-element').removeClass('active');
            s.o.addClass('active').css('z-index',scaleIndex++);
            $(e.currentTarget).addClass('drag-active');

        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var ex = touchEvents.currentX - touchEvents.startX;
            var ey = touchEvents.currentY - touchEvents.startY;

            var ox = s.opt.tx = parseInt(s.opt.left) + ex;
            var oy = s.opt.ty = parseInt(s.opt.top) + ey;

            s.o.css({'left': ox + 'px','top': oy + 'px'});

        },
        'touchend':function(e){
            if (e.originalEvent) e = e.originalEvent;
            $(e.currentTarget).removeClass('drag-active');
        }
    });

    /*
    * 旋转 nbar-rotate
    */
    r.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
            $(e.currentTarget).addClass('drag-active');

        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var ex = touchEvents.currentX - touchEvents.startX;
            var ey = touchEvents.currentY - touchEvents.startY;

            var offsetX = s.o.offset().left;
            var offsetY = s.o.offset().top;
            var mouseX = touch.pageX - offsetX;/*计算出鼠标相对于画布顶点的位置,无pageX时用clientY + body.scrollTop - body.clientTop代替,可视区域y+body滚动条所走的距离-body的border-top,不用offsetX等属性的原因在于，鼠标会移出画布*/
            var mouseY = touch.pageY - offsetY;
            var ox = mouseX - s.opt.cx;/*cx,cy为圆心*/
            var oy = mouseY - s.opt.cy;
            var to = Math.abs( ox/oy );
            var angle = Math.atan( to )/( 2 * Math.PI ) * 360;/*鼠标相对于旋转中心的角度*/
            if( ox < 0 && oy < 0)/*相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系*/
            {
                angle = 360 - angle;
            }else if( ox < 0 && oy > 0)/*左下角,3象限*/
            {
                angle =  180 + angle;
            }else if( ox > 0 && oy < 0)/*右上角，1象限*/
            {
                angle = angle;
            }else if( ox > 0 && oy > 0)/*右下角，2象限*/
            {
                angle = 180 -  angle;
            }
            var offsetAngle = angle - parseInt(s.opt.currentAngle);

            s.o.css('transform', 'rotate('+offsetAngle+'deg)');
            s.o.attr('data-rotate',offsetAngle);
        },
        'touchend':function(e){
            if (e.originalEvent) e = e.originalEvent;
            $(e.currentTarget).removeClass('drag-active');
            s.opt.currentAngle = s.o.data('rotate');
        }
    });
    /*
    * 缩放（右下角,改变宽度和高度） nbar-se
    */
    nbarse.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var sx = touchEvents.currentX - touchEvents.startX;
            var sy = touchEvents.currentY - touchEvents.startY;

            if(sx > sy){
                sx = sy;/*以小单位为准*/
            }
            var tox = parseInt(s.opt.width) + sx;/* 计算宽度 */
            var toy = parseInt(s.opt.height) * tox/parseInt(s.opt.width);/*计算高度，保持宽高比例不变*/

            s.o.find('.element').css({'width':tox+'px','height':toy+'px'});
        },
        'touchend':function(e){

        }
    });
    /*
    * 缩放（右上角,改变宽度和高度） nbar-ne
    */
    nbarne.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var sx = touchEvents.currentX - touchEvents.startX;
            var sy = touchEvents.currentY - touchEvents.startY;
            /*if(Math.abs(sx) > Math.abs(sy)){
                sx = sy;
            }*/
            var tox = parseInt(s.opt.width) + sx; /* 计算宽度 */
            var toy = parseInt(s.opt.height) * tox/parseInt(s.opt.width);/*计算高度，保持宽高比例不变,这里以x轴坐标为准*/
            if(tox < 0) return;
            s.o.find('.element').css({'width':tox+'px','height':toy+'px'});
            s.o.css('top', parseInt(s.opt.top) - toy + parseInt(s.opt.height) + 'px');/* 以底线为基准向右上方缩放 */
        },
        'touchend':function(e){

        }
    });
    /*
    * 缩放（左下角,改变宽度和高度） nbar-sw
    */
    nbarsw.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var sx = touchEvents.currentX - touchEvents.startX;
            var sy = touchEvents.currentY - touchEvents.startY;
            /*if(Math.abs(sx) > Math.abs(sy)){
                sx = sy;
            }*/
            var tox = parseInt(s.opt.width) - sx; /* 计算宽度 */
            var toy = parseInt(s.opt.height) * tox/parseInt(s.opt.width);/*计算高度，保持宽高比例不变,这里以x轴坐标为准*/
            if(tox < 0) return;
            s.o.find('.element').css({'width':tox+'px','height':toy+'px'});
            s.o.css('left', parseInt(s.opt.left) + sx + 'px');/* 以底线为基准向右上方缩放 */
        },
        'touchend':function(e){

        }
    });
    /*
    * 缩放（左上角,改变宽度和高度） nbar-nw
    */
    nbarnw.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var sx = touchEvents.currentX - touchEvents.startX;
            var sy = touchEvents.currentY - touchEvents.startY;

            var tox = parseInt(s.opt.width) - sx; /* 计算宽度 */
            var toy = parseInt(s.opt.height) * tox/parseInt(s.opt.width);/*计算高度，保持宽高比例不变,这里以x轴坐标为准*/
            if(tox < 0) return;
            s.o.find('.element').css({'width':tox+'px','height':toy+'px'});
            s.o.css({'top':parseInt(s.opt.top) - toy + parseInt(s.opt.height) + 'px','left': parseInt(s.opt.left) + sx + 'px'});/* 以底线为基准向右上方缩放 */
        },
        'touchend':function(e){

        }
    });
    /*
    * 右（宽度） nbar-e
    */
    nbare.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var sx = touchEvents.currentX - touchEvents.startX;

            var tox = parseInt(s.opt.width) + sx;

            s.o.find('.element').css({'width':tox+'px'});
        },
        'touchend':function(e){

        }
    });
    /*
    * 下（高度） nbar-s
    */
    nbars.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var sy = touchEvents.currentY - touchEvents.startY;

            var toy = parseInt(s.opt.height) + sy;

            s.o.find('.element').css({'height':toy+'px'});
        },
        'touchend':function(e){

        }
    });
    /*
    * 左（宽度） nbar-w
    */
    nbarw.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var sx = touchEvents.currentX - touchEvents.startX;

            var tox = parseInt(s.opt.width) - sx;
            if(tox >= 0){
                s.o.find('.element').css({'width':tox+'px'});
                s.o.css({'left':parseInt(s.opt.left)+sx+'px'});
            }
        },
        'touchend':function(e){

        }
    });
    /*
    * 上（高度） nbar-n
    */
    nbarn.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            s.initData($(e.currentTarget));
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var sy = touchEvents.currentY - touchEvents.startY;

            var toy = parseInt(s.opt.height) - sy;
            if(toy >= 0){
                s.o.find('.element').css({'height':toy+'px'});
                s.o.css({'top':parseInt(s.opt.top)+sy+'px'});
            }
        },
        'touchend':function(e){

        }
    });

    if(ele.hasClass('btn')){
        /*编辑按钮*/
        editBtn.on('touchstart',function(e){
            if (e.originalEvent) e = e.originalEvent;e.preventDefault();
            elebtn = $(e.currentTarget).parent().find('.element');
            addButton(elebtn);
        })
    }



}
