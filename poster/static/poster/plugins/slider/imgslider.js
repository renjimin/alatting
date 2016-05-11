(function ($) {
    $.fn.imgslider = function(opations){
        var opts = {
            'data':null
        };
        return this.each(function () {
            var s = $(this),
				_option = $.extend(opts,opations);
            var imgarray = [];

            $.extend(s,{'wraper':null,'swiper':null});

            var imgs  =s.find('img');
            for(i = 0 ; imgs.length > 0 && i<imgs.length ; i++){
                imgarray.push({'file':imgs.attr('src')});
            }

            s.empty();
            var $swipercon = '<div class="swiper-container"><div class="swiper-wrapper"></div></div>';
            s.html($swipercon);

            s.addImage = function(datas){
                s.wraper = s.find('.swiper-wrapper');
                for(i=0;datas.length>0 && i<datas.length;i++){
                    s.wraper.append('<div class="swiper-slide"><img src="'+datas[i].file+'" /></div>');
                }
                s.wraper.append('<div class="swiper-slide"><img src="'+_option.data.file+'" /></div>');

                s.swiper = new Swiper('.swiper-container');

            };
            if(_option.data != null && _option.data != ''){
                s.addImage(imgarray);
            }
        })

    }
})(jQuery);