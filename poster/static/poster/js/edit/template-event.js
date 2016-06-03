/**
 * Created by lyhapple on 16/5/17.
 * 编辑模板时，通用绑定js事件模块
 */

$(function() {
    var menuOptions = {
        //suspendFun: function () {
        //    return $("section[class='dropdown-panel open']").length <= 0;
        //},
        offsetYPercent: 50,
        offsetY: 30,
        followMouse: true,
        list: [{
                icon: "glyphicon glyphicon-picture",
                text: "轮播图",
                callback: function(_this) {
                    _this.openSliderUpload();

                    $('#uploaderContainer').diyUpload({
                        url: '/api/v1/poster/upload/logo',
                        buttonText: '添加图片',
                        chunked: false,
                        fileNumLimit: 4,
                        fileSingleSizeLimit: 5 * 1024 * 1024,
                        accept: {
                            title: 'Images',
                            extensions: 'gif,jpg,jpeg,png',
                            mimeTypes: 'image/*'
                        },
                        compress: false,
                        threads: 1,
                        auto: true,
                        success: function(data, file) {
                            data.imgid = file.id;
                            _this.imgslider({
                                'data': data
                            });
                            //$(".upload-image-dialog").removeClass('open');
                            //console.info(data);
                        },
                        error: function(err) {
                            console.info(err);
                        },

                        sliderContainer: _this
                    });
                    $(".closefile,.file-bottom .btn").click(function() {
                        $(".upload-image-dialog").removeClass('open');
                    });
                }
            },

            {
                icon: "glyphicon glyphicon-picture",
                text: "上传图片",
                callback: function(obj) {
                    $.fn.uploads.showDialog(function(data) {
                        if (obj) {
                            obj.empty().append('<img src="' + data.file + '"/>');
                        }
                        obj.imgoperation({
                            'data': data
                        });

                        $.fn.yyTools.mask();
                    });
                }
            }, {
                icon: "glyphicon glyphicon-facetime-video",
                text: "上传视频",
                callback: function(obj) {
                    //alert("还是调用上传组件!");
                    $.fn.uploadsvideo.showDialog(function(data) {
                        if (obj) {
                            //obj.empty().append('<video autoplay src="' + data.file + '"></video>');
                            obj.empty();
                            $("#videoDomTmpl").tmpl({
                                "class_name": "video_content",
                                "video_dom_id": data.id,
                                "video_id": data.id,
                                "video_preview_img": data.preview,
                                "video_url": data.file
                            }).appendTo(obj);
                            //videojs.initialize('video_' + data.id);
                        }
                        obj.imgoperation({
                            'data': data
                        });

                        $.fn.yyTools.mask(0);

                    }, function(data) {
                        yyAlert("上传失败");
                    });
                }
            }, {
                icon: "glyphicon glyphicon-camera",
                text: "照相",
                callback: function() {
                    alert("调用照相机");
                }
            }, {
                icon: "glyphicon glyphicon-link",
                text: "图片链接",
                callback: function(obj) {
                    obj.resourceLink();
                    /*obj.imgoperation({'data': data});*/
                }
            }
        ]
    };

    var selector = $(".yunye-template > .content > div");

    // 注册上下文菜单
    $.each(selector, function(i, div) {
        var opt,
            $this = $(div),
            id = 'div_dropdown_menu' + i;
        if (i == (selector.length - 1)) {
            opt = $.extend({
                id: id,
                orientation: 1
            }, menuOptions);
        } else {
            opt = $.extend({
                id: id
            }, menuOptions);
        }
        $this.registerPopUp(opt);
        if ($this.find('.swiper-container').length > 0) {
            $(this).imgslider();
        } else if ($this.find('img').length > 0) {
            $(this).imgoperation();
        }
    });
    $(".yunye-template .cnd-element").each(function() {
        scale($(this));
    });
    setTimeout(function(){
        $('.header-logo').imgoperationlogo();
    },200)

});