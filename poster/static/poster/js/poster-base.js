<<<<<<< HEAD
$(function(){
=======
$(function(){   
>>>>>>> 54d00efaa991bc39cf8dd4ddf5e99bfa3675ae6c
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
            eval:'$("#dp").height($(document.body).height() - _this.offset().top - $("bar-footer bar").height()-40)',
            dynamicClass:'info'
        });
    $('.header-logo').registerPopUp({
            id:'dpw_menu',
<<<<<<< HEAD
            offsetYPercent:50,
            offsetY:30,
            list:[{icon:"ico-email",text:"打字",callback:function(){console.log(1);}},
=======
            list:[{icon:"ico-email",text:"打字"},
>>>>>>> 54d00efaa991bc39cf8dd4ddf5e99bfa3675ae6c
                {icon:"ico-phone",text:" 上传图片"},
                {icon:"ico-address",text:"照相"},
                {icon:"ico-clock",text:"图片链接"}],
        });
    $('.mask').registerPopUp({
            id:'dpw_header',
            offsetXPercent:80,
            offsetYPercent:90,
            offsetY:30,
            arrowOffset:80,
            list:[{icon:"ico-email",text:"系统图案",callback:function(){
                $('.header').bgselect({}, function (ths,img) {
                    console.log(img)
                    ths.css('background-image', 'url(' + img + ')');
                    ths.css('background-size', 'cover');
                })
            }},
                {icon:"ico-phone",text:" 上传图片",callback:function(){
                    $.fn.uploads.showDialog(function(){
                        console.log("heh");
                    });

                }},
                {icon:"ico-address",text:"照相"},
                {icon:"ico-clock",text:"图片链接"}],
        });
    $(document).on("clsdp",function(){
        $("#colorBox").hide();
    });
    $(document).on("click",'#closebg',function(event){
        $(".system-item").fadeOut(200);
    });

    $('.glyphicon-text-height').on('click',function(){
        $("#colorBox").show();
        $(this).colorSelect({clbox:'colorBox'},function(ths,color){
            ths.css('color',color);
        });
    });

    $('body').on('click',function(event){
        var dpw = $('#dp');
        var list = window.clickItmList;
        for(var i in list){
            if($(event.target).closest(list[i]).length!=0)return;
        }
        dpw.removeClass('open');
    });

    //数据
    $('#dpw_title input').on('change',function(event){
        $('.edit-bar-header .title p').html(event.currentTarget.value);
    });
    $('#dpw_desc textarea').on('change',function(event){
        $('.header-info .desc span').html(event.currentTarget.value);
<<<<<<< HEAD
=======
        storageAPI.setHead("desc",event.currentTarget.value);
    });
    $('#dpw_phone input:eq(0)').on('change',function(event){
        storageAPI.setHead("phone",event.currentTarget.value);
    });
    $('#dpw_phone input:eq(1)').on('change',function(event){
        storageAPI.setHead("mobile",event.currentTarget.value);
    });
    $('#dpw_email input').on('change',function(event){
        storageAPI.setHead("email",event.currentTarget.value);
    });
    $('#dpw_address input').on('change',function(event){
        storageAPI.setHead("address",event.currentTarget.value);
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
                $(event.target).blur().val("");
                yyConfirm("结束时间不能早于开始时间");
            }
        }
        storageAPI.setHead("clock",arr);
>>>>>>> 54d00efaa991bc39cf8dd4ddf5e99bfa3675ae6c
    });


});