(function($) {
	$.fn.imgscale = function() {
		return this.each(function() {
			var s = $(this);
			var pw = s.parent().width()*remScale,
				ph = s.parent().height()*remScale,
				sw = s.width()*remScale,
				sh = s.height()*remScale,
				sl = parseInt(s.css('left'))*remScale,
				st = parseInt(s.css('top'))*remScale,
				imgW,
				imgH;

			if (pw / ph > sw / sh) {
				imgW = pw;
				imgH = sh * imgW / sw;
			} else {
				imgW = sw * ph / sh;
				imgH = ph;
			}
			//console.log(pw+'    '+ph+'    '+sw+'    '+sh+'    '+sl)
			s.css({
				'width':imgW+'rem',
				'height':imgH+'rem',
				'left': sl+'rem',
				'top': st+'rem'
			});
			var touchEvents = {
				'startX': 0,
				'startY': 0,
				'currentX': 0,
				'currentY': 0
			};
			s.opt = {};
			var startDiagonal = {
					'x': 0,
					'y': 0
				},
				endDiagonal = {
					'x': 0,
					'y': 0
				};
			s.css({
				'position': 'relative'
			});
			var moveAble = false;
			s.on({
				'touchstart': function(e) {
					if (e.originalEvent) e = e.originalEvent;
					$(e.currentTarget).css({
						'transition': 'none'
					});
					$(e.currentTarget).stop(true,false).fadeTo(500,0.5,function(){
						moveAble = true;
					});

					s.opt.left = parseInt($(e.currentTarget).css('left'))*remScale;
					s.opt.top = parseInt($(e.currentTarget).css('top'))*remScale;
					s.opt.width = $(e.currentTarget).width()*remScale;
					s.opt.height = $(e.currentTarget).height()*remScale;

					var touch = e.touches[0];
					touchEvents.startX = touch.pageX;
					touchEvents.startY = touch.pageY;
					if (e.touches.length > 1) {
						var touch1 = e.touches[1];
						startDiagonal.x = Math.abs(touch.pageX - touch1.pageX);
						startDiagonal.y = Math.abs(touch.pageY - touch1.pageY);
					}

				},

				'touchmove': function(e) {
					if (e.originalEvent) e = e.originalEvent;
					$(e.currentTarget).stop(false,false);
					if(!moveAble) return;
					e.preventDefault();e.stopPropagation();
					var touch = e.touches[0];
					touchEvents.currentX = touch.pageX;
					touchEvents.currentY = touch.pageY;

					var ex = (touchEvents.currentX - touchEvents.startX)*remScale;
					var ey = (touchEvents.currentY - touchEvents.startY)*remScale;

					var ox = s.opt.left + ex;
					var oy = s.opt.top + ey;
					console.log(ox)
					if (e.touches.length <= 1) { /*单手指*/
						//$(e.currentTarget).css({'transform': 'translate('+ox+'px,'+oy+'px)'});
						$(e.currentTarget).css({
							'left': ox + 'rem',
							'top': oy + 'rem'
						});
					} else {return;
						var touch1 = e.touches[1];
						endDiagonal.x = Math.abs(touch.pageX - touch1.pageX);
						endDiagonal.y = Math.abs(touch.pageY - touch1.pageY);

						var ew = s.opt.width + parseInt(endDiagonal.x) - parseInt(startDiagonal.x),
							eh = ew * s.opt.height / s.opt.width,
							el = s.opt.left - ew / 2,
							et = s.opt.top - eh / 2;
						$(e.currentTarget).css({
							'width': ew+'rem',
							'height': eh+'rem'
						});

					}

				},
				'touchend': function(e) {
					if (e.originalEvent) e = e.originalEvent;
					$(e.currentTarget).stop(true,false).fadeTo(100,1);
					if(!moveAble) return;moveAble = false;
					var moveEndX = parseInt($(e.currentTarget).css('left'));
					var moveEndY = parseInt($(e.currentTarget).css('top'));
					var endX = moveEndX,
						endY = moveEndY,
						endW = $(e.currentTarget).width(),
						endH = $(e.currentTarget).height();
					if (endW < imgW) {
						endW = imgW;
					}
					if (endH < imgH) {
						endH = imgH;
					}
					if (parseInt(moveEndX) > 0) { /*top为正 img顶部位于父元素下面*/
						endX = 0;
					}
					if (endW + parseInt(moveEndX) < $(e.currentTarget).parent().width()) {
						endX = -endW + $(e.currentTarget).parent().width();
					}
					if (parseInt(moveEndY) > 0) {
						endY = 0;
					}
					if ($(e.currentTarget).height() + parseInt(moveEndY) < $(e.currentTarget).parent().height()) {
						endY = -endH + $(e.currentTarget).parent().height();
					}

					$(e.currentTarget).css({
						'transition': 'all .2s ease-in'
					});
					s.css({
						'left': endX*remScale + 'rem',
						'top': endY*remScale + 'rem',
						'width': endW*remScale+'rem',
						'height': endH*remScale+'rem'
					});


				}

			});
		})
	}
	$.fn.imgslider = function(options) {
		var opts = {
			'data': null
		};
		return this.each(function() {
			var s = $(this),
				_option = $.extend(opts, options);

			$.extend(s, {
				'wraper': null,
				'swiper': null
			});

			var imgarray = s.find('.swiper-container').find('img');

			if (_option.data == null && imgarray.length <= 0) {
				s.removeClass('slider-content');
				s.empty();
				return;
			}

			s.addImage = function(datas) {
				s.empty();
				var $swipercon = '<div class="swiper-container"><div class="swiper-wrapper"></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>';
				s.html($swipercon).addClass('slider-content');

				s.wraper = s.find('.swiper-wrapper');
				for (i = 0; datas.length > 0 && i < datas.length; i++) {
					s.wraper.append('<div class="swiper-slide" id="slideImg' + datas.eq(i).attr('data-id') + '"><img src="' + datas.eq(i).attr('src') + '" width="' + datas.eq(i).attr('width') + '" height="' + datas.eq(i).attr('height') + '" data-id="' + datas.eq(i).attr('data-id') + '" /></div>');
				}
				var imgW, imgH;
				if (s.width() / s.height() > _option.data.width / _option.data.height) {
					imgW = s.width();
					imgH = _option.data.height * s.width() / _option.data.width;
				} else {
					imgW = _option.data.width * s.height() / _option.data.height;
					imgH = s.height();
				}
				s.wraper.append('<div class="swiper-slide swiper-no-swiping" id="slideImg' + _option.data.imgid + '"><img src="' + _option.data.file + '" width="' + imgW + '" height="' + imgH + '" data-id="' + _option.data.imgid + '" ></div>');
				
				s.swiper = new Swiper('.swiper-container', {
					noSwiping : true,
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev'
				});
				s.wraper.find('img').imgscale();
				$('.swiper-button-next,.swiper-button-prev').off('touchstart').on('touchstart', function(e) {
					if (e.originalEvent) e = e.originalEvent;
					e.stopPropagation();
					$(e.currentTarget).click(function(e) {
						e.stopPropagation();
					});
				});


			};
			s.updateSlider = function() {

				s.swiper = new Swiper('.swiper-container', {
					noSwiping : true,
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev'
				});

				s.find('.swiper-container').find('img').imgscale();
				$('.swiper-button-next,.swiper-button-prev').off('touchstart').on('touchstart', function(e) {
					if (e.originalEvent) e = e.originalEvent;
					e.stopPropagation();
					$(e.currentTarget).click(function(e) {
						e.stopPropagation();
					});
				});

			}

			if (_option.data != null && _option.data != '') {
				s.addImage(imgarray);
			} else {
				s.updateSlider();
			}

		})

	}
	$.fn.imgslidershow = function() {

		return this.each(function() {
			var s = $(this);

			var imgarray = s.find('.swiper-container').find('img');

			if (imgarray.length <= 0) {
				s.removeClass('slider-content');
				return;
			}

			s.swiper = new Swiper('.swiper-container', {
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				autoplay: 4000
			});
			if (imgarray.length == 1) {
				s.find('.swiper-slide').addClass('swiper-no-swiping');
			}
		})

	}

})(jQuery);
