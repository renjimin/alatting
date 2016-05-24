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

    $('.yunye-template').attr('style',templateScaleOpt);
});
