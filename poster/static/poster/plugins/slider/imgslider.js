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
                imgarray.push({'file':imgs.eq(i).attr('src'),'width':imgs.eq(i).attr('width'),'height':imgs.eq(i).attr('height')});
            }

            s.empty();
            var $swipercon = '<div class="swiper-container"><div class="swiper-wrapper"></div></div>';
            s.html($swipercon);

            s.addImage = function(datas){
                s.wraper = s.find('.swiper-wrapper');
                for(i=0;datas.length>0 && i<datas.length;i++){

                    s.wraper.append('<div class="swiper-slide"><img src="'+datas[i].file+'" width="'+datas[i].width+'" height="'+datas[i].height+'" /></div>');
                }
                console.log(_option.data);
                var imgW,imgH;
                if(s.width()/s.height() > _option.data.width / _option.data.height){
                    imgW = s.width();
                    imgH = _option.data.height * imgW / _option.data.width;
                }else{
                    imgW = _option.data.width * imgH / _option.data.height;
                    imgH = s.height();
                }
                s.wraper.append('<div class="swiper-slide"><img src="'+_option.data.file+'" width="'+imgW+'" height="'+imgH+'" ></div>');
                s.swiper = new Swiper('.swiper-container');

            };
            if(_option.data != null && _option.data != ''){
                s.addImage(imgarray);
            }
        })

    }
})(jQuery);
