(function() {
	$.fn.imgoperation = function(options) {
		var opts = {
			'data': null
		};

		return this.each(function() {
			_option = $.extend(opts, options);
			var s = $(this),
				i = s.find("img[class!='video-play']").eq(0),
				v = s.find('video');

			var imgW, imgH, ow, oh;
			if (_option.data == null) {
				ow = i.width();
				oh = i.height();
			} else if (_option.data.width == undefined) {
				ow = s.width();
				oh = s.height();
			} else {
				ow = _option.data.width;
				oh = _option.data.height;
			}
			oh = i.height();

			if (s.width() / s.height() >= ow / oh) {
				imgW = s.width();
				imgH = oh * imgW / ow;
			} else {
				imgH = s.height();
				imgW = ow * imgH / oh;

			}

			i.attr("width", imgW);
			i.attr("height", imgH);

			v.attr("width", imgW);
			v.attr("height", imgH);

			var touchEvents = {
				'startX': 0,
				'startY': 0,
				'currentX': 0,
				'currentY': 0
			}
			var moveX = 0,
				moveY = 0;

			s.opt = {};
			var startDiagonal = {
					'x': 0,
					'y': 0
				},
				endDiagonal = {
					'x': 0,
					'y': 0
				};

			i.css({
				'position': 'relative',
				'top': '0',
				'left': '0'
			});

			var moveX,moveY;
			i.dragable({
				'start':function(e){

					var imgl = i.css('left') == undefined ? 0 : i.css('left');
					var imgt = i.css('top') == undefined ? 0 : i.css('top');
					moveX = parseInt(imgl);
					moveY = parseInt(imgt);


				},

				'end':function(e){

					var moveEndX = i.css('left') == undefined ? 0 : i.css('left');
					var moveEndY = i.css('top') == undefined ? 0 : i.css('top');
					var endX = moveEndX,
						endY = moveEndY;

					var endW = i.width(),
						endH = i.height();


					if (parseInt(moveEndX) > 0) {/* 左部 >0*/
						endX = 0;
					}

					if (endW + parseInt(moveEndX) < s.width()) {
						endX = -endW + s.width();

					}

					if (parseInt(moveEndY) > 0) {/* 顶部 >0*/
						endY = 0;
					}
					if (endH + parseInt(moveEndY) < s.height()) {
						endY = -endH + s.height();

					}

					i.css('top', endY + 'px');
					i.css('left', endX + 'px');


				}
			});
		})

	}
	$.fn.imgoperationlogo = function(options) {
		var opts = {
			'data': null
		};
		return this.each(function() {
			_option = $.extend(opts, options);
			var s = $(this),
				i = s.find("img[class!='video-play']").eq(0),
				v = s.find('video');

			var imgW, imgH, ow, oh;
			if (_option.data == null) {
				ow = i.width();
				oh = i.height();
			} else if (_option.data.width == undefined) {
				ow = s.width();
				oh = s.height();
			} else {
				ow = _option.data.width;
				oh = _option.data.height;
			}
			oh = i.height();

			if (s.width() / s.height() >= ow / oh) {
				imgH = s.height();
				imgW = ow * imgH / oh;				
			} else {
				imgW = s.width();
				imgH = oh * imgW / ow;
			}

			i.attr("width", imgW);
			i.attr("height", imgH);

			v.attr("width", imgW);
			v.attr("height", imgH);

			var touchEvents = {
				'startX': 0,
				'startY': 0,
				'currentX': 0,
				'currentY': 0
			}
			var moveX = 0,
				moveY = 0;
			s.opt = {};
			i.css({
				'position': 'relative'
			});
			i.dragable({
				'start':function(e){
					var imgl = i.css('left') == undefined ? 0 : i.css('left');
					var imgt = i.css('top') == undefined ? 0 : i.css('top');
					moveX = parseInt(imgl);
					moveY = parseInt(imgt);
				},
				'end':function(e){

					var moveEndX = i.css('left') == undefined ? 0 : i.css('left');
					var moveEndY = i.css('top') == undefined ? 0 : i.css('top');
					var endX = moveEndX,
						endY = moveEndY;

					var endW = i.width(),
						endH = i.height();

					if(parseInt(moveEndX) + s.width()/2 - endW/2 < 0){
						endX = endW/2 - s.width()/2;
					}
					if(parseInt(moveEndX) - s.width()/2 + endW/2 > 0){
						endX = s.width()/2 - endW/2;
					}
					if(parseInt(moveEndY) + s.height()/2 - endH/2 < 0){
						endY = endH/2 - s.height()/2;
					}
					if(parseInt(moveEndY) - s.height()/2 + endH/2 > 0){
						endY = s.height()/2 - endH/2;
					}

					i.css('top', endY + 'px');
					i.css('left', endX + 'px');


				}
			});
		})
	}

})(jQuery)