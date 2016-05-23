$(function () {

    //数据初始化
    var storageAPI = $.fn.yunyeStorage;
    var pageHeadData = storageAPI.getPosterHeadData();

    var initData = function () {
        var g = yunyeEditorGlobal;
        //标题
        //if(g.unique_name)$("#logo_title").html(g.unique_name);
        if(storageAPI.getCss("logo_title"))$("#logo_title").css(storageAPI.getCss("logo_title"));
        //简述
        if(g.short_description)$("#short_description").html(g.short_description);
        if(storageAPI.getCss("#short_description"))$("#short_description").css(storageAPI.getCss("#short_description"));
        //logo
        var logo_title = storageAPI.getHead('logo_title');
        if(logo_title && $.trim(logo_title) !== ""){
            $('.header-logo').empty().append(logo_title);
        }
        if(storageAPI.getHead('logo_image') && storageAPI.getHead('logo_image').url)$('.header-logo').empty().append("<img src="+ storageAPI.getHead('logo_image').url+">"  );
        //电话手机邮箱
        var $phone = $('#dpw_phone');
        if(g.phone)$phone.find('input:eq(0)').val(g.phone);
        if(g.mobile)$phone.find('input:eq(1)').val(g.mobile);
        if(g.email)$('#dpw_email').find('input').val(g.email);
        //日历
        if(yunyeEditorGlobal.lifetime.lifetime_type == "weekly"){
            $(".calender").hide();
            $(".weekly").show();
            var inputs = $(".weekly input");
            for (var i = 0; i < (inputs.length) / 2; i++) {
                var weekName = (i == 6) ? "Sunday" : (i == 0) ? "Monday" : (i == 1) ? "Tuesday" : (i == 2) ? "Wednesday" : (i == 3) ? "Thursday" : (i == 4) ? "Friday" : "Saturday",
                    info = yunyeEditorGlobal.lifetime.lifetime_value[weekName];
                inputs.eq(i * 2).val(info.time_start);
                inputs.eq(i * 2 + 1).val(info.time_end);
                if (info.enabled) {
                    $(".weekly td:eq(" + (i * 5 + 4) + ")").removeClass("off")
                } else {
                    $(".weekly td:eq(" + (i * 5 + 4) + ")").addClass("off")
                }
            }
        }else{
            $(".calender").show();
            $(".weekly").hide();
        }

        /**读取缓存背景图片*/
        if (storageAPI.getCss(".header")) {
            $('.header').css(storageAPI.getCss(".header"));
        }
        if (storageAPI.getCss(".yunye-template")) {
            $('.yunye-template').css(storageAPI.getCss(".yunye-template"));
        }
        if (storageAPI.getCss(".bar-header")) {
            $(".bar-header").css(storageAPI.getCss(".bar-header"));
        }
        if (storageAPI.getCss(".bar-footer")) {
            $(".bar-footer").css(storageAPI.getCss(".bar-footer"));
        }
        if (storageAPI.getCss("body")) {
            $("body").css(storageAPI.getCss("body"));
        }
        if (storageAPI.getCss(".qrcode-inner .qrcode")) {
            $(".qrcode-inner .qrcode").css(storageAPI.getCss(".qrcode-inner .qrcode"));
        }
        if (storageAPI.getCss(".abutton-group li a")) {
            $(".abutton-group li a").css(storageAPI.getCss(".abutton-group li a"));
        }

        /*读取主体部分*/
        if (storageAPI.getHtml()) {
            $(".yunye-template").remove();
            $(".container-fluid").append(storageAPI.getHtml());
        }
        
    };

    if (!(yunyeEditorGlobal.updated_at > pageHeadData.updated_at)) {
        $.extend(yunyeEditorGlobal, pageHeadData);
        //服务器暂时没传数据 (伪造数据)
        if (!yunyeEditorGlobal.lifetime)yunyeEditorGlobal.lifetime = {
            lifetime_weekly : {
                "Monday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Tuesday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Wednesday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Thursday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Friday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Saturday": {time_start: "09:00", time_end: "17:00", enabled: 0},
                "Sunday": {time_start: "09:00", time_end: "17:00", enabled: 0}
            },
            lifetime_special:{}
        };
        initData();
    };

    //弹出菜单
    $(".dropdown-toggle:not(#share-toggle)").registerDropDown();
    $(".abutton-contact .ico-phone").registerDropDown({
        id: 'dpw_phone',
        offsetYPercent: 50,
        offsetY: 30
    });
    $(".abutton-contact .ico-email").registerDropDown({
        id: 'dpw_email',
        offsetYPercent: 50,
        offsetY: 30
    });
    $(".abutton-contact .ico-address").registerDropDown({
        id: 'dpw_address',
        offsetYPercent: 50,
        offsetY: 30
    });
    $(".abutton-contact .ico-clock").registerDropDown({
        id: 'dpw_clock',
        offsetYPercent: 50,
        offsetY: 30,
        dynamicClass: 'clock'
    });
    $('.bar-header .title').click(function(){
      $('#text-model').animate({'bottom':'0px'},200);
      $(".bar-header .title p").tEditor({
          textDelete: false,
          textCopy: false,
          pluginType: 'other'
      });
      $('#ted-edit').trigger('click');
    });
    $('.header-info').click(function(){
      $('#text-model').animate({'bottom':'0px'},200);
      $("#short_description").tEditor({
          textDelete: false,
          textCopy: false,
          pluginType: 'other'
      });
      $('#ted-edit').trigger('click');
    });
    $('.header-logo').registerPopUp({
        id: 'dpw_menu',
        offsetYPercent: 100,
        list: [{
                icon: "glyphicon glyphicon-font",
                text: "输入文字",
                callback: function () {
                    if (!$(".header-logo h2")[0]) {
                        $('.header-logo').empty().append('<h2></h2>');
                    }
                    $('#text-model').animate({'bottom':'0px'},200);
                    $(".header-logo h2").tEditor({
                        textDelete: false,
                        textCopy: false,
                        pluginType: 'other'
                    });
                    $('#ted-edit').trigger('click');
                }
            },
            {
                icon: "glyphicon glyphicon-picture",
                text: " 上传图片",
                callback: function () {
                    $('.header-logo').empty().append('<img></img>');
                    $.fn.uploads.showDialog(function (data) {
                        if(!/\.(gif|jpg|jpeg|bmp|png)$/.test(data.file)){
                            yyAlert("上传图片格式错误");
                            return false;
                        }
                        if (!$(".header-logo img")[0]) {
                            $('.header-logo').empty().append('<img />');
                        }
                        $('.header-logo img').attr("src", data.file).attr("data-src-id", data.id);
                        storageAPI.setHead("logo_title", "");
                    });
                }
            },
            {icon: "glyphicon glyphicon-camera", text: "照相"},
            {icon: "glyphicon glyphicon-link", text: "图片链接",callback:function(obj){
                obj.resourceLink();
            }}],
        followMouse: true
    });
    $('.mask').registerPopUp({
        id: 'dpw_header',
        offsetXPercent: 80,
        offsetYPercent: 90,
        offsetY: 30,
        followMouse: true,
        followMouse: true,

        list: [
            {
                icon: "icon ico-system-pic",
                text: "系统背景",
                callback: function () {
                    $('.header').bgselect({}, function (ths, img) {
                        ths.css('background-image', 'url(' + img + ')');
                        ths.css('background-size', '100% 100%');
                        storageAPI.setCss(".header", {
                            'background-image': 'url(' + img + ')',
                            'background-size': '100% 100%'
                        });
                        $(".system-item").fadeOut(500);
                    })
                }
            },
            {
                icon: "glyphicon glyphicon-adjust",
                text: " 颜色",
                callback: function () {
                    $("#colorBox").css('top', $('.mask').height() + $('.mask').offset().top).show();
                    $(this).colorSelect({clbox: 'colorBox'}, function (ths, color) {
                        $('.header').css('background', color);
                        storageAPI.setCss(".header", {'background': color});
                    });
                }
            },
            {
                icon: "glyphicon glyphicon-picture",
                text: "上传图片",
                callback: function () {
                    $.fn.uploads.showDialog(function (data) {
                        if(!/\.(gif|jpg|jpeg|bmp|png)$/.test(data.file)){
                            yyAlert("上传图片格式错误");
                            return false;
                        }
                        $('.header').css('background-image', 'url(' + data.file + ')');
                        $('.header').css('background-size', '100% 100%');
                        storageAPI.setCss(".header", {
                            'background-image': 'url(' + data.file + ')',
                            'background-size': '100% 100%'
                        });
                    });
                }
            }
        ]
    });

    /* 模版空白设置背景 */
    $('.yunye-template').registerPopUp({
        id: 'dpw_template',
        offsetXPercent: 50,
        offsetYPercent: 50,
        offsetY: 30,
        arrowOffset: 80,
        orientation: 1,
        list: [
            {
                icon: "icon ico-system-pic",
                text: "系统背景",
                callback: function () {
                    $(this).bgselect({}, function (ths, img) {
                        $('.yunye-template').css('background-image', 'url(' + img + ')');
                        $('.yunye-template').css('background-size', '100% 100%');
                        storageAPI.setCss(".yunye-template", {
                            'background-image': 'url(' + img + ')',
                            'background-size': '100% 100%'
                        });
                        $(".system-item").fadeOut(500);
                    })
                }
            },
            {
                icon: "glyphicon glyphicon-adjust",
                text: " 颜色",
                callback: function () {
                    $("#colorBox").css('top', $('.content').offset().top).show();
                    $(this).colorSelect({clbox: 'colorBox'}, function (ths, color) {
                        $('.yunye-template').css('background', color);
                        storageAPI.setCss(".yunye-template", {'background': color});
                    });
                }
            },
            {
                icon: "glyphicon glyphicon-picture",
                text: "上传图片",
                callback: function () {
                    $.fn.uploads.showDialog(function (data) {
                        if(!/\.(gif|jpg|jpeg|bmp|png)$/.test(data.file)){
                            yyAlert("上传图片格式错误");
                            return false;
                        }
                        $('.yunye-template').css('background-image', 'url(' + data.file + ')');
                        $('.yunye-template').css('background-size', '100% 100%');
                        storageAPI.setCss(".yunye-template", {
                            'background-image': 'url(' + data.file + ')',
                            'background-size': '100% 100%'
                        });
                    });
                }
            },
            {icon: "glyphicon glyphicon-camera", text: "拍照"}
        ]
    });
    $('.btn-bg').registerPopUp({
        id: 'dpw_bg',
        offsetXPercent: 50,
        offsetYPercent: 50,
        offsetY: 30,
        arrowOffset: 60,
        orientation: 0,
        list: [
            {
                icon: "icon ico-system-pic",
                text: "顶/底背景",
                callback: function () {
                    $(this).bgselect({}, function (ths, img) {
                        $('.bar-header,.bar-footer').css('background-image', 'url(' + img + ')');
                        $('.bar-header,.bar-footer').css('background-size', '100% 100%');
                        storageAPI.setCss(".bar-header", {
                            'background-image': 'url(' + img + ')',
                            'background-size': '100% 100%'
                        });
                        storageAPI.setCss(".bar-footer", {
                            'background-image': 'url(' + img + ')',
                            'background-size': '100% 100%'
                        });
                        $(".system-item").fadeOut(500);
                    })
                }
            },
            {
                icon: "glyphicon glyphicon-adjust",
                text: " 顶/底颜色",
                callback: function () {
                    $("#colorBox").css('top', $('.content').offset().top).show();
                    $(this).colorSelect({clbox: 'colorBox'}, function (ths, color) {
                        $('.bar-header,.bar-footer').css('background-color', color);
                        storageAPI.setCss(".bar-header", {'background-color': color});
                        storageAPI.setCss(".bar-footer", {'background-color': color});
                        storageAPI.setCss(".bottom-container > .bottom-menu", {'background-color': color})
                    });
                }
            },
            {
                icon: "icon ico-system-pic",
                text: "主体背景",
                callback: function () {
                    $(this).bgselect({}, function (ths, img) {
                        $('body').css('background-image', 'url(' + img + ')');
                        $('body').css('background-size', '100% 100%');
                        $('.yunye-template,.header').css('background-image', 'url()')
                        storageAPI.setCss("body", {
                            'background-image': 'url(' + img + ')',
                            'background-size': '100% 100%'
                        });
                        $('.header,.yunye-template,.bar-header,.bar-footer').css('background', 'none');
                        storageAPI.setCss(".header", {'background': 'none'});
                        storageAPI.setCss(".yunye-template", {'background': 'none'});
                        storageAPI.setCss(".bar-header", {'background': 'none'});
                        storageAPI.setCss(".bar-footer", {'background': 'none'});
                        $(".system-item").fadeOut(500);
                    })
                }
            },
            {
                icon: "glyphicon glyphicon-adjust",
                text: " 主体颜色",
                callback: function () {
                    $("#colorBox").css('top', $('.content').offset().top).show();
                    $(this).colorSelect({clbox: 'colorBox'}, function (ths, color) {
                        $('body').css('background', color);
                        $('.bar-header,.bar-footer,.yunye-template,.header').css('background', color);
                        storageAPI.setCss("body", {'background': color});
                        storageAPI.setCss(".bar-header", {'background': color});
                        storageAPI.setCss(".bar-footer", {'background': color});
                        storageAPI.setCss(".yunye-template", {'background': color});
                        storageAPI.setCss(".header", {'background': color});
                    });
                }
            },
            {
                icon: "glyphicon glyphicon-transfer",
                text: "更换模版",
                callback: function () {
                        $(".yunye-template").changeTemplate('destroy').changeTemplate();
                }
            }
        ]
    });
    $('.qrcode .btn').registerPopUp({
        id: 'dpw_qr',
        offsetYPercent: 100,
        arrowOffset: 20,
        followMouse: true,
        list: [
            {
                icon: "glyphicon glyphicon-adjust",
                text: "颜色",
                callback: function () {
                    $("#colorBox").css('top', $('.content').offset().top).show();
                    $(this).colorSelect({clbox: 'colorBox'}, function (ths, color) {
                        $('.qrcode-inner .qrcode,.abutton-group li a').css('background', color);
                        storageAPI.setCss(".qrcode-inner .qrcode", {'background': color});
                        storageAPI.setCss(".abutton-group li a", {'background': color});
                    });
                }
            },
            {
                icon: "icon ico-system-pic",
                text: "背景图片",
                callback: function () {
                    $(this).bgselect({}, function (ths, img) {
                        $('.qrcode-inner .qrcode,.abutton-group li a').css('background-image', 'url(' + img + ')');
                        $('.qrcode-inner .qrcode,.abutton-group li a').css('background-size', '100% 100%');
                        storageAPI.setCss(".qrcode-inner .qrcode", {
                            'background-image': 'url(' + img + ')',
                            'background-size': '100% 100%'
                        });
                        storageAPI.setCss(".abutton-group li a", {
                            'background-image': 'url(' + img + ')',
                            'background-size': '100% 100%'
                        });
                        $(".system-item").fadeOut(500);
                    })
                }
            },
            {
                icon: "glyphicon glyphicon-picture",
                text: " 上传图片",
                callback: function () {
                    $.fn.uploads.showDialog(function (data) {
                        if(!/\.(gif|jpg|jpeg|bmp|png)$/.test(data.file)){
                            yyAlert("上传图片格式错误");
                            return false;
                        }
                        $('.qrcode-inner .qrcode,.abutton-group li a').css('background-image', 'url(' + data.file + ')');
                        $('.qrcode-inner .qrcode,.abutton-group li a').css('background-size', '100% 100%');
                        storageAPI.setCss(".qrcode-inner .qrcode", {
                            'background-image': 'url(' + data.file + ')',
                            'background-size': '100% 100%'
                        });
                        storageAPI.setCss(".abutton-group li a", {
                            'background-image': 'url(' + data.file + ')',
                            'background-size': '100% 100%'
                        });
                    });
                }
            }
        ]
    });

    $(document).on("clsdp", function (e,target) {
        $("#colorBox").hide();
        $('#text-model').animate({'bottom':'-265px'},200);
        $('#systemimg-model,#button-model,.tab-item').removeClass('open');
        $('.cnd-element').removeClass('active');
        $(".music-link-layout-wrap").remove();
        if(!$(target).hasClass("dropdown-toggle"))$('.dropdown-panel').removeClass("open");
        if($(target).hasClass("dropdown-toggle")){
            $("#dp").removeClass("open");
            $('#dp ul').css("visibility","hidden");
        }
    });

    $('body').on('click', function (event) {
        //处理点击事件
        var click_list = ['#closebg'];
        var item = '';
        for (var i in click_list) {
            if ($(event.target).closest(click_list[i]).length != 0) {
                item = click_list[i];
                break;
            }
        }
        switch (item) {
            case "#closebg":
                $(".system-item").fadeOut(200);
                break;
        }
        $("#closesmusic").on('click',function(){
            $(".system-music").fadeOut(200);
        })
        //点击被保护列表中的对象返回
        window.clickItmList = window.clickItmList || ["#dp", "#colorBox"];
        var list = window.clickItmList;
        for (var i in list) {
            if ($(event.target).closest(list[i]).length != 0)return;
        }
        //点击页面空白区域行为
        $('#dp').removeClass('open');
        $('#dp ul').css("visibility", "hidden");
    });

    //数据绑定
    $('#dpw_title input').on('change', function (event) {
        $('.edit-bar-header .title p').html(event.currentTarget.value);
        storageAPI.setHead("unique_name", event.currentTarget.value);
    });
    $('#dpw_desc textarea').on('change', function (event) {
        $('.header-info .desc span').html(event.currentTarget.value);
        storageAPI.setHead("short_description", event.currentTarget.value);
    });
    $('.dayinfo input').on('change', function (event) {
        var inputs = $('#dpw_clock input');
        var start = inputs[0].value, end = inputs[1].value;
        if (start && end) {
            if (end < start) {
                $(event.target).blur();
                $('#dpw_clock input').eq(0).val("");
                $('#dpw_clock input').eq(1).val("");
                yyConfirm("结束时间不能早于开始时间");
            } else {
                var specificDay = $("#year").val() + "-" + $("#month").val() + "-" + $(".hover").html();
                yunyeEditorGlobal.lifetime.lifetime_value[specificDay] = {
                    "time_start": $('#dpw_clock input').eq(0).val(),
                    "time_end": $('#dpw_clock input').eq(1).val(),
                    "enabled": $('#dateState').hasClass("off") ? 0 : 1
                };
                $(".calender .hover").addClass("special");
            }
        }
    });

    $(".change-template-layout").hide();
});
