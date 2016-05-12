$(function(){
    var menuOptions = {
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

    var sqOption = $.extend({id: 'sq_menu'}, menuOptions);
    $('.yunye-template').registerPopUp(sqOption);
});

