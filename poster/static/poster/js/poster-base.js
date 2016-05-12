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
            eval:'$("#dp").height($(document.body).height() - _this.offset().top - $("bar-footer bar").height()-40);$("#dp textarea").focusEnd();',
            dynamicClass:'info'
        });
    $('.header-logo').registerPopUp({
            id:'dpw_menu',
            list:[{icon:"ico-email",text:"打字",callback:function(){console.log(1);}},
                {icon:"ico-phone",text:" 上传图片"},
                {icon:"ico-address",text:"照相"},
                {icon:"ico-clock",text:"图片链接"}],
            orientation:1
        });
    $('.mask').registerPopUp({
            id:'dpw_header',
            offsetXPercent:80,
            offsetYPercent:90,
            offsetY:30,
            arrowOffset:80,
            list:[{icon:"ico-email",text:"系统图案",callback:function(){
                        $('.header').bgselect({}, function (ths,img) {
                            ths.css('background-image', 'url(' + img + ')');
                            ths.css('background-size', 'cover');
                            storageAPI.setCss(".header", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            $(".system-item").fadeOut(500);
                        })
                    }},
                    {icon:"ico-phone",text:" 颜色",callback:function(){
                        $("#colorBox").css('top',$('.content').offset().top).show();
                        $(this).colorSelect({clbox:'colorBox'},function(ths,color){
                             $('.header').css('background',color);
                            storageAPI.setCss(".header", {'background':color});
                        });
                    }},
                    {icon:"ico-address",text:"上传图片"}
                ]
        });
/**模版空白设置背景*/
   $('.yunye-template').registerPopUp({
            id:'dpw_header',
            offsetXPercent:50,
            offsetYPercent:50,
            offsetY:30,
            arrowOffset:80,
            orientation:1,
            list:[{icon:"ico-email",text:"系统图案",callback:function(){
                        $('.yunye-template').bgselect({}, function (ths,img) {
                            ths.css('background-image', 'url(' + img + ')');
                            ths.css('background-size', 'cover');
                            storageAPI.setCss(".yunye-template", {'background-image': 'url(' + img + ')', 'background-size': 'cover'});
                            $(".system-item").fadeOut(500);
                        })
                    }},
                    {icon:"ico-phone",text:" 颜色",callback:function(){
                        $("#colorBox").css('top',$('.content').offset().top).show();
                        $(this).colorSelect({clbox:'colorBox'},function(ths,color){
                             $('.yunye-template').css('background',color);
                            storageAPI.setCss(".yunye-template", {'background':color});
                        });
                    }},
                    {icon:"ico-address",text:"上传图片"}
                ]
        });    
    $(document).on("clsdp",function(){
        $("#colorBox").hide();
    });

    //改变文字颜色
    $('.glyphicon-text-height').on('click',function(){
        $("#colorBox").css('top', $(document).height() - 153 ).show();
        $(this).colorSelect({clbox:'colorBox'},function(ths,color){
            ths.css('color',color);
        });
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
        window.clickItmList = window.clickItmList || ["#dp"];
        var list = window.clickItmList;
        for(var i in list){
            if($(event.target).closest(list[i]).length!=0)return;
        }
        //点击页面空白区域行为
        $('#dp').removeClass('open');
        $("#colorBox").hide();
    });
    /**读取缓存背景图片*/
    var storageAPI = $.fn.yunyeStorage;
    if( storageAPI.getCss(".header"))$('.header').css(storageAPI.getCss(".header"));
    if( storageAPI.getCss(".yunye-template"))$('.yunye-template').css(storageAPI.getCss(".yunye-template"));

    //数据初始化
    var pageHeadData = storageAPI.getPosterHeadData();
    if(pageHeadData.title){
        $('.edit-bar-header .title p').html(pageHeadData.title);
        $('#dpw_title input').val(pageHeadData.title);
    }
    if(pageHeadData.desc){  
        $('.header-info .desc span').html(pageHeadData.desc);
        $('#dpw_desc textarea').val(pageHeadData.desc);
    }
    if(pageHeadData.phone)$('#dpw_phone input:eq(0)').val(pageHeadData.phone);
    if(pageHeadData.mobile)$('#dpw_phone input:eq(1)').val(pageHeadData.mobile);
    if(pageHeadData.email)$('#dpw_email input').val(pageHeadData.email);
    if(pageHeadData.address)$('#dpw_address input').val(pageHeadData.address);
    /*(pageHeadData.clock){
        for(var i in pageHeadData.clock){
            $('#dpw_clock input:eq('+i+')').val(pageHeadData.clock[i]);
        }
    }*/
    //数据绑定
    $('#dpw_title input').on('change',function(event){
        $('.edit-bar-header .title p').html(event.currentTarget.value);
        $.fn.yunyeStorage.setHead("title",event.currentTarget.value);
    });
    $('#dpw_desc textarea').on('change',function(event){
        $('.header-info .desc span').html(event.currentTarget.value);
        $.fn.yunyeStorage.setHead("desc",event.currentTarget.value);
    });
    $('#dpw_phone input:eq(0)').on('change',function(event){
        $.fn.yunyeStorage.setHead("phone",event.currentTarget.value);
    });
    $('#dpw_phone input:eq(1)').on('change',function(event){
        $.fn.yunyeStorage.setHead("mobile",event.currentTarget.value);
    });
    $('#dpw_email input').on('change',function(event){
        $.fn.yunyeStorage.setHead("email",event.currentTarget.value);
    });
    $('#dpw_address input').on('change',function(event){
        $.fn.yunyeStorage.setHead("address",event.currentTarget.value);
    });
    $('#dpw_clock input').on('change',function(event){
        console.log(1);
        var inputs = $('#dpw_clock input');
        var arr = [];
        for(var i = 0 ; i < inputs.length ; i ++){
             arr.push(inputs[i].value);
        }
        $.fn.yunyeStorage.setHead("clock",arr);
    });
});