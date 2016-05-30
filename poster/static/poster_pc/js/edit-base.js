$(function(){
	
	templateScaleInit();
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