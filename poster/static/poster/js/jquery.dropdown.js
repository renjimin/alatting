(function ($) {
	$.fn.registerDropDown = function(options){
		var opts = {
			offsetXPercent:0,
			offsetX:0,
			offsetYPercent:0,
			offsetY:0,
			arrowOffset:0,
			dynamicClass:'',
			position:"top"
		};
		window.clickItmList = window.clickItmList || ["#dp"];
		window.clickItmList.push(this.selector);
		return this.each(function () {
			var _this = $(this),
				_option = $.extend(opts,options),
				id = _this.data('dropdown'),
				a=$('#'+id),
				pid = _this.attr('id');
			
			_this.on('click',function(event){
				if(options == null){
					if(a.hasClass('open')){
						_this.removeClass('open');
						a.removeClass('open');
					}else{
						$('.dropdown-panel').removeClass('open');
						$('.dropdown-toggle').removeClass('open');
						_this.addClass('open');
						a.addClass('open');
					}
				}else{
					var dpw = $('#dp');
					if(dpw.hasClass('open') && $('#'+_option.id).is(':visible') ){
						dpw.attr('class', '')
						dpw.removeClass('open');
					}else{
						dpw.attr('class', '')
						dpw.attr('style', '')
						$('#dp ul').hide();
						$('#'+_option.id).show();
						dpw.addClass(_option.dynamicClass);
						dpw.addClass('open');

						var offsetY = _option.offsetYPercent * _this.height() / 100 + parseInt(_option.offsetY);
						dpw.css('top',_this.offset().top + offsetY);
						if(_option.offsetXPercent != 0 || _option.offsetX != 0){
							var offsetX = _option.offsetXPercent * _this.width() / 100 + parseInt(_option.offsetX) - dpw.width()/2;
							dpw.css('left',_this.offset().left + offsetX);
						}
						var arrOffset = _option.arrowOffset * dpw.width() / 100 - 10;
						$('#dp .arrow').css('left', arrOffset );
					}
				}
			});
		})
	}
})(jQuery);