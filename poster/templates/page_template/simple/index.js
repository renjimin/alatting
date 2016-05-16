$(function(){
    var menuOptions = {
        suspendFun: function(){
            return $("section[class='dropdown-panel open']").length <= 0;
        },
        offsetYPercent: 50,
        offsetY: 30,
        list: [
            {
                icon: "ico-email",
                text: "上传图片",
                callback: function (_this) {
                    $(".dialog").animate({top: '0px'});
                    $('#as').diyUpload({
                    url: '/api/v1/poster/upload/logo',
                    success: function (data) {
                        _this.imgslider({'data': data});
                        $(".dialog").animate({top: '100%'});
                        //console.info(data);
                    },
                    error: function (err) {
                        //console.info(err);
                    },

                    buttonText: '选择图片上传',
                    chunked: false,
                    fileNumLimit: 8,
                    fileSingleSizeLimit: 5 * 1024 * 1024,
                    accept: 'image/jpg,image/jpeg,image/png,image/gif',
                    threads: 1

                    });
                }
            },
            {
                icon: "ico-phone",
                text: "上传视频",
                callback: function(){
                    alert("还是调用上传组件!");
                }
            },
            {
                icon: "ico-address",
                text: "照相",
                callback: function () {
                    alert("调用照相机");
                }
            },
            {
                icon: "ico-clock",
                text: "图片链接",
                callback: function () {
                    alert("弹出图片链接编辑层");
                }
            }]
    };

    var topOption = $.extend({id: 'content_top_menu'}, menuOptions),
        midOption = $.extend({id: 'content_mid_menu'}, menuOptions),
        btmOption = $.extend(
            {id: 'content_btm_menu', orientation: 1},
            menuOptions
        );
    $('.content-top').registerPopUp(topOption);
    $('.content-middle').registerPopUp(midOption);
    $('.content-bottom').registerPopUp(btmOption);






    $(".closefile").click(function(){
    $(".dialog").hide();
    })



});

