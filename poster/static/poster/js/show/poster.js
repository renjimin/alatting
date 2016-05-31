$(function(){
		$('.slider-content').imgslidershow();

		var templateScale = $('body').width()/$('.yunye-template').width();
		
				 var templateScaleOpt ='-webkit-transform:scale('+templateScale+','+templateScale+');'
					 +   '-moz-transform:scale('+templateScale+','+templateScale+');'
					 +     '-o-transform:scale('+templateScale+','+templateScale+');'
					 +    '-ms-transform:scale('+templateScale+','+templateScale+');'
					 +        'transform:scale('+templateScale+','+templateScale+');';
					 if($('.template-box').length <= 0){
								var templateBox = $('<div class="template-box"></div>');
								$('.yunye-template').parent().append(templateBox);
								templateBox.append($('.yunye-template'));
					 }
				
				$('.yunye-template').attr('style',templateScaleOpt);
				$('.template-box').height($('.yunye-template').height()*templateScale).css({'min-height':$(window).height() - 84 - $('.header').height()+'px'});
				
		window.onresize = function(){
				 var templateScale = $('body').width()/$('.yunye-template').width();
				 var templateScaleOpt ='-webkit-transform:scale('+templateScale+','+templateScale+');'
					 +   '-moz-transform:scale('+templateScale+','+templateScale+');'
					 +     '-o-transform:scale('+templateScale+','+templateScale+');'
					 +    '-ms-transform:scale('+templateScale+','+templateScale+');'
					 +        'transform:scale('+templateScale+','+templateScale+');';
					 if($('.template-box').length <= 0){
								var templateBox = $('<div class="template-box"></div>');
								$('.yunye-template').parent().append(templateBox);
					 }
				
				$('.yunye-template').attr('style',templateScaleOpt);
				$('.template-box').height($('.yunye-template').height()*templateScale).css({'min-height':$(window).height() - 84 - $('.header').height()+'px'});
		};

		$('div.swiper-slide').magnificPopup({
				delegate: 'img',
				type: 'image',
				gallery: {
						enabled: true,
						tCounter: ""
				},
				callbacks: {
						elementParse: function (item) {
								item.src = item.el.attr('src');
						}
				}
		});
});
function posterDetail(){
	return true;
}
function posterOrder(){
	return true;
}