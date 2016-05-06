(function ($) { 
	$.fn.dropdown = function(options){
		var opts = {
			position:"top"
		}; 					  
		var ops = $.extend(opts,options);
		return this.each(function () {
			var _this = $(this),id = _this.data('dropdown'),a=$('#'+id),pid = _this.attr('id');
			var arrow = $('<span class="dropdown-arrow-down"></span>');
			arrow.css({'left':_this.position().left+_this.width()/2+'px'})
			arrow.appendTo(a);
　　　　　	_this.on('click',function(event){
				if(a.hasClass('open')){
					a.removeClass('open');
				}else{
					a.addClass('open');
				}
			});
			a.on('click',function(event){
				event.stopPropagation();
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
 





