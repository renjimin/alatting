(function ($) {
    $.fn.imgslider = function(opations){
        var opts = {
            'data':null
        };
        return this.each(function () {
            var s = $(this),
				_option = $.extend(opts,opations);
            //var imgarray = [];

            $.extend(s,{'wraper':null,'swiper':null});

            var imgarray  = s.find('img');


            s.empty();
            var $swipercon = '<div class="swiper-container"><div class="swiper-wrapper"></div></div>';
            s.html($swipercon);

            s.addImage = function(datas){
                s.wraper = s.find('.swiper-wrapper');
                for(i=0;datas.length>0 && i<datas.length;i++){
                    s.wraper.append('<div class="swiper-slide"><img src="'+datas.eq(i).attr('src')+'" width="'+datas.eq(i).attr('width')+'" height="'+datas.eq(i).attr('height')+'" /></div>');
                }
                console.log(_option.data);
                var imgW,imgH;
                if(s.width()/s.height() > _option.data.width / _option.data.height){
                    imgW = s.width();
                    imgH = _option.data.height * imgW / _option.data.width;
                }else{
                    imgW = _option.data.width * imgH / _option.data.height;
                    imgH = s.height();
                }
                s.wraper.append('<div class="swiper-slide"><img src="'+_option.data.file+'" width="'+imgW+'" height="'+imgH+'" ></div>');
                s.swiper = new Swiper('.swiper-container');
                var touchEvents={
                    'startX':0,
                    'startY':0,
                    'currentX':0,
                    'currentY':0,
                }
                var moveX = 0,moveY = 0;
                s.wraper.find('img').on({
                    'touchstart':function(e){
                        if (e.originalEvent) e = e.originalEvent;
                        $(e.currentTarget).css({'transition':'none'});
                        moveX = $(e.currentTarget).attr('data-x') == undefined ? 0:$(e.currentTarget).attr('data-x');
                        moveY = $(e.currentTarget).attr('data-y') == undefined ? 0:$(e.currentTarget).attr('data-y');
                        var touch = e.touches[0];
                        touchEvents.startX = touch.pageX;
                        touchEvents.startY = touch.pageY;
                        $(e.currentTarget).addClass('drag-active');
                    },
                    'touchmove':function(e){
                        if (e.originalEvent) e = e.originalEvent;
                        e.preventDefault();e.stopPropagation();
                        var touch = e.touches[0];
                        touchEvents.currentX = touch.pageX;
                        touchEvents.currentY = touch.pageY;

                        var ex = touchEvents.currentX - touchEvents.startX;
                        var ey = touchEvents.currentY - touchEvents.startY;

                        var ox = parseInt(moveX) + ex;
                        var oy = parseInt(moveY) + ey;
                        $(e.currentTarget).attr({'data-x':ox,'data-y':oy});
                        $(e.currentTarget).css({'transform': 'translate('+ox+'px,'+oy+'px)'});

                    },
                    'touchend':function(e){
                        if (e.originalEvent) e = e.originalEvent;
                        $(e.currentTarget).removeClass('drag-active');
                        var moveEndX = $(e.currentTarget).attr('data-x') == undefined ? 0:$(e.currentTarget).attr('data-x');
                        var moveEndY = $(e.currentTarget).attr('data-y') == undefined ? 0:$(e.currentTarget).attr('data-y');
                        var endX = moveEndX,endY = moveEndY;
                        if(parseInt(moveEndX) > 0){
                            endX = 0;
                        }
                        if($(e.currentTarget).width() + parseInt(moveEndX) < $(e.currentTarget).parent().width()){
                            endX = - $(e.currentTarget).width() + $(e.currentTarget).parent().width();
                        }
                        if(parseInt(moveEndY) > 0){
                            endY = 0;
                        }
                        if( $(e.currentTarget).height() + parseInt(moveEndY) < $(e.currentTarget).parent().height()){
                            endY = - $(e.currentTarget).height() + $(e.currentTarget).parent().height();
                        }
                        $(e.currentTarget).attr({'data-x':endX,'data-y':endY});
                        $(e.currentTarget).css({'transition':'transform .2s','transform': 'translate('+endX+'px,'+endY+'px)'});

                    }
                });
            };
            if(_option.data != null && _option.data != ''){
                s.addImage(imgarray);
            }
        })

    }
})(jQuery);
