(function ($) {
	$.fn.registerDropDown = function(options){
		var opts = {
			offsetXPercent:0,
			offsetX:0,
			offsetYPercent:0,
			offsetY:0,
			arrowOffset:0,
			dynamicClass:'',
			eval:'',
			position:"top"
		};
		return this.each(function () {
			var _this = $(this),
				_option = $.extend(opts,options),
				id = _this.data('dropdown'),
				a=$('#'+id),
				pid = _this.attr('id');
			
			_this.on('click',function(event){
				$(document).trigger("clsdp");
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
						dpw.attr('class', '').removeClass('open');
					}else{
						dpw.attr('class', '').attr('style', '');
						$('#dp ul').hide();
						$('#'+_option.id).show();
						dpw.addClass(_option.dynamicClass).addClass('open');

						var offsetY =  _option.offsetYPercent * _this.height() / 100 + parseInt(_option.offsetY) - $('.container-fluid').offset().top;
						dpw.css('top',_this.offset().top + offsetY);
						if(_option.offsetXPercent != 0 || _option.offsetX != 0){
							var offsetX = _option.offsetXPercent * _this.width() / 100 + parseInt(_option.offsetX) - dpw.width()/2;
							dpw.css('left',_this.offset().left + offsetX);
						}
						var arrOffset = (_this.offset().left - dpw.offset().left) + _this.width()/2 -15 ;
						$('#dp .arrow').css('top',-30);
						$('#dp .arrow').css('left', arrOffset );
						$('#dp .arrow').attr('class', 'arrow up')
						//第一个input自动获取焦点
						$('#'+_option.id + ' input[type="text"]').focusEnd();
						//执行自定义行为
						if(_option.eval){
							eval(_option.eval);
						}
					}
				}
				event.stopPropagation();
			});
		})
	}
	$.fn.registerPopUp = function(options){
		var opts = {
			list:[],
			offsetXPercent:50,
			offsetX:0,
			offsetYPercent:0,
			offsetY:0,
			arrowOffset:0,
			orientation:0
		};
		return this.each(function () {
			var _this = $(this),
				_option = $.extend(opts,options),
				id = _this.data('dropdown'),
				a=$('#'+id),
				pid = _this.attr('id'),
				dpw = $('#dp');

			var str = '<ul id="'+ _option.id +'">'
			if(_option.orientation){
				var len = _option.list.length;
				for(var i in _option.list){
					str += '<li id="'+ (_option.id+'_'+(len - i -1)) +'"><i class="'+_option.list[len - i -1].icon+'"></i><span>'+_option.list[len - i -1].text+'</span>'
				}
			}else{
				for(var i in _option.list){
					str += '<li id="'+ (_option.id+'_'+i) +'"><i class="'+_option.list[i].icon+'"></i><span>'+_option.list[i].text+'</span>'
				}
			}
			str += '</ul>'
			dpw.append(str);
			for(var i in _option.list){
				$("#dp #" + _option.id+'_'+i ).click(function(event){
						var l = event.currentTarget.id.split('_');
						var cb = _option.list[l[l.length-1]].callback;
						if(cb){
							$('#dp').removeClass('open');
							cb();
						}
					});
			}
			_this.on('click',function(event){
				if(dpw.hasClass('open') && $('#'+_option.id).is(':visible') ){
					dpw.attr('class', '').removeClass('open');
				}else{
					dpw.attr('class', '').attr('style', '')
					$('#dp ul').hide();
					$('#'+_option.id).show();
					dpw.addClass('popUp').addClass('open');

					if(_option.orientation){
						var offsetY =  _this.height() - dpw.height() - _option.offsetYPercent * _this.height() / 100 - parseInt(_option.offsetY) - $('.container-fluid').offset().top;
					}else{
						var offsetY = _option.offsetYPercent * _this.height() / 100 + parseInt(_option.offsetY) - $('.container-fluid').offset().top;
					}
					dpw.css('top',_this.offset().top + offsetY);

					var left = _this.offset().left + (_this.width() * _option.offsetXPercent )/100 + _option.offsetX - dpw.width()/2,
						right = left + dpw.width(),
						documentW = $(document.body).width();
					if( right > documentW ){
						left = documentW - dpw.width() -5;
						dpw.css('left',left);
					}else if( left < 0){
						dpw.css('left',5);
					}else{
						dpw.css('left',left);
					}
					if(_option.arrowOffset){
						$('#dp .arrow').css('left', (dpw.width() * _option.arrowOffset)/100 -15  );
					}else{
						$('#dp .arrow').css('left', _this.offset().left - dpw.offset().left + _this.width()/2 -15  );
					}
					if(_option.orientation){
						$('#dp .arrow').css('top', dpw.height() - 2 );
						$('#dp .arrow').attr('class', 'arrow down')
					}else{
						$('#dp .arrow').css('top',-30);
						$('#dp .arrow').attr('class', 'arrow up')
					}
				}
				event.stopPropagation();
			});
		})
	}
})(jQuery);

(function($){
	$.fn.setCursorPosition = function(position) {
		if (this.lengh == 0) return this;
		return $(this).setSelection(position, position);
	}
	$.fn.setSelection = function(selectionStart, selectionEnd) {
		if (this.lengh == 0) return this;
		input = this[0];
		if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		} else if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}
		return this;
	}
	$.fn.focusEnd = function() {
		if (!this.lengh) return this;
		this.setCursorPosition(this.val().length);
	}
})(jQuery);