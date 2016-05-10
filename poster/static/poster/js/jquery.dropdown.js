(function ($) { 
	$.fn.registerDropDown = function(options){
		var opts = {
			position:"top"
		}; 					  
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
						_this.addClass('open');
						a.addClass('open');
					}
				}else{
					$('#dp').attr('class', '');
					if($('#dp').hasClass('open')){
						$('#dp').removeClass('open');
					}else{
						$('#dp').empty();
						var str = '';
						for(var i in _option.content){
							str += '<li>'+_option.content[i]+'</li>';
						}
						$('#dp').append(str);
						var offsetY = parseInt(_option.offsetYPercent.split('%')[0]) * _this.height() / 100 + parseInt(_option.offsetY);
						$('#dp').css('top',_this.offset().top + offsetY);
						var arrow = $('<span class="arrow"></span>');
						var arrOffset = parseInt(_option.arrowOffset.split('%')[0]) * $('#dp').width() / 100;
						arrow.css('left', $('#dp').position().left + arrOffset );
						arrow.appendTo($('#dp'));

						$('#dp').addClass(_option.dynamicClass);
						$('#dp').addClass('open');
					}
					
				}
			});
			$('body').on('click',function(event){
				var target = $(event.target);
				if(target.closest(".dropdown-panel",a).length == 0 && target.closest('#'+pid).length == 0){
					a.removeClass('open');
				}				
			});
		})
	}	
})(jQuery);