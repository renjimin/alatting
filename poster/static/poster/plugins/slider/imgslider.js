(function () {
    'use strict';
    var swiper;
    var imgslider = function(container){
        if (!(this instanceof imgslider)) return new imgslider();
        var s = this;
        s.container = $(container);
        s.wraper = null;
        s.dragable = false;
        s.init = function(){
            var $swipercon = $('<div class="swiper-container"><div class="swiper-wrapper"></div></div>');
            $($swipercon).appendTo(s.container);
            swiper = new Swiper('.swiper-container');
            s.wraper = s.container.find('.swiper-wrapper');
        };
        s.addImage = function(data){
            if(this.container.find('img').length <= 0){
                this.init();
            }
            this.wraper.append('<div class="swiper-slide"><img src="'+data.file+'" /></div>');
            swiper.update();

            this.container.find('img').bind('touchstart', function (event) {
                event.preventDefault();
                s.imgTouchStart($(this),event);
            });

        };
        s.touches = {
            start_X: 0,
            start_Y: 0,
            current_X: 0,
            current_Y: 0,
            diff: 0
        };
        s.imgTouchStart = function(o,e){
            if (e.originalEvent) e = e.originalEvent;

            o.bind('touchmove', function (event) {
                event.preventDefault();
                s.imgTouchMove($(this),event);
            });
            o.bind('touchend', function (event) {
                event.preventDefault();
                s.imgTouchEnd($(this),event);
            });
        };
        s.imgTouchMove = function(o,e){
            if (e.originalEvent) e = e.originalEvent;
        }
        s.imgTouchEnd = function(o,e){
            if (e.originalEvent) e = e.originalEvent;
        }
    }
    window.imgslider = imgslider;
})();