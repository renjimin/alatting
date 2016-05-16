var scale = function(box,options){
    var defaults = {
        'box':'.cnd-element',
        'left':'0',
    	'top':'0',
    	'tx':'0',
    	'ty':'0',
    	'cx':'0',
    	'cy':'0',
    	'currentAngle':'0',
        'currentScale':'0',
        'scaleX':'1',
        'scaleY':'1',
    }
    var opt = $.extend(defaults,options),s = this;

    var o,b,r,editBtn,ele,dragable=false,nbarse;
    if(typeof(box) == 'undefined'|| box ==null || box.length <= 0){
        return;
    }
    o = box;
    b = o.find('.element-box');
    r = o.find('.nbar-rotate');
    editBtn = o.find('.nbar-edit');
    ele = o.find('.element');
    nbarse = o.find('.nbar-se');



    s.initData = function(){
        o = box;
        b = o.find('.element-box');
        r = o.find('.nbar-rotate');
        editBtn = o.find('.nbar-edit');
        ele = o.find('.element');
        nbarse = o.find('.nbar-se');

        opt.left = o.offset().left == 0 ? parseInt(o.css('left')) : o.offset().left;
        opt.top = o.offset().top == 0 ? parseInt(o.css('top')) : o.offset().top;
        
        opt.currentAngle = o.data('rotate') == null ? '0': o.data('rotate');

        opt.scaleX = o.data('scaleX') == null ? '1': o.data('scaleX');
        opt.scaleY = o.data('scaleY') == null ? '1': o.data('scaleY');
    }
    s.initData();
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
            s.initData();
            var touch = e.touches[0];
            touchEvents.startX = touch.pageX;
            touchEvents.startY = touch.pageY;
            $('.cnd-element').removeClass('active');
            o.addClass('active');
            console.log('top:'+opt.top+'  left:'+opt.left+'  o.left:'+ o.css('left'));
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            var touch = e.touches[0];
            touchEvents.currentX = touch.pageX;
            touchEvents.currentY = touch.pageY;

            var ex = touchEvents.currentX - touchEvents.startX;
            var ey = touchEvents.currentY - touchEvents.startY;

            var ox = opt.tx = parseInt(opt.left) + ex;
            var oy = opt.ty = parseInt(opt.top) + ey;

            o.css('left', ox + 'px');
            o.css('top', oy + 'px');

            opt.cx = o.width()/2;
            opt.cy = o.height()/2;
        },
        'touchend':function(event){
            opt.left = opt.tx;
            opt.top = opt.ty;
        }
    });
    var currentAngle = opt.currentAngle;

    /*
    * 旋转 nbar-rotate
    */
    r.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;
            s.initData();
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

            var ex = touchEvents.currentX - touchEvents.startX;
            var ey = touchEvents.currentY - touchEvents.startY;

            var offsetX = opt.left;
            var offsetY = opt.top;
            var mouseX = touch.pageX - offsetX;//计算出鼠标相对于画布顶点的位置,无pageX时用clientY + body.scrollTop - body.clientTop代替,可视区域y+body滚动条所走的距离-body的border-top,不用offsetX等属性的原因在于，鼠标会移出画布
            var mouseY = touch.pageY - offsetY;
            var ox = mouseX - opt.cx;//cx,cy为圆心
            var oy = mouseY - opt.cy;
            var to = Math.abs( ox/oy );
            var angle = Math.atan( to )/( 2 * Math.PI ) * 360;//鼠标相对于旋转中心的角度
            if( ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系
            {
                angle = -angle;
            }else if( ox < 0 && oy > 0)//左下角,3象限
            {
                angle = -( 180 - angle )
            }else if( ox > 0 && oy < 0)//右上角，1象限
            {
                angle = angle;
            }else if( ox > 0 && oy > 0)//右下角，2象限
            {
                angle = 180 - angle;
            }
            var offsetAngle = angle - parseInt(opt.currentAngle);
            //console.log(o.offsetLeft+'   top:'+o.offsetTop);

            opt.scaleX = o.attr('data-scaleX');
            opt.scaleY = o.attr('data-scaleY');

            o.css('transform', 'rotate('+offsetAngle+'deg) scale('+opt.scaleX+','+opt.scaleY+')');
            o.attr('data-rotate',offsetAngle);
            currentAngle = offsetAngle;
        },
        'touchend':function(event){
            opt.currentAngle = currentAngle;
        }
    });
    /*
    * 缩放（右下角） nbar-se
    */
    var scalex, scaley;
    nbarse.on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;
            s.initData();
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

            var cx = opt.cx;
            var cy = opt.cy;

            var sx = (touchEvents.startX - cx) * (touchEvents.startX - cx) + (touchEvents.startY - cy) * (touchEvents.startY - cy);
            var sy = (touchEvents.currentX - cx) * (touchEvents.currentX - cx) + (touchEvents.currentY - cy) * (touchEvents.currentY - cy);



            var to = Math.sqrt(sy) - Math.sqrt(sx);
            var tof = to/Math.sqrt(cx*cx + cy*cy);

            var toxy = tof;
            scalex = toxy + parseInt(opt.scaleX);
            scaley = toxy + parseInt(opt.scaleY);

            //console.log(o.offsetLeft+'   top:'+o.offsetTop);
            o.css('transform', 'scale('+scalex+','+scaley+') rotate('+opt.currentAngle+'deg)');
        },
        'touchend':function(e){
            opt.scaleX = scalex;
            opt.scaleY = scaley;
            o.attr('data-scaleX',scalex);
            o.attr('data-scaleY',scaley);
            console.log(opt.scaleX);
        }
    });
    if(ele.hasClass('btn')){
        /*编辑按钮*/
        editBtn.on('click',function(){
            addButton(ele);
        })
    }




}
