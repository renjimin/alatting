$(function(){
    $('.slider-content').imgslidershow();

    var templateScale = $('body').width()/$('.yunye-template').width();
    var templateScale = $('body').width()/$('.yunye-template').width();
    var templateScaleOpt =
        '-webkit-transform:scale('+templateScale+','+templateScale+');'
       +   '-moz-transform:scale('+templateScale+','+templateScale+');'
       +     '-o-transform:scale('+templateScale+','+templateScale+');'
       +    '-ms-transform:scale('+templateScale+','+templateScale+');'
       +        'transform:scale('+templateScale+','+templateScale+');'
    var templateBox = $('<div class="template-box"></div>')
    $('.yunye-template').parent().append(templateBox);
    templateBox.append($('.yunye-template'));
    $('.yunye-template').attr('style',templateScaleOpt);
    $('.template-box').height($('.yunye-template').height()*templateScale);
});
