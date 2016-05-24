$(function(){
    $('.slider-content').imgslidershow();

    var templateScale = $('body').width()/$('.yunye-template').width();
    $('.yunye-template').css({'transform':'scale('+templateScale+','+templateScale+')'});
});
