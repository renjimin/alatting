$(function(){
    /*footer 图标显示为active*/
    $('.footer-tab li.active').removeClass("active");
    $('.footer-tab').find("li").eq(2).addClass("active");
    /*footer 类别列表在页面加载时是否显示*/
    var queryString = window.location.search;
    if(queryString) {
        /* url = /category/?category=..&subcateogry=..&subcategory-.. */
        /* url = /category/?category=..&subcateogry=..&subcategory-.. &sort=..*/
        /* url = /category/?sort=..*/
        if($('#type-model-ftcat').hasClass('open')) {
            $('#type-model-ftcat').removeClass('open');
            $('.body-container').css("overflow", "");
        }
    } else {
        /* url= /category */
        if(!($('#type-model-ftcat').hasClass('open'))) {
            $('#type-model-ftcat').addClass('open');
            $('.body-container').css("overflow", "hidden");
        }
    }
    $('#hide-ftcate').click(function(){
        $('#type-model-ftcat').removeClass('open');
        $('.body-container').css("overflow", "");
    });
    /*footer 类别列表内部显示*/
    $('#type-model-ftcat').height($(window).height() - 60);
    $('#type-model-ftcat-container').css("max-height", ($(window).height() - 80)+'px');
    $("#ftcatelist .ftcat-item-link").click(function(){
        if($(this).parent().hasClass('open')){
            $(this).parent().find('.ftcat-item-sublist').slideUp(200);
            $(this).parent().removeClass('open');
            $(this).parent().siblings().find('.ftcat-item-link').css("width", "100%");
            $(this).siblings('.ftcat-item-sbt').addClass('hidden');
        }else{
            $(this).parent().find('.ftcat-item-sublist').slideDown(200);
            $(this).parent().addClass('open');
            $(this).css("width", "64%");
            $(this).siblings('.ftcat-item-sbt').removeClass('hidden');
            
            $(this).parent().siblings().removeClass('open').find('.ftcat-item-sublist').slideUp(200);
            $(this).parent().siblings().find('.ftcat-item-sbt').addClass('hidden');
            $(this).parent().siblings().find('.ftcat-item-link').css("width", "100%");
        }
    });
    /*footer 查看对应类别海报*/
    $(".ftcat-item-sbt").click(function(){
        var state_id = $(this).attr('id')
        var ftcat_item_id = state_id.substr(state_id.lastIndexOf('-') + 1);
        var hrefURL = '?category='+ftcat_item_id;

        var ftcat_subitem_name = "ftcat-subitem-"+ftcat_item_id;
        var ftcat_subitem_checkboxes = $("[name='" + ftcat_subitem_name + "']");
        for (var i = 0, n = ftcat_subitem_checkboxes.length; i < n; i++) {
            if (ftcat_subitem_checkboxes[i].checked) {
                hrefURL += '&subcategory='+ ftcat_subitem_checkboxes[i].value;
            }
        }
        window.location.href = hrefURL;
    });
    /*footer 查看对应类别海报后排序*/
    $('#ftcat-hottest').click(function(){
        var url = window.location.href;
        var newUrl = url;
        if(url.indexOf("sort=hot")==-1 && url.indexOf("sort=new")==-1) {
            var separator = (url.indexOf("?")===-1)?"?":"&";
            var newParam = separator + "sort=hot";
            newUrl = url + newParam;     
        } else if(url.indexOf("sort=hot")==-1 && url.indexOf("sort=new")!=-1) {
            newUrl = url.replace("sort=new", "sort=hot");
        }
        window.location.href =newUrl;
    });
    $('#ftcat-newest').click(function(){
        var url = window.location.href;
        var newUrl = url;
        if(url.indexOf("sort=hot")==-1 && url.indexOf("sort=new")==-1) {
            var separator = (url.indexOf("?")===-1)?"?":"&";
            var newParam = separator + "sort=new";
            newUrl = url + newParam;     
        } else if(url.indexOf("sort=hot")!=-1 && url.indexOf("sort=new")==-1) {
            newUrl = url.replace("sort=hot", "sort=new");
        }
        window.location.href =newUrl;
    });
})
