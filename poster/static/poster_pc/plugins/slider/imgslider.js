(function ($) {
	$.fn.imgSliderScale = function () {
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

			s.attr({'width':imgW,'height':imgH}).css({'left':sl,'top':st});
			var touchEvents={
					'startX':0,
					'startY':0,
					'currentX':0,
					'currentY':0
			};
			s.opt={};
			var startDiagonal={'x':0,'y':0},endDiagonal={'x':0,'y':0};
			s.css({'position':'relative'});
			s.dragable({
				'start':function(e){
					s.css({'transition':'none'});
					s.opt.left = parseInt($(e.currentTarget).css('left'));
					s.opt.top = parseInt($(e.currentTarget).css('top'));
					s.opt.width = $(e.currentTarget).width();
					s.opt.height = $(e.currentTarget).height();

					touchEvents.startX = e.pageX;
					touchEvents.startY = e.pageY;

				},
				'move':function(e){
					touchEvents.currentX = e.pageX;
					touchEvents.currentY = e.pageY;

					var ex = touchEvents.currentX - touchEvents.startX;
					var ey = touchEvents.currentY - touchEvents.startY;

					var ox = s.opt.left + ex;
					var oy = s.opt.top + ey;

					s.css({'left': ox+'px','top':oy+'px'});					
				},
				'end':function(e){
					var moveEndX = parseInt(s.css('left'));
					var moveEndY = parseInt(s.css('top'));
					var endX = moveEndX,endY = moveEndY,endW = s.width(),endH = s.height();
					if(endW < imgW){
						endW = imgW;
					}
					if(endH < imgH){
						endH = imgH;
					}
					if(parseInt(moveEndX) > 0){/*top为正 img顶部位于父元素下面*/
							endX = 0;
					}
					if(endW + parseInt(moveEndX) < s.parent().width()){
							endX = - endW + s.parent().width();
					}
					if(parseInt(moveEndY) > 0){
							endY = 0;
					}
					if( s.height() + parseInt(moveEndY) < s.parent().height()){
							endY = - endH + s.parent().height();
					}

					s.css({'transition':'all .2s ease-in'});
					s.css({'left': endX+'px','top': endY+'px'}).attr({'width':endW,'height':endH});
				}
			});
		})
	}
	$.fn.imgslider = function(options){
			var opts = {
					'data':null,
					'imgEle':null
			};
			return this.each(function () {
					var s = $(this),
					_option = $.extend(opts,options);

					$.extend(s,{'wraper':null,'swiper':null});

					var imgarray  = s.find('.swiper-container').find('img');

					if(_option.data == null && imgarray.length <= 0){
							s.removeClass('slider-content');
							s.empty();
							return;
					}

					s.addImage = function(datas){
							s.empty();
							var $swipercon = '<div class="swiper-container"><div class="swiper-wrapper"></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>';
							s.html($swipercon).addClass('slider-content');

							s.wraper = s.find('.swiper-wrapper');
							for(i=0;datas.length>0 && i<datas.length;i++){
									s.wraper.append('<div class="swiper-slide" id="slideImg'+datas.eq(i).attr('data-id')+'"><img src="'+datas.eq(i).attr('src')+'" width="'+datas.eq(i).attr('width')+'" height="'+datas.eq(i).attr('height')+'" data-id="'+datas.eq(i).attr('data-id')+'" style="'+datas.eq(i).attr('style')+'" /></div>');
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
							s.wraper.find('img').imgSliderScale();
							$('.swiper-button-next,.swiper-button-prev').off('touchstart').on('touchstart',function(e){
									if (e.originalEvent) e = e.originalEvent;
									e.stopPropagation();
									$(e.currentTarget).click(function(e){e.stopPropagation();});
							});


					};
					s.updateSlider = function(){

							s.swiper = new Swiper('.swiper-container',{nextButton: '.swiper-button-next', prevButton: '.swiper-button-prev'});

							s.find('.swiper-container').find('img').imgSliderScale();
							$('.swiper-button-next,.swiper-button-prev').off('touchstart').on('touchstart',function(e){
									if (e.originalEvent) e = e.originalEvent;
									e.stopPropagation();
									$(e.currentTarget).click(function(e){e.stopPropagation();});
							});

					}
					


					if(_option.data != null && _option.data != ''){
							s.addImage(imgarray);
					}else{
							s.updateSlider();
					}

			})

	}
	$.fn.imgslidershow = function(){

			return this.each(function () {
					var s = $(this);

					var imgarray  = s.find('.swiper-container').find('img');

					if(imgarray.length <= 0){
							s.removeClass('slider-content');
							return;
					}

					s.swiper = new Swiper('.swiper-container',{nextButton: '.swiper-button-next', prevButton: '.swiper-button-prev'});

			})

	}

})(jQuery);
