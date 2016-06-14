$(function () {
    $('.slider-content').each(function () {
        $(this).imgslidershow();
    });
    var templateScale = $('body').width() / $('.yunye-template').width();

    var templateScaleOpt = '-webkit-transform:scale(' + templateScale + ',' + templateScale + ');'
        + '-moz-transform:scale(' + templateScale + ',' + templateScale + ');'
        + '-o-transform:scale(' + templateScale + ',' + templateScale + ');'
        + '-ms-transform:scale(' + templateScale + ',' + templateScale + ');'
        + 'transform:scale(' + templateScale + ',' + templateScale + ');';
    if ($('.template-box').length <= 0) {
        var templateBox = $('<div class="template-box"></div>');
        $('.yunye-template').parent().append(templateBox);
        templateBox.append($('.yunye-template'));
    }

    $('.yunye-template').attr('style', templateScaleOpt);
    $('.template-box').height($('.yunye-template').height() * templateScale).css({'min-height': $(window).height() - 84 - $('.header').height() + 'px'});

<<<<<<< HEAD
*/
$('.yunye-template > .content > div').each(function(){
	$(this).magnificPopup({
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
	})


		


});
		


function posterDetail(){
	return true;
=======
    window.onresize = function () {
        var templateScale = $('body').width() / $('.yunye-template').width();
        var templateScaleOpt = '-webkit-transform:scale(' + templateScale + ',' + templateScale + ');'
            + '-moz-transform:scale(' + templateScale + ',' + templateScale + ');'
            + '-o-transform:scale(' + templateScale + ',' + templateScale + ');'
            + '-ms-transform:scale(' + templateScale + ',' + templateScale + ');'
            + 'transform:scale(' + templateScale + ',' + templateScale + ');';
        if ($('.template-box').length <= 0) {
            var templateBox = $('<div class="template-box"></div>');
            $('.yunye-template').parent().append(templateBox);
        }

        $('.yunye-template').attr('style', templateScaleOpt);
        $('.template-box').height($('.yunye-template').height() * templateScale).css({'min-height': $(window).height() - 84 - $('.header').height() + 'px'});
    };

    /*
     $('.swiper-container').each(function(){
     $(this).find('.swiper-slide').magnificPopup({
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
     })
     */

    $('.yunye-template > .content > div').each(function () {
        $(this).magnificPopup({
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

    $(".btn-page").click(function(){
        $("body").changeTemplate(
            "destroy"
        ).changeTemplate(
            "showPublishPageList", {
                "target": "showPublishPageList",
                "initAfter": function () {
                    $("#changeTemplatesList").css('height', "70%");
                }
            }
        );
    });

    $(".template-box > .yunye-template:gt(0)").hide();
});

function posterDetail() {
    return true;
>>>>>>> c0c695800ca0eeef625bfb9996729428453b0152
}

function posterOrder() {
    return true;
}