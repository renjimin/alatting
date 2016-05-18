$(function(){
    $(".back-to-home").click(function(){
        var url = $(this).data("url");
        yyConfirm("您确定要退出海报编辑吗？<br>确定后将自动保存已编辑的数据！", function(){
        //todo:lyh:异步调用保存方法，将本地缓存数据保存至数据库,
        //保存操作完成后进行页面跳转
        window.location.href = url;
        });
    });

    //弹出菜单
    $(".dropdown-toggle:not(#share-toggle)").registerDropDown();
    $(".abutton-contact .ico-phone").registerDropDown({
            id:'dpw_phone',
            offsetYPercent:50,
            offsetY:30,
        });
    $(".abutton-contact .ico-email").registerDropDown({
            id:'dpw_email',
            offsetYPercent:50,
            offsetY:30,
        });
    $(".abutton-contact .ico-address").registerDropDown({
            id:'dpw_address',
            offsetYPercent:50,
            offsetY:30,
        });
   $(".abutton-contact .ico-clock").registerDropDown({
            id:'dpw_clock',
            offsetYPercent:50,
            offsetY:30,
            dynamicClass:'clock'
        });
    $('.bar-header .title').registerDropDown({
            id:'dpw_title',
            offsetYPercent:50,
            offsetY:18,
            dynamicClass:'title'
        });
    $('.header-info').registerDropDown({
            id:'dpw_desc',
            eval:'$("#dp").height($(document).height() - 113 - $(".header-bar").height()  );$("#dp textarea").focusEnd();',
            dynamicClass:'info'
        });
    $('.header-logo').registerPopUp({
            id:'dpw_menu',
            offsetYPercent:100,
            list:[{icon:"icon ico-edit-text",text:"打字",callback:function(){
                    if( !$(".header-logo h2")[0] ){
                       $('.header-logo').empty().append('<h2></h2>');
                    }
                    $('#text-model').animate({bottom:'0px'},200);
                    $(".header-logo h2").tEditor({textDelete:false,textCopy:false,pluginType:'other'});
                }},
                {icon:"glyphicon glyphicon-picture",text:" 上传图片",callback:function(){
                          $.fn.uploads.showDialog(function(data){
                                if( !$(".header-logo img")[0] ){
                                   $('.header-logo').empty().append('<img />');
                                }
                                $('.header-logo img').attr("src",data.file).attr("data-src-id",data.id);
                           });
                }},
                {icon:"glyphicon glyphicon-camera",text:"照相"},
                {icon:"glyphicon glyphicon-link",text:"图片链接"}],
            followMouse:true
        });
    $('.mask').registerPopUp({
            id:'dpw_header',
            offsetXPercent:80,
            offsetYPercent:90,
            offsetY:30,
            arrowOffset:80,
            list:[{icon:"icon ico-edit-pic",text:"系统背景",callback:function(){
                        $('.header').bgselect({}, function (ths,img) {
                            ths.css('background-image', 'url(' + img + ')');
                            ths.css('background-size', 'cover');
                            storageAPI.setCss(".header", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            $(".system-item").fadeOut(500);
                        })
                    }},
                    {icon:"glyphicon glyphicon-adjust",text:" 颜色",callback:function(){
                        $("#colorBox").css('top',$('.mask').height()+$('.mask').offset().top).show();
                        $(this).colorSelect({clbox:'colorBox'},function(ths,color){
                             $('.header').css('background',color);
                            storageAPI.setCss(".header", {'background':color});
                        });
                    }},
                    {icon:"glyphicon glyphicon-picture",text:"上传图片",callback:function(){
                          $.fn.uploads.showDialog(function(data){
                                $('.header').css('background-image', 'url(' + data.file + ')');
                                $('.header').css('background-size', 'cover');
                                storageAPI.setCss(".header", {'background-image': 'url(' + data.file  + ')', 'background-size': 'cover'});
                           });
                    }}
                ]
        });
    /* 模版空白设置背景 */
   $('.yunye-template').registerPopUp({
            id:'dpw_template',
            offsetXPercent:50,
            offsetYPercent:50,
            offsetY:30,
            arrowOffset:80,
            orientation:1,
            list:[{icon:"icon ico-edit-pic",text:"系统背景",callback:function(){
                        $(this).bgselect({}, function (ths,img) {
                            $('.yunye-template').css('background-image', 'url(' + img + ')');
                            $('.yunye-template').css('background-size', 'cover');
                            storageAPI.setCss(".yunye-template", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            $(".system-item").fadeOut(500);
                        })
                    }},
                    {icon:"glyphicon glyphicon-adjust",text:" 颜色",callback:function(){
                        $("#colorBox").css('top',$('.content').offset().top).show();
                        $(this).colorSelect({clbox:'colorBox'},function(ths,color){
                             $('.yunye-template').css('background',color);
                            storageAPI.setCss(".yunye-template", {'background':color});
                        });
                    }},
                    {icon:"glyphicon glyphicon-picture",text:"上传图片",callback:function(){
                          $.fn.uploads.showDialog(function(data){
                                $('.yunye-template').css('background-image', 'url(' + data.file + ')');
                                $('.yunye-template').css('background-size', 'cover');
                                storageAPI.setCss(".yunye-template", {'background-image': 'url(' + data.file  + ')', 'background-size': 'cover'});
                           });
                    }},
                    {icon:"glyphicon glyphicon-camera",text:"拍照"}
                ]
        });
  $('.btn-bg').registerPopUp({
            id:'dpw_bg',
            offsetXPercent:50,
            offsetYPercent:50,
            offsetY:30,
            arrowOffset:60,
            orientation:0,
            list:[{icon:"icon ico-edit-pic",text:"顶/底背景",callback:function(){
                        $(this).bgselect({}, function (ths,img) {
                            $('.bar-header,.bar-footer').css('background-image', 'url(' + img + ')');
                            $('.bar-header,.bar-footer').css('background-size', 'cover');
                            storageAPI.setCss(".bar-header", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            storageAPI.setCss(".bar-footer", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            $(".system-item").fadeOut(500);
                        })
                    }},
                    {icon:"glyphicon glyphicon-adjust",text:" 顶/底颜色",callback:function(){
                        $("#colorBox").css('top',$('.content').offset().top).show();
                        $(this).colorSelect({clbox:'colorBox'},function(ths,color){
                             $('.bar-header,.bar-footer').css('background',color);
                             storageAPI.setCss(".bar-header", {'background':color});
                             storageAPI.setCss(".bar-footer", {'background':color});
                        });
                    }},
                    {icon:"icon ico-edit-pic",text:"主体背景",callback:function(){
                        $(this).bgselect({}, function (ths,img) {
                            $('body').css('background-image', 'url(' + img + ')');
                            $('body').css('background-size', 'cover');
                            $('.yunye-template,.header').css('background-image', 'url()')
                            storageAPI.setCss("body", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            $('.header,.yunye-template,.bar-header,.bar-footer').css('background','none');
                            storageAPI.setCss(".header", {'background':'none'});
                            storageAPI.setCss(".yunye-template", {'background':'none'});
                            storageAPI.setCss(".bar-header", {'background':'none'});
                            storageAPI.setCss(".bar-footer", {'background':'none'});
                            $(".system-item").fadeOut(500);
                        })
                    }},
                     {icon:"glyphicon glyphicon-adjust",text:" 主体颜色",callback:function(){
                        $("#colorBox").css('top',$('.content').offset().top).show();
                        $(this).colorSelect({clbox:'colorBox'},function(ths,color){
                            $('body').css('background',color);
                            $('.bar-header,.bar-footer,.yunye-template,.header').css('background',color);
                            storageAPI.setCss("body", {'background':color});
                            storageAPI.setCss(".bar-header", {'background':color});
                            storageAPI.setCss(".bar-footer", {'background':color});
                            storageAPI.setCss(".yunye-template", {'background':color});
                            storageAPI.setCss(".header", {'background':color});
                        });
                    }},
                ]
        });
     $('.qrcode .btn').registerPopUp({
            id:'dpw_qr',
            offsetYPercent:100,
            list:[{icon:"glyphicon glyphicon-adjust",text:"颜色",callback:function(){
                            $("#colorBox").css('top',$('.content').offset().top).show();
                            $(this).colorSelect({clbox:'colorBox'},function(ths,color){
                            $('.qrcode .btn,.abutton-group li a').css('background',color);
                            storageAPI.setCss(".qrcode .btn", {'background':color});
                            storageAPI.setCss(".abutton-group li a", {'background':color});
                        });
                }},
                {icon:"icon ico-edit-pic",text:"背景图片",callback:function(){
                        $(this).bgselect({}, function (ths,img) {
                            $('.qrcode .btn,.abutton-group li a').css('background-image', 'url(' + img + ')');
                            $('.qrcode .btn,.abutton-group li a').css('background-size', 'cover');
                            storageAPI.setCss(".qrcode .btn", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            storageAPI.setCss(".abutton-group li a", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            $(".system-item").fadeOut(500);
                        })
                }},
                {icon:"glyphicon glyphicon-picture",text:" 上传图片",callback:function(){
                          $.fn.uploads.showDialog(function(data){
                                console.log(data)
                                $('.qrcode .btn,.abutton-group li a').css('background-image', 'url(' + data.file + ')');
                                $('.qrcode .btn,.abutton-group li a').css('background-size', 'cover');
                                storageAPI.setCss(".qrcode .btn", {'background-image': 'url(' + data.file  + ')', 'background-size': 'cover'});
                                storageAPI.setCss(".abutton-group li a", {'background-image': 'url(' + data.file  + ')', 'background-size': 'cover'});
                           });
                }}],
            arrowOffset:20,
            followMouse:true
        });

    $(document).on("clsdp",function(){
        $("#colorBox").hide();
        $('#text-model').animate({bottom:'-265px'},200);
//        $("#teditor").hide();
        $('#systemimg-model,#button-model,.tab-item').removeClass('open');
    });

    $('body').on('click',function(event){
        //处理点击事件
        var click_list = ['#closebg'];
        var item = '';
        for(var i in click_list){
            if($(event.target).closest(click_list[i]).length!=0){
                item = click_list[i];
                break;
            }
        }
        switch(item){
            case "#closebg":
                $(".system-item").fadeOut(200);
                break;
        }
        //点击被保护列表中的对象返回
        window.clickItmList = window.clickItmList || ["#dp","#colorBox"];
        var list = window.clickItmList;
        for(var i in list){
            if($(event.target).closest(list[i]).length!=0)return;
        }
        //点击页面空白区域行为
        $('#dp').removeClass('open');
        $('#dp ul').css("visibility","hidden");
    });

    //数据初始化
    var storageAPI = $.fn.yunyeStorage;
    var pageHeadData = storageAPI.getPosterHeadData();
    if(!(yunyeEditorGlobal.updated_at  > pageHeadData.updated_at)){
        $.extend(yunyeEditorGlobal,pageHeadData);
        //服务器暂时没传数据 (伪造数据)
        if( !yunyeEditorGlobal.lifetime )yunyeEditorGlobal.lifetime = {};
        if( !yunyeEditorGlobal.lifetime.lifetime_value )yunyeEditorGlobal.lifetime.lifetime_value = {};
        if( !yunyeEditorGlobal.lifetime.defaultsWeekly )yunyeEditorGlobal.lifetime.defaultsWeekly = {
            "Monday":{time_start:"09:00",time_end:"17:00"},
            "Tuesday":{time_start:"09:00",time_end:"17:00"},
            "Wednesday":{time_start:"09:00",time_end:"17:00"},
            "Thursday":{time_start:"09:00",time_end:"17:00"},
            "Friday":{time_start:"09:00",time_end:"17:00"},
            "Saturday":{time_start:"09:00",time_end:"17:00"},
            "Sunday":{time_start:"09:00",time_end:"17:00"}
        };
        initData();
    }

    function initData(){
         //标题
        $('.edit-bar-header .title p').html(yunyeEditorGlobal.title);
        $('#dpw_title input').val(yunyeEditorGlobal.title);
        //简述
        $('.header-info .desc span').html(yunyeEditorGlobal.short_description);
        $('#dpw_desc textarea').val(yunyeEditorGlobal.short_description);
        //电话手机邮箱
        $('#dpw_phone input:eq(0)').val(yunyeEditorGlobal.phone);
        $('#dpw_phone input:eq(1)').val(yunyeEditorGlobal.mobile);
        $('#dpw_email input').val(yunyeEditorGlobal.email);

        if( !!yunyeEditorGlobal.logo_text){
            $('.header-logo').empty().append('<h2>'+yunyeEditorGlobal.logo_text+'</h2>');
        }else{
            $('.header-logo').empty().append('<img src="'+yunyeEditorGlobal.logo_image.url+'" >');
        }
        /**读取缓存背景图片*/
        if( storageAPI.getCss(".header"))$('.header').css(storageAPI.getCss(".header"));
        if( storageAPI.getCss(".yunye-template"))$('.yunye-template').css(storageAPI.getCss(".yunye-template"));
        if(storageAPI.getCss(".bar-header"))$(".bar-header").css(storageAPI.getCss(".bar-header"));
        if(storageAPI.getCss(".bar-footer"))$(".bar-footer").css(storageAPI.getCss(".bar-footer"));
        if(storageAPI.getCss("body"))$("body").css(storageAPI.getCss("body"));
        if(storageAPI.getCss(".qrcode .btn"))$(".qrcode .btn").css(storageAPI.getCss(".qrcode .btn"));
        if(storageAPI.getCss(".abutton-group li a"))$(".abutton-group li a").css(storageAPI.getCss(".abutton-group li a"));

        /*读取主体部分*/
        if(storageAPI.getHtml())$(".container-fluid").html(storageAPI.getHtml());
    }

    function setHeadTimeStamp(key,value){
        storageAPI.setHead(key,value);
        storageAPI.setHead("updated_at", new Date().getTime());
    }

    //数据绑定
    $('#dpw_title input').on('change',function(event){
        $('.edit-bar-header .title p').html(event.currentTarget.value);
        setHeadTimeStamp("title",event.currentTarget.value);
    });
    $('#dpw_desc textarea').on('change',function(event){
        $('.header-info .desc span').html(event.currentTarget.value);
        setHeadTimeStamp("short_description",event.currentTarget.value);
    });
    $('#dpw_clock input').on('change',function(event){
        var inputs = $('#dpw_clock input');
        var start = inputs[0].value ,end = inputs[1].value;
        if(start && end ){
            if( end < start ){
                $(event.target).blur();
                $('#dpw_clock input').eq(0).val("");
                $('#dpw_clock input').eq(1).val("");
                yyConfirm("结束时间不能早于开始时间");
            }else{
                var specificDay = $("#year").val() + "-" + $("#month").val() + "-" + $(".hover").html(),
                    week = new Date($("#year").val(),$("#month").val() -1,$(".hover").html()).getDay(),
                    weekName = (week == 0) ? "Sunday" : (week == 1) ? "Monday" : (week == 2) ? "Tuesday" : (week == 3) ? "Wednesday" : (week == 4) ? "Thursday" : (week == 5) ? "Friday" :  "Saturday" ,
                    info = yunyeEditorGlobal.lifetime.defaultsWeekly[weekName];
                if( $('#dpw_clock input').eq(0).val() == info.time_start && $('#dpw_clock input').eq(1).val() == info.time_end ){
                    $(".calender .hover").removeClass("on");
                    delete yunyeEditorGlobal.lifetime.lifetime_value[specificDay];
                }else{
                    yunyeEditorGlobal.lifetime.lifetime_value[specificDay] = {
                        "time_start": $('#dpw_clock input').eq(0).val(),
                        "time_end": $('#dpw_clock input').eq(1).val()
                    }
                    $(".calender .hover").addClass("on");
                }
                setHeadTimeStamp("lifetime", yunyeEditorGlobal.lifetime);
            }
        }
    });

    window.onunload = function(event){
           setHeadTimeStamp("phone",$('phoneInput').val() );
           setHeadTimeStamp("mobile",$('mobileInput').val() );
           setHeadTimeStamp("email",$('emailInput').val() );

           if( $('.header-logo h2')[0] ){
                setHeadTimeStamp("logo_text",$('.header-logo h2').html() );
                setHeadTimeStamp("logoTitleType","text" );
                setHeadTimeStamp("logo_image","" );
           }else{
                setHeadTimeStamp("logo_text","" );
                setHeadTimeStamp("logoTitleType","image" );
                setHeadTimeStamp("logo_image",{url:$('.header-logo img').attr("src"),id:$('.header-logo img').attr("data-src-id")} );
           }

           storageAPI.setHtml(".container-fluid");
    }

    $(".btn.btn-save").on("click",function(){
        $.ajax({
            type: "PATCH",
            url: "/api/v1/poster/save/6/",
            data: storageAPI.getPosterData(),
            success: function(){console.log("success")},
            error: function(){console.log("error")}
        });
    });

});
