var scaleIndex = 20;
var templateScale = $('.edit-body').width()/$('.yunye-template').width();

/*
*	适用于PC拖拽
*/
(function ($) {	
    $.fn.scaleable = function (options) {
		var dragEvent = {
			"flag":false,
			"target":null,
			"currentX":0,
			"currentY":0
		}
		var defaults_opt = {
			'left':'0',
			'top':'0',
			'width':'100',
			'height':'100',
			'tx':'0',
			'ty':'0',
			'cx':'0',
			'cy':'0',
			'currentAngle':'0'
		}

		return this.each(function () {			
			var s = this,opts = $.extend(defaults_opt,options);
			var o = $(s),
				b = o.find('.element-box'),/*拖拽对象*/
				r = o.find('.nbar-rotate'),/*旋转点*/
				editBtn = o.find('.nbar-edit'),/*编辑按钮*/
				ele = o.find('.element'),
				dragable=false,
				nbarse = o.find('.nbar-se'),/*右下角*/
				nbarne = o.find('.nbar-ne'),/*右上角*/
				nbarsw = o.find('.nbar-sw'),/*左下角*/
				nbarnw = o.find('.nbar-nw'),/*左上角*/
				nbarn = o.find('.nbar-n'),/*上*/
				nbars = o.find('.nbar-s'),/*下*/
				nbare = o.find('.nbar-e'),/*右*/
				nbarw = o.find('.nbar-w')/*左*/;
			initData();
			var defaults = {
				'dragElement':b,
				'scaling':1, /*页面缩放比例，页面缩放会导致拖动速度与鼠标移动不一致*/
				'start':null,
				'move':null,
				'end':null
			}
			
			function initData(){
				opts.left = o.css("left") == 'auto'? 0 : o.css("left"),
				opts.top = o.css("top") == 'auto'? 0 : o.css("top"),
				opts.width = ele.innerWidth() == 0 ? parseInt(ele.css('width')) : ele.innerWidth(),
				opts.height = ele.innerHeight() == 0 ? parseInt(ele.css('height')) : ele.innerHeight(),
				opts.cx = parseInt(opts.width)/2,/*计算圆心相对坐标*/
				opts.cy = parseInt(opts.height)/2,
				opts.currentAngle = o.attr('data-rotate') == null ? '0': o.attr('data-rotate');
			}
			/*
			* 拖动 element-box
			*/
			b.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'start':function(){
					$('.cnd-element').removeClass('actived');
					o.addClass('actived').css('z-index',scaleIndex++);
					var pannle = "";
					switch(o.data('type')){
						case 'systemimg': pannle = "sysimg_pannel";break;
						case 'button': pannle = "button_pannel";break;
						case 'text': pannle = "text_pannel";break;
						default:break;
					}
					Editor.require("hightClick").removeHighLigh();
					Editor.require("switchPannel").switchPannel(pannle);
				},
				'end':function(){

				}
			});
			/*
			* 旋转 nbar-rotate
			*/
			var mouseEvents = {
				'startX': 0,
				'startY': 0,
				'currentX': 0,
				'currentY': 0
			}
			r.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					var touch = e;
					mouseEvents.currentX = touch.pageX;
					mouseEvents.currentY = touch.pageY;

					var ex = mouseEvents.currentX - mouseEvents.startX;
					var ey = mouseEvents.currentY - mouseEvents.startY;

					var offsetX = o.offset().left;
					var offsetY = o.offset().top;
					var mouseX = touch.pageX - offsetX;/*计算出鼠标相对于画布顶点的位置,无pageX时用clientY + body.scrollTop - body.clientTop代替,可视区域y+body滚动条所走的距离-body的border-top,不用offsetX等属性的原因在于，鼠标会移出画布*/
					var mouseY = touch.pageY - offsetY;
					var ox = mouseX - opts.cx;/*cx,cy为圆心*/
					var oy = mouseY - opts.cy;
					var to = Math.abs( ox/oy );
					var angle = Math.atan( to )/( 2 * Math.PI ) * 360;/*鼠标相对于旋转中心的角度*/
					if( ox < 0 && oy < 0)/*相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系*/
					{
							angle = 360 - angle;
					}else if( ox < 0 && oy > 0)/*左下角,3象限*/
					{
							angle =  180 + angle;
					}else if( ox > 0 && oy < 0)/*右上角，1象限*/
					{
							angle = angle;
					}else if( ox > 0 && oy > 0)/*右下角，2象限*/
					{
							angle = 180 -  angle;
					}
					var offsetAngle = angle - parseInt(opts.currentAngle);

					o.css({'transform': 'rotate('+offsetAngle+'deg)','-webkit-transform': 'rotate('+offsetAngle+'deg)','-moz-transform': 'rotate('+offsetAngle+'deg)','-o-transform': 'rotate('+offsetAngle+'deg)','-ms-transform': 'rotate('+offsetAngle+'deg)'});
					
					o.attr('data-rotate',offsetAngle);
				},
				'end':function(e){

				}
			});
			/*
			* 右下角（缩放, 改变宽度和高度） nbar-se
			*/
			nbarse.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					mouseEvents.currentX = e.pageX;
					mouseEvents.currentY = e.pageY;

					var sx = (mouseEvents.currentX - mouseEvents.startX)/templateScale;
					var sy = (mouseEvents.currentY - mouseEvents.startY)/templateScale;

					if(sx > sy){
						sx = sy;/* 以小单位为准 */
					}
					var tox = parseInt(opts.width) + sx;/* 计算宽度 */
					var toy = parseInt(opts.height) * tox/parseInt(opts.width);/*计算高度，保持宽高比例不变*/

					ele.css({'width':tox+'px','height':toy+'px'});
				}
			});
			/*
			* 右上角（缩放, 放大时高度减少，宽度增加） nbar-ne
			*/
			nbarne.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					mouseEvents.currentX = e.pageX;
					mouseEvents.currentY = e.pageY;

					var sx = mouseEvents.currentX - mouseEvents.startX;
					var sy = mouseEvents.currentY - mouseEvents.startY;
					
					var tox = parseInt(opts.width) + sx; /* 计算宽度 */
					var toy = parseInt(opts.height) * tox/parseInt(opts.width);/*计算高度，保持宽高比例不变,这里以x轴坐标为准*/
					if(tox < 0) return;
					ele.css({'width':tox+'px','height':toy+'px'});
					o.css('top', parseInt(opts.top) - toy + parseInt(opts.height) + 'px');/* 以底线为基准向右上方缩放 */
				}
			});
			/*
			* 左下角（缩放, 改变宽度和高度） nbar-sw
			*/
			nbarsw.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					mouseEvents.currentX = e.pageX;
					mouseEvents.currentY = e.pageY;

					var sx = mouseEvents.currentX - mouseEvents.startX;
					var sy = mouseEvents.currentY - mouseEvents.startY;

					var tox = parseInt(opts.width) - sx; /* 计算宽度 */
					var toy = parseInt(opts.height) * tox/parseInt(opts.width);/*计算高度，保持宽高比例不变,这里以x轴坐标为准*/
					if(tox < 0) return;
					ele.css({'width':tox+'px','height':toy+'px'});
					o.css('left', parseInt(opts.left) + sx + 'px');/* 以底线为基准向右上方缩放 */
				}
			});
			/*
			* 左上角（缩放, 改变宽度和高度） nbar-nw
			*/
			nbarnw.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					mouseEvents.currentX = e.pageX;
					mouseEvents.currentY = e.pageY;

					var sx = (mouseEvents.currentX - mouseEvents.startX)/templateScale;
					var sy = (mouseEvents.currentY - mouseEvents.startY)/templateScale;

					var tox = parseInt(opts.width) - sx; /* 计算宽度 */
					var toy = parseInt(opts.height) * tox/parseInt(opts.width);/*计算高度，保持宽高比例不变,这里以x轴坐标为准*/
					if(tox < 0) return;
					ele.css({'width':tox+'px','height':toy+'px'});
					o.css({'top':parseInt(opts.top) - toy + parseInt(opts.height) + 'px','left': parseInt(opts.left) + sx + 'px'});/* 以底线为基准向zuo上方缩放 */
				}
			});
			/*
			* 右（宽度） nbar-e
			*/
			nbare.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					mouseEvents.currentX = e.pageX;
					mouseEvents.currentY = e.pageY;
					var sx = (mouseEvents.currentX - mouseEvents.startX)/templateScale;
					var tox = parseInt(opts.width) + sx;
					ele.css({'width':tox+'px'});
				}
			});
			/*
			* 下（高度） nbar-s
			*/
			nbars.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					mouseEvents.currentX = e.pageX;
					mouseEvents.currentY = e.pageY;
					var sy = mouseEvents.currentY - mouseEvents.startY;
					var toy = parseInt(opts.height) + sy;
					ele.css({'height':toy+'px'});
				}
			});
			/*
			* 左（宽度） nbar-w
			*/
			nbarw.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					mouseEvents.currentX = e.pageX;
					mouseEvents.currentY = e.pageY;
					var sx = mouseEvents.currentX - mouseEvents.startX;
					var tox = parseInt(opts.width) - sx;
					if(tox >= 0){
						ele.css({'width':tox+'px'});
						o.css({'left':parseInt(opts.left)+sx+'px'});
					}
				}
			});
			/*
			* 上（高度） nbar-n
			*/
			nbarn.dragable({
				'dragElement':o,
				'scaling':templateScale,
				'moveable':false,
				'start':function(e){
					mouseEvents.startX = e.pageX;
					mouseEvents.startY = e.pageY;
					initData();
				},
				'move':function(e){
					mouseEvents.currentX = e.pageX;
					mouseEvents.currentY = e.pageY;
					var sy = mouseEvents.currentY - mouseEvents.startY;
					var toy = parseInt(opts.height) - sy;
					if(toy >= 0){
						ele.css({'height':toy+'px'});
						o.css({'top':parseInt(opts.top)+sy+'px'});
					}
				}
			});
			

		})	
		
		

	}	

})(jQuery);

