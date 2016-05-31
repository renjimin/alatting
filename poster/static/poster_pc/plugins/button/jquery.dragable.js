/*
*	适用于PC拖拽
*/
(function ($) {	
    $.fn.dragable = function (options) {
		var dragEvent = {
			"flag":false,
			"target":null,
			"currentX":0,
			"currentY":0
		}

		return this.each(function () {			
			var s = $(this);
			var defaults = {
				'dragElement':s,
				'scaling':1, /*页面缩放比例，页面缩放会导致拖动速度与鼠标移动不一致*/
				'start':null,
				'move':null,
				'end':null
			}
			var opts = $.extend(defaults,options);
			opts.dragElement.bind("mousedown", function(e){
				dragEvent.target = opts.dragElement;
				if(event.type == 'mousedown') {
					dragEvent.flag=true;
					var currentLeft = dragEvent.target.css("left") == 'auto'? 0 : dragEvent.target.css("left"),
						currentTop = dragEvent.target.css("top") == 'auto'? 0 : dragEvent.target.css("top");
					dragEvent.currentX = e.pageX/opts.scaling - parseInt(currentLeft);
					dragEvent.currentY = e.pageY/opts.scaling - parseInt(currentTop);
					s.fadeTo(20,0.5);//点击后开始拖动并透明

					if(opts.start){						
						opts.start();
					}
				}
			});
			$(document).mousemove(function(e){
				if(dragEvent.flag){
					//画出新坐标
					var endX = e.pageX/opts.scaling-dragEvent.currentX,
						endY = e.pageY/opts.scaling-dragEvent.currentY;
					dragEvent.target.css({top:endY,left:endX});
					if(opts.move){						
						opts.move();
					}
				}
			}).mouseup(function(){
				dragEvent.flag=false;
				dragEvent.target.fadeTo("fast",1);//松开鼠标后停止移动并恢复成不透明
				if(opts.start){						
					opts.end();
				}
			});
		})	
		
		
	}	

})(jQuery);