(function ($) {

    $.fn.imgshow = function () {
        var activeIndex = 0,
            currentImgBox
            var datas = {
                'title':'',
                'img':null,
                'phone':'',
                'email':'',
                'address':'',
                'worktime':'',
                'src':''
            };
        return this.each(function(){
            var s = $(this);

            s.initShow = function(){
                var imgshowbox = $('<div class="imgshow-dialog">\
                                	<div class="imgshow-body">\
                                		<a href="javascript:void(0);" class="close"></a>\
                                		<a href="javascript:void(0);" class="t-left"></a>\
                                		<a href="javascript:void(0);" class="t-right"></a>\
                                		<div class="imgshow-container">\
                                			<div class="imgshow-txt">\
                                				<h3 class="title"></h3>\
                                				<ul class="imgshow-infolist">\
                                					<li class="phone">\
                                					</li>\
                                					<li class="email">\
                                					</li>\
                                					<li class="address">\
                                					</li>\
                                					<li class="worktime">\
                                					</li>\
                                				</ul>\
                                			</div>\
                                			<div class="imgshow-img">\
                                                 <iframe src="/mobile/posters/54/" width="100%" height="100%" frameborder="no" border="0">\
                                                </iframe>\
                                			</div>\
                                		</div>\
                                	</div>\
                                </div>');
                $('body').append(imgshowbox);
                $('.imgshow-dialog .close').on('click',function(){
                    s.close();
                });
                $('.imgshow-dialog .t-left').on('click',function(){
                    s.viewPrev();
                });
                $('.imgshow-dialog .t-right').on('click',function(){
                    s.viewNext();
                });
            }
            s.initData = function(data){
                $('.imgshow-dialog').find('.title').html(data.title);
                $('.imgshow-dialog').find('.phone').html(data.phone);
                $('.imgshow-dialog').find('.email').html(data.email);
                $('.imgshow-dialog').find('.address').html(data.address);
                $('.imgshow-dialog').find('.worktime').html(data.worktime);
                $('.imgshow-dialog').find('iframe').attr('src',data.src);

                /*var img = data.img.clone();
                if(img.attr('src') == ''){
                    img.attr('src',img.attr('data-src'));
                }
                $('.imgshow-dialog').find('.imgshow-img').html(img);
                */
            }
            s.on('click',function(e){
                if($('.imgshow-dialog').length <= 0){
                    s.initShow();
                }
                currentImgBox = s;
                datas = {
                    'title':s.find('.type').text(),
                    'img':s.find('.img').find('img'),
                    'phone':s.find('.phone').text(),
                    'email':s.find('.email').text(),
                    'address':s.find('.address').text(),
                    'worktime':s.find('.worktime').text()
                }
                s.initData(datas);
                s.open();

            });
            s.open = function(){
                $('.imgshow-dialog').css({
                    'height':$(window).height() - $('.header').height(),
                    'top':$('.header').height(),
                    'padding':'0'
                });
                $('.imgshow-dialog').addClass('open');
            }
            s.close = function(){
                $('.imgshow-dialog').removeClass('open');
            }
            s.viewNext = function(){

                if(currentImgBox.next().length <= 0){
                    alert('已经是最后一张');
                    return;
                }
                currentImgBox = currentImgBox.next();

                datas.title = currentImgBox.find('.type').text();
                datas.img = currentImgBox.find('.img').find('img');
                datas.phone = currentImgBox.find('.phone').text();
                datas.email = currentImgBox.find('.email').text();
                datas.address = currentImgBox.find('.address').text();
                datas.worktime = currentImgBox.find('.worktime').text();
                datas.src = currentImgBox.find('.img').find('a').attr('data-src');

                $('.imgshow-dialog .imgshow-container').animate({'opacity':'0','left':'20px'},200,function(){
                    $('.imgshow-dialog .imgshow-container').css({'left':'-20px','opacity':'0'})
                });
                setTimeout(function(){
                    $('.imgshow-dialog').find('iframe').attr('src',"").hide();
                    s.initData(datas);
                    $('.imgshow-dialog .imgshow-container').animate({'opacity':'1','left':'0'},200,function(){
                        $('.imgshow-dialog').find('iframe').show();
                    });
                },200);


            }
            s.viewPrev = function(){

                if(currentImgBox.prev().length <= 0){
                    alert('已经是第一张');
                    return;
                }
                currentImgBox = currentImgBox.prev();

                datas.title = currentImgBox.find('.type').text();
                datas.img = currentImgBox.find('.img').find('img');
                datas.phone = currentImgBox.find('.phone').text();
                datas.email = currentImgBox.find('.email').text();
                datas.address = currentImgBox.find('.address').text();
                datas.worktime = currentImgBox.find('.worktime').text();
                datas.src = currentImgBox.find('.img').find('a').attr('data-src');

                $('.imgshow-dialog .imgshow-container').animate({'opacity':'0','left':'-20px'},200,function(){
                    $('.imgshow-dialog .imgshow-container').css({'left':'20px','opacity':'0'})
                });
                setTimeout(function(){
                    $('.imgshow-dialog').find('iframe').attr('src',"").hide();
                    s.initData(datas);
                    $('.imgshow-dialog .imgshow-container').animate({'opacity':'1','left':'0'},200,function(){
                        $('.imgshow-dialog').find('iframe').show();
                    });
                },200);


            }

        });
    }


})(jQuery);
