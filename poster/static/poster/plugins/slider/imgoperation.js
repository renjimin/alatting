(function(){
    $.fn.imgoperation = function(options){
        var opts = {
            'data':null
        };

        return this.each(function(){
            _option = $.extend(opts,options);
            var s = $(this),i = s.find('img').eq(0),v = s.find('video');

        var imgW,imgH,ow,oh;
        if(_option.data == null){
            ow = i.width()
            oh = i.height();
        }else if(_option.data.width == undefined){
            ow = s.width();
            oh = s.height();
        }else{
            ow = _option.data.width;
            oh = _option.data.height;
        }

        if(s.width()/s.height() >= ow / oh){
            imgW = s.width();
            imgH = oh * imgW / ow;
        }else{
            imgH = s.height();
            imgW = ow * imgH / oh;
        }


        i.attr("width",imgW);
        i.attr("height",imgH);

        v.attr("width",imgW);
        v.attr("height",imgH);

        var touchEvents={
            'startX':0,
            'startY':0,
            'currentX':0,
            'currentY':0,
        }
        var moveX = 0,moveY = 0;

        s.opt={};
        var startDiagonal={'x':0,'y':0},endDiagonal={'x':0,'y':0};
            
        i.css({'position':'relative','top':0,'left':0});

<<<<<<< HEAD
        i.css({'position':'relative','top':0,'left':0});
=======
>>>>>>> tdf
        i.on({
            'touchstart':function(e){
                if(e.originalEvent) e = e.originalEvent;
                $(e.currentTarget).css({'transition':'none'});
                var imgl = i.css('left') == undefined ? 0 : i.css('left');
                var imgt = i.css('top') == undefined ? 0 : i.css('top');
<<<<<<< HEAD
                console.log(imgl);
=======

                console.log(imgl);

>>>>>>> tdf
                moveX = parseInt(imgl);
                moveY = parseInt(imgt);
                var touch = e.touches[0];
                touchEvents.startX = touch.pageX;
                touchEvents.startY = touch.pageY;
                $(e.currentTarget).addClass('drag-active');

				
				s.opt.width = $(e.currentTarget).width();
				s.opt.height = $(e.currentTarget).height();
				
				if(e.touches.length > 1){
					var touch1 = e.touches[1];
					startDiagonal.x = Math.abs(touch.pageX - touch1.pageX);
					startDiagonal.y = Math.abs(touch.pageY - touch1.pageY);
				}

            },

             'touchmove':function(e){
                 if (e.originalEvent) e = e.originalEvent;
                 e.preventDefault();e.stopPropagation();
                 var touch = e.touches[0];
                 touchEvents.currentX = touch.pageX;
                 touchEvents.currentY = touch.pageY;

                 var ex = touchEvents.currentX - touchEvents.startX;
                 var ey = touchEvents.currentY - touchEvents.startY;

                 var ox = moveX + ex;
                 var oy = moveY + ey;
                 i.css('top',oy+'px');
                 i.css('left',ox+'px');

                if(e.touches.length>1){
           
                    var touch1 = e.touches[1];
                    endDiagonal.x = Math.abs(touch.pageX - touch1.pageX);
                    endDiagonal.y = Math.abs(touch.pageY - touch1.pageY);

                    var ew = s.opt.width + parseInt(endDiagonal.x) - parseInt(startDiagonal.x),
							eh = ew * s.opt.height / s.opt.width;
	
                    i.css({'width':ew,'height':eh});

                }



            },

             'touchend':function(e){
                 if (e.originalEvent) e = e.originalEvent;
                 $(e.currentTarget).removeClass('drag-active');
                 var moveEndX = i.css('left') == undefined ? 0 : i.css('left');
                 var moveEndY = i.css('top') == undefined ? 0 : i.css('top');
                 var endX = moveEndX,endY = moveEndY;
				 
				 var endW = $(e.currentTarget).width(),endH = $(e.currentTarget).height();
				 
				if(endW < imgW){
					endW = imgW;
				}
				if(endH < imgH){
					endH = imgH;
				}

                 if(parseInt(moveEndX)> 0){
                     endX = 0;
                 }

                if( endW + parseInt(moveEndX) < $(e.currentTarget).parent().width()){
                    endX = - endW + $(e.currentTarget).parent().width();	

                }

                 if(parseInt(moveEndY)> 0){
                     endY = 0;
                 }

                 if( endH + parseInt(moveEndY) < $(e.currentTarget).parent().height()){
                     endY = - endH + $(e.currentTarget).parent().height();
                 }
				 
			
                 i.css('top',endY+'px');
                 i.css('left',endX+'px');
				 
				 
				 i.css('width',endW+'px');
                 i.css('height',endH+'px');
				 
                 i.css({'transition':'all .2s ease-in'});

            }

        })



        })

    }

})(jQuery)


