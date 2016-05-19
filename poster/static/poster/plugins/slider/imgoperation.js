(function(){
    $.fn.imgoperation = function(options){
        var opts = {
            'data':null
        };

        return this.each(function(){
            _option = $.extend(opts,options);
            var s = $(this),i = s.find('img');

        var imgW,imgH;
        if(s.width()/s.height() > _option.data.width / _option.data.height){
            imgW = s.width();
            imgH = _option.data.height * imgW / _option.data.width;
        }else{
            imgW = _option.data.width * imgH / _option.data.height;
            imgH = s.height();
        }
        i.attr("width",imgW);
        i.attr("height",imgH);

        var touchEvents={
            'startX':0,
            'startY':0,
            'currentX':0,
            'currentY':0,
        }
        var moveX = 0,moveY = 0;
        i.css({'position':'relative','top':'0','left':'0'});
        s.find('img').on({
            'touchstart':function(e){
                if(e.originalEvent) e = e.originalEvent;
                $(e.currentTarget).css({'transition':'none'});
                var imgl = i.css('left') == undefined ? 0 : i.css('left');
                var imgt = i.css('top') == undefined ? 0 : i.css('top');
                moveX = parseInt(imgl);
                moveY = parseInt(imgt);
                var touch = e.touches[0];
                touchEvents.startX = touch.pageX;
                touchEvents.startY = touch.pageY;
                $(e.currentTarget).addClass('drag-active');
                console.log(imgl);

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


            },

             'touchend':function(e){
                 if (e.originalEvent) e = e.originalEvent;
                 $(e.currentTarget).removeClass('drag-active');
                 var moveEndX = i.css('left') == undefined ? 0 : i.css('left');
                 var moveEndY = i.css('top') == undefined ? 0 : i.css('top');
                 var endX = moveEndX,endY = moveEndY;
                 if(parseInt(moveEndX)> 0){
                     endX = 0;
                 }

                if($(e.currentTarget).width() + parseInt(moveEndX) < $(e.currentTarget).parent().width()){
                    endX = - $(e.currentTarget).width() + $(e.currentTarget).parent().width();
                }

                 if(parseInt(moveEndY)> 0){
                     endY = 0;
                 }

                 if( $(e.currentTarget).height() + parseInt(moveEndY) < $(e.currentTarget).parent().height()){
                     endY = - $(e.currentTarget).height() + $(e.currentTarget).parent().height();
                 }

                 i.css('top',endY+'px');
                 i.css('left',endX+'px');

            }

        })










        })

    }



})(jQuery)