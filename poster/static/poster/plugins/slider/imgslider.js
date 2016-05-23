(function ($) {
    $.fn.imgscale = function () {
		return this.each(function(){
			var s = $(this);
			var pw = s.parent().width(),
				ph = s.parent().height(),
				sw = s.width(),
				sh = s.height(),
				sl = parseInt(s.css('left')),
				st = parseInt(s.css('top')),
				imgW,
				imgH;
			if(pw/ph > sw / sh){
                imgW = pw;
                imgH = sh * imgW / sw;
            }else{
                imgW = sw * ph / sh;
                imgH = ph;
            }
			s.attr({'width':imgW,'height':imgH});
			var touchEvents={
                'startX':0,
                'startY':0,
                'currentX':0,
                'currentY':0
            };
			s.opt={};
			var startDiagonal={'x':0,'y':0},endDiagonal={'x':0,'y':0};
            s.css({'position':'relative','top':'0','left':'0'});
			s.on({
                'touchstart':function(e){
                    if (e.originalEvent) e = e.originalEvent;

                    $(e.currentTarget).css({'transition':'none'});
					$(e.currentTarget).addClass('drag-active');

					s.opt.left = parseInt($(e.currentTarget).css('left'));
					s.opt.top = parseInt($(e.currentTarget).css('top'));
					s.opt.width = $(e.currentTarget).width();
					s.opt.height = $(e.currentTarget).height();

					var touch = e.touches[0];
					touchEvents.startX = touch.pageX;
                    touchEvents.startY = touch.pageY;
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

                    var ox = s.opt.left + ex;
                    var oy = s.opt.top + ey;

					if(e.touches.length <= 1){/*单手指*/
						//$(e.currentTarget).css({'transform': 'translate('+ox+'px,'+oy+'px)'});
						$(e.currentTarget).css({'left': ox+'px','top':oy+'px'});
					}else{
						var touch1 = e.touches[1];
						endDiagonal.x = Math.abs(touch.pageX - touch1.pageX);
						endDiagonal.y = Math.abs(touch.pageY - touch1.pageY);

						var ew = s.opt.width + parseInt(endDiagonal.x) - parseInt(startDiagonal.x),
							eh = ew * s.opt.height / s.opt.width,
							el = s.opt.left - ew/2,
							et = s.opt.top - eh/2;
						$(e.currentTarget).attr({'width':ew,'height':eh});

					}

                },
                'touchend':function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    $(e.currentTarget).removeClass('drag-active');
                    var moveEndX = parseInt($(e.currentTarget).css('left'));
                    var moveEndY = parseInt($(e.currentTarget).css('top'));
                    var endX = moveEndX,endY = moveEndY,endW = $(e.currentTarget).width(),endH = $(e.currentTarget).height();
					$('.ele3').html('moveEndY:'+moveEndY);
					if(endW < imgW){
						endW = imgW;
					}
					if(endH < imgH){
						endH = imgH;
					}
                    if(parseInt(moveEndX) > 0){/*top为正 img顶部位于父元素下面*/
                        endX = 0;
                    }
                    if(endW + parseInt(moveEndX) < $(e.currentTarget).parent().width()){
                        endX = - endW + $(e.currentTarget).parent().width();
                    }
                    if(parseInt(moveEndY) > 0){
                        endY = 0;
                    }
                    if( $(e.currentTarget).height() + parseInt(moveEndY) < $(e.currentTarget).parent().height()){
                        endY = - endH + $(e.currentTarget).parent().height();
						$('.ele4').html('endY:'+endY);
                    }

					$(e.currentTarget).css({'transition':'all .2s ease-in'});
					$(e.currentTarget).css({'left': endX+'px','top': endY+'px'}).attr({'width':endW,'height':endH});


                }

			});
		})
	}
    $.fn.imgslider = function(opations){
        var opts = {
            'data':null
        };
        return this.each(function () {
            var s = $(this),
				_option = $.extend(opts,opations);
            //var imgarray = [];

            $.extend(s,{'wraper':null,'swiper':null});

            var imgarray  = s.find('.swiper-container').find('img');

            s.empty();
            if(_option.data == null && imgarray.length <= 0){
                s.html($swipercon).removeClass('slider-content');
                return;
            }

            var $swipercon = '<div class="swiper-container"><div class="swiper-wrapper"></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>';
            s.html($swipercon).addClass('slider-content');


            s.addImage = function(datas){
                s.wraper = s.find('.swiper-wrapper');
                for(i=0;datas.length>0 && i<datas.length;i++){
                    s.wraper.append('<div class="swiper-slide" id="slideImg'+datas.eq(i).attr('data-id')+'"><img src="'+datas.eq(i).attr('src')+'" width="'+datas.eq(i).attr('width')+'" height="'+datas.eq(i).attr('height')+'" data-id="'+datas.eq(i).attr('data-id')+'" /></div>');
                }
                var imgW,imgH;
                if(s.width()/s.height() > _option.data.width / _option.data.height){
                    imgW = s.width();
                    imgH = _option.data.height * imgW / _option.data.width;
                }else{
                    imgW = _option.data.width * imgH / _option.data.height;
                    imgH = s.height();
                }
                s.wraper.append('<div class="swiper-slide" id="slideImg'+_option.data.imgid+'"><img src="'+_option.data.file+'" width="'+imgW+'" height="'+imgH+'" data-id="'+_option.data.imgid+'" ></div>');
                s.swiper = new Swiper('.swiper-container',{nextButton: '.swiper-button-next', prevButton: '.swiper-button-prev'});
                s.wraper.find('img').imgscale();
                $('.swiper-button-next,.swiper-button-prev').off('touchstart').on('touchstart',function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    e.stopPropagation();
                    $(e.currentTarget).click(function(e){e.stopPropagation();});
                });


            };
            s.updateSlider = function(datas){
                if(datas.lenght <= 0){
                    s.empty();return;
                }
                s.wraper = s.find('.swiper-wrapper');
                for(i=0;datas.length>0 && i<datas.length;i++){
                    s.wraper.append('<div class="swiper-slide" id="slideImg'+datas.eq(i).attr('data-id')+'"><img src="'+datas.eq(i).attr('src')+'" width="'+datas.eq(i).attr('width')+'" height="'+datas.eq(i).attr('height')+'" data-id="'+datas.eq(i).attr('data-id')+'" /></div>');
                }
                s.swiper = new Swiper('.swiper-container',{nextButton: '.swiper-button-next', prevButton: '.swiper-button-prev'});
                s.wraper.find('img').imgscale();
                $('.swiper-button-next,.swiper-button-prev').off('touchstart').on('touchstart',function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    e.stopPropagation();
                    $(e.currentTarget).click(function(e){e.stopPropagation();});
                });

            }
            if(_option.data != null && _option.data != ''){
                s.addImage(imgarray);
            }else{
                s.updateSlider(imgarray);
            }
        })

    }

})(jQuery);
