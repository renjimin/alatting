$(function(){
    $('.slider-content').imgslidershow();

    var templateScale = $('body').width()/$('.yunye-template').width();
    var templateScale = $('body').width()/$('.yunye-template').width();
    
    templateScaleFun();
    window.onresize = function(){
        templateScaleFun();
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
