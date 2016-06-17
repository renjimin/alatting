$(function () {
    if( !$(".bar-header .btn-music audio source").attr("src")){
            $(".bar-header .btn-music").hide();
    }

    $('.slider-content').each(function () {
        $(this).imgslidershow();
    });
   
   
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

    $(".yunye-template:gt(0)").hide();
});

function posterDetail() {
    return true;
}

function posterOrder() {
    return true;
}

