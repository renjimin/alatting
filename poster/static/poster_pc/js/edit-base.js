var fullcontainer = $('.yunye-template');
$(function(){	
	templateScaleInit();
	fullcontainer = $('.yunye-template');
})

function templateScaleInit(){
	var tempScale = $('.edit-body').width()/$('.yunye-template').width();
	 var templateScaleOpt ='-webkit-transform:scale('+tempScale+','+tempScale+');'
		 +   '-moz-transform:scale('+tempScale+','+tempScale+');'
		 +     '-o-transform:scale('+tempScale+','+tempScale+');'
		 +    '-ms-transform:scale('+tempScale+','+tempScale+');'
		 +        'transform:scale('+tempScale+','+tempScale+');';
		 if($('.template-box').length <= 0){
					var templateBox = $('<div class="template-box"></div>');
					$('.yunye-template').parent().append(templateBox);
					templateBox.append($('.yunye-template'));
		 }
	
	$('.yunye-template').attr('style',templateScaleOpt);
	$('.template-box').height($('.yunye-template').height()*tempScale).css({'min-height':$('.edit-body').height() - 84 - $('.header').height()+'px'});
}



var bindEvents = function(obj,options){
	var defaults = {
		'start':null,
		'move':null,
		'end':null
	}

	//Define Touch Events
	var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
	if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
	else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
	var  isSurpotTouch = 'ontouchend' in document;
	var touchEvent = {
		start : isSurpotTouch ? 'touchstart' : desktopEvents[0],
		move : isSurpotTouch ? 'touchmove' : desktopEvents[1],
		end : isSurpotTouch ? 'touchend' : desktopEvents[2]
	};
	/*==================================================
        Browser
        ====================================================*/
        var browser = {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1)
        };

	var touchEventsTarget = obj,opts = $.extend(defaults,options),s=this;

	// Attach/detach events
        s.initEvents = function (detach) {
            var actionDom = detach ? 'off' : 'on';
            var action = detach ? 'removeEventListener' : 'addEventListener';
           
            var target = isSurpotTouch ? touchEventsTarget : document;

            var moveCapture = true;
            touchEventsTarget[action]('mousedown', opts.start, false);
            touchEventsTarget[action]('mousemove', opts.move, moveCapture);
            touchEventsTarget[action]('mouseup', opts.end, false);

            //Touch Events
            /*if (browser.ie) {
                touchEventsTarget[action](touchEvent.start, opts.start, false);
                target[action](touchEvent.move, opts.move, moveCapture);
                target[action](touchEvent.end, opts.end, false);
            }
            else {
                if (isSurpotTouch) {
                    touchEventsTarget[action](touchEvent.start, opts.start, false);
                    touchEventsTarget[action](touchEvent.move, opts.move, moveCapture);
                    touchEventsTarget[action](touchEvent.end, opts.end, false);
                }
                else {
                    touchEventsTarget[action]('mousedown', opts.start, false);
                    document[action]('mousemove', opts.move, moveCapture);
                    document[action]('mouseup', opts.end, false);
                }
            }         */


       };

       s.initEvents();
}