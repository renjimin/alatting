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
				if(!options){
			  $('#dp').hide();
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
						$('#dp ul').css("visibility","hidden");
					}else{
						dpw.attr('class', '').attr('style', '');
						$('#dp ul').hide();
						$('#'+_option.id).css("visibility","visible");
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
						//$('#'+_option.id + ' input[type="text"]').focusEnd();
						//执行自定义行为
						if(_option.eval){
							eval(_option.eval);
						}
					}
				}
				event.stopPropagation();
			});
		})
	};
	$.fn.registerPopUp = function(options){
		var opts = {
			list:[],
			offsetXPercent:50,
			offsetX:0,
			offsetYPercent:50,
			offsetY:0,
			arrowOffset:0,
			orientation:0,
			followMouse:false,
			suspendFun: null
		};
		return this.each(function () {
			var _this = $(this),
				_option = $.extend(opts,options),
				pid = _this.attr('id'),
				dpw = $('#dp');

			var str = '<ul id="'+ _option.id +'">';
			for(var i in _option.list){
				str += '<li id="'+ (_option.id+'_'+i) +'"><i class="'+_option.list[i].icon+'"></i><span>'+_option.list[i].text+'</span>'
			}
			str += '</ul>';
			dpw.append(str);
			for(var i in _option.list){
				$("#dp #" + _option.id+'_'+i ).click(function(event){
					var l = event.currentTarget.id.split('_');
					var cb = _option.list[l[l.length-1]].callback;
					if(cb){
						$('#dp').removeClass('open');
						$('#dp ul').css("visibility","hidden");
						cb(_this);
					}
				});
			}
			_this.on('click',function(event){
				if(_option.suspendFun !== null && $.isFunction(_option.suspendFun)){
					if(!_option.suspendFun())return false;
				}
				$(document).trigger("clsdp");
				if(dpw.hasClass('open') && $('#'+_option.id).is(':visible') ){
					dpw.attr('class', '').removeClass('open');
					$('#dp ul').css("visibility","hidden");
				}else{
					dpw.attr('class', '').attr('style', '');
					$('#dp ul').hide();
					$('#'+_option.id).css("visibility","visible");
					$('#'+_option.id).show();
					dpw.addClass('popUp').addClass('open');
					var diffY,offsetY,left,right,originX,originY,documentW = $(document.body).width(),documentH = $(document.body).height();
					if(_option.followMouse){
						originX = event.pageX,originY = event.pageY,diffY = 10,diffX = 0;
						left = originX - dpw.width()/2;
					}else{
						originX = _this.offset().left,
						originY = _this.offset().top,
						diffY = _option.offsetYPercent * _this.height() / 100 + parseInt(_option.offsetY) ,
						diffX =  (_this.width() * _option.offsetXPercent )/100 + _option.offsetX;
						left = originX + diffX - dpw.width()/2;
					}
					right = left + dpw.width();
					offsetY =  diffY;
					dpw.css('top',originY + offsetY - $('.container-fluid').offset().top);
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
						$('#dp .arrow').css('left', dpw.width()/2 -15  );
					}
					if( $("#dp").height() + $("#dp").offset().top > documentH){
						$('#dp .arrow').css('top', dpw.height() - 2 ).attr('class', 'arrow down')
						offsetY = _this.height() - diffY - dpw.height();
						dpw.css('top',originY + offsetY - $('.container-fluid').offset().top);
						$('#dp .arrow').css('top', dpw.height() - 2 ).attr('class', 'arrow down');
						var str="",len = _option.list.length;
						for(var i in _option.list){
							str += '<li id="'+ (_option.id+'_'+(len - i -1)) +'"><i class="'+_option.list[len - i -1].icon+'"></i><span>'+_option.list[len - i -1].text+'</span>'
						}
						$("#dp #"+_option.id).empty().append(str);
					}else{
						$('#dp .arrow').css('top',-30).attr('class', 'arrow up')
					}
				}
				event.stopPropagation();
			});
		})
	}
})(jQuery);

(function($){
	$.fn.setCursorPosition = function(position) {
		if (this.length == 0) return this;
		return $(this).setSelection(position, position);
	};
	$.fn.setSelection = function(selectionStart, selectionEnd) {
		if (this.length == 0) return this;
		var input = this[0];
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
	};
	$.fn.focusEnd = function() {
		if (!this[0]) return this;
		this.setCursorPosition(this.val().length);
	};
})(jQuery);