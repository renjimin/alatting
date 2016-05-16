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
                callback: function () {
                    alert("调用上传组件!");
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
});

