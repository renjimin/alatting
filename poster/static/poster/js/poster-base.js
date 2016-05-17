$(function(){   
    $(".back-to-home").click(function(){
        var url = $(this).data("url");
        yyConfirm("您确定要退出海报编辑吗？<br>确定后将自动保存已编辑的数据！", function(){
        //todo:lyh:异步调用保存方法，将本地缓存数据保存至数据库,
        //保存操作完成后进行页面跳转
        window.location.href = url;
        });
    });
    $(".icon-change-template").click(function(){
        alert("更换模板");
    });

    //弹出菜单
    $(".dropdown-toggle").registerDropDown();
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
                    $('.header-logo').empty().append('<h2>input</h2>');
                    $('#teditor').show();
                    $('#bodyMask').show();
                    $('.header-logo h2').tEditor();
                    $('#teditor').css('top',$(document).height() - $('#teditor').height() );
                    event.stopPropagation();
                }},
                {icon:"glyphicon glyphicon-picture",text:" 上传图片",callback:function(){
                          $.fn.uploads.showDialog(function(data){
                                $('.header-logo img').css('background-image', 'url(' + data.file + ')');
                                $('.header-logo img').css('background-size', 'cover');
                                storageAPI.setCss(".header-logo img", {'background-image': 'url(' + data.file  + ')', 'background-size': 'cover'});                             
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
            followMouse:true
        });                    
    $(document).on("clsdp",function(){
        $("#colorBox").hide();
        $("#teditor").hide();
    });

    //改变文字颜色
    $('.ico-text').on('click',function(event){
        $('#teditor').show();
        $(this).tEditor();  
        $('#teditor').css('top',$(document).height() - $('#teditor').height() - 93);
        event.stopPropagation();
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
        window.clickItmList = window.clickItmList || ["#dp","#colorBox","#teditor"];
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
        
        if(pageHeadData.clock){
            for(var i in pageHeadData.clock){
                $('#dpw_clock input:eq('+i+')').val(pageHeadData.clock[i]);
            }
        }
        if(pageHeadData.logo_img){
            $('.header-logo img').attr("src",pageHeadData.logo_img);       
        }
        /**读取缓存背景图片*/
        if( storageAPI.getCss(".header"))$('.header').css(storageAPI.getCss(".header"));
        if( storageAPI.getCss(".yunye-template"))$('.yunye-template').css(storageAPI.getCss(".yunye-template"));
        if(storageAPI.getCss(".bar-header"))$(".bar-header").css(storageAPI.getCss(".bar-header"));
        if(storageAPI.getCss(".bar-footer"))$(".bar-footer").css(storageAPI.getCss(".bar-footer"));   
        if(storageAPI.getCss("body"))$("body").css(storageAPI.getCss("body"));
        if(storageAPI.getCss(".qrcode .btn"))$(".qrcode .btn").css(storageAPI.getCss(".qrcode .btn"));
        if(storageAPI.getCss(".abutton-group li a"))$(".abutton-group li a").css(storageAPI.getCss(".abutton-group li a"));
    }
    
    function setHeadTimeStamp(key,value){
        storageAPI.setHead("title",event.currentTarget.value);
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
    $('#dpw_phone input:eq(0)').on('change',function(event){
        setHeadTimeStamp("phone",event.currentTarget.value);
    });
    $('#dpw_phone input:eq(1)').on('change',function(event){
        setHeadTimeStamp("mobile",event.currentTarget.value);
    });
    $('#dpw_email input').on('change',function(event){
        setHeadTimeStamp("email",event.currentTarget.value);
    });
    $('#dpw_clock input').on('change',function(event){
        var inputs = $('#dpw_clock input');
        var arr = [];
        for(var i = 0 ; i < inputs.length ; i ++){
            arr.push(inputs[i].value);
        }
        for(var i = 0 ; i < arr.length/2 ; i++){
            var even = arr[ i * 2],odd = arr[ (i * 2) +1];
            if(even && odd && (odd <= even) ){
                $(event.target).blur();
                $('#dpw_clock input').eq(i*2).val("");
                $('#dpw_clock input').eq(i*2 + 1).val("");
                yyConfirm("结束时间不能早于开始时间");
                break;
            }
        }
        setHeadTimeStamp("clock",arr);
    });
});