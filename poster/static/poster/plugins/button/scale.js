var scale = function(options){
    var defaults = {
        'box':'.cnd-element',
        'left':'0',
    	'top':'0',
    	'tx':'0',
    	'ty':'0',
    	'cx':'0',
    	'cy':'0',
    	'currentAngle':'0'
    }
    var opt = $.extend(defaults,options),s = this;
    var os = $(opt.box);
    if(typeof(os) == 'undefined'|| os ==null || os.length <= 0){
        return;
    }
    var o,b,r,editBtn,ele,dragable=false;
    /*$('body').on({
        'touchstart':function(e){
            if (e.originalEvent) e = e.originalEvent;
            if($(e.target).hasClass('element')){
                o = $(e.target).parent().parent().parent();
                b = o.find('.element-box');
                r = o.find('.nbar-rotate');
                editBtn = o.find('.nbar-edit');
                ele = o.find('.element');
                console.log(ele);
                dragable = true;
                s.draggable();
            }
        },
        'touchmove':function(e){
            if (e.originalEvent) e = e.originalEvent;
            if(dragable){

            }
        },
        'touchend':function(event){
            opt.left = opt.tx;
            opt.top = opt.ty;
        }
    });*/

     for(i=0;i<os.length;i++){
         o = $(os[i]);
        b = o.find('.element-box');
        r = o.find('.nbar-rotate');
        editBtn = o.find('.nbar-edit');
        ele = o.find('.element');

        var opt = {
            'left': o.offset().left,
            'top':o.offset().top,
            'tx':'0',
            'ty':'0',
            'cx':'0',
            'cy':'0',
            'currentAngle':'0'
        }

        var reg = /(rotate\([\-\+]?((\d+)))/i;
	    var wt = o.css('transform'), wts = wt.match (reg);
	    var $2 = RegExp.$2;
        if($2==null || $2 == ''){
            opt.currentAngle = 0;
        }else{
            opt.currentAngle = $2;
        }


        var touchEvents={
            'startX':0,
            'startY':0,
            'currentX':0,
            'currentY':0,
        }
        b.on({
            'touchstart':function(e){
                if (e.originalEvent) e = e.originalEvent;
                var touch = e.touches[0];
                touchEvents.startX = touch.pageX;
                touchEvents.startY = touch.pageY;
                $('.cnd-element').removeClass('active');
                o.addClass('active');
            },
            'touchmove':function(e){
                if (e.originalEvent) e = e.originalEvent;
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
        r.on({
            'touchstart':function(e){
                if (e.originalEvent) e = e.originalEvent;
                var touch = e.touches[0];
                touchEvents.startX = touch.pageX;
                touchEvents.startY = touch.pageY;
            },
            'touchmove':function(e){
                if (e.originalEvent) e = e.originalEvent;
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
                o.css('transform', 'rotate('+offsetAngle+'deg)');
                currentAngle = offsetAngle;
            },
            'touchend':function(event){
                opt.currentAngle = currentAngle;
            }
        });
        /*编辑按钮*/
        editBtn.on('click',function(){
            addButton(ele);
        })
    }





}

scale();