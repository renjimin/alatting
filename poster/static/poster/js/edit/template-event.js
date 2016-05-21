/**
 * Created by lyhapple on 16/5/17.
 * 编辑模板时，通用绑定js事件模块
 */

$(function () {
    var menuOptions = {
        //suspendFun: function () {
        //    return $("section[class='dropdown-panel open']").length <= 0;
        //},
        offsetYPercent: 50,
        offsetY: 30,
        followMouse: true,
        list: [
            {
                icon: "glyphicon glyphicon-picture",
                text: "轮播图",
                callback: function (_this) {
                    _this.openSliderUpload();

                    $('#uploaderContainer').diyUpload({
                        url: '/api/v1/poster/upload/logo',
                        success: function (data, file) {
                            data.imgid = file.id;
                            _this.imgslider({'data': data});
                            //$(".upload-image-dialog").removeClass('open');
                            //console.info(data);
                        },
                        error: function (err) {
                            console.info(err);
                        },
                        buttonText: '添加图片',
                        chunked: false,
                        fileNumLimit: 4,
                        fileSingleSizeLimit: 5 * 1024 * 1024,
                        accept: 'image/jpg,image/jpeg,image/png,image/gif',
                        compress: false,
                        threads: 1,
                        sliderContainer: _this
                    });
                    $(".closefile").click(function () {
                        $(".upload-image-dialog").removeClass('open');
                    });
                }
            },

            {
                icon: "glyphicon glyphicon-picture",
                text: "上传图片",
                callback: function (obj) {
                    $.fn.uploads.showDialog(function (data) {
                        if(!/\.(gif|jpg|jpeg|bmp)$/.test(data.file)){
                            yyAlert("上传图片格式错误");
                            return false;
                        }
                        if (obj) {
                            obj.empty().append('<img src="' + data.file + '"/>');
                        }
                        obj.imgoperation({'data': data});
                    });
                }
            },
            {
                icon: "glyphicon glyphicon-facetime-video",
                text: "上传视频",
                callback: function (obj) {
                    //alert("还是调用上传组件!");
                    $.fn.uploads.showDialog(function (data) {
                        if(!/\.(mp4|ogg|webm)$/.test(data.file)){
                            yyAlert("上传视频格式错误");
                            return false;
                        }
                        if (obj) {
                            obj.empty().append('<video autoplay src="' + data.file + '"></video>');
                        }
                        obj.imgoperation({'data': data});
                        }, function (data) {
                            yyAlert("上传失败");
                        });
                }
            },
            {
                icon: "glyphicon glyphicon-camera",
                text: "照相",
                callback: function () {
                    alert("调用照相机");
                }
            },
            {
                icon: "glyphicon glyphicon-link",
                text: "图片链接",
                callback: function (obj) {
                    obj.resourceLink();
                    obj.imgoperation({'data': data});
                }
            }]
    };

    var selector = $(".yunye-template > .content > div");

    // 注册上下文菜单
    $.each(selector, function (i, div) {
        var opt,
            $this = $(div),
            id = 'div_dropdown_menu' + i;
        if (i == (selector.length - 1)) {
            opt = $.extend({id: id, orientation: 1}, menuOptions);
        } else {
            opt = $.extend({id: id}, menuOptions);
        }
        $this.registerPopUp(opt);
    });
});
