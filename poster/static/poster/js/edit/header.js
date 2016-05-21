$(function () {
    var storageAPI = $.fn.yunyeStorage,
        saveData = function () {
            function parseStyle(string) {
                var atrributes = string.split(";");
                var returns = {};
                for (var i in atrributes) {
                    if (i == atrributes.length - 1)return returns;
                    var key = $.trim(atrributes[i].split(":")[0]),
                        value = $.trim(atrributes[i].split(":")[1]);
                    returns[key] = value;
                }
            }

            storageAPI.setHtml(".yunye-template");
            //电话手机邮箱
            storageAPI.setHead("phone", $('#phoneInput').val());
            storageAPI.setHead("mobile", $('#mobileInput').val());
            storageAPI.setHead("email", $('#emailInput').val());
            //logo
            if ($('.header-logo h2')[0]) {
                storageAPI.setHead("logo_title", $('.header-logo').html());
                storageAPI.setHead("logoTitleType", "text");
                storageAPI.setHead("logo_image", "");
            } else {
                storageAPI.setHead("logo_title", "");
                storageAPI.setHead("logoTitleType", "image");
                storageAPI.setHead("logo_image", {
                    url: $('.header-logo img').attr("src"),
                    id: $('.header-logo img').attr("data-src-id")
                });
            }
            if ($('#logo_title').attr("style"))storageAPI.setCss("logo_title", parseStyle($('#logo_title').attr("style")));
            storageAPI.setHead("unique_name", $('#logo_title').html());
            if ($('#short_description').attr("style"))storageAPI.setCss("short_description", parseStyle($('#short_description').attr("style")));
            storageAPI.setHead("short_description", $('#short_description').html());
            //日历周期性
            var lifetime = yunyeEditorGlobal.lifetime;
            if (lifetime.lifetime_type == "weekly") {
                var inputs = $(".weekly input");
                for (var i = 0; i < (inputs.length) / 2; i++) {
                    var weekName = (i == 6) ? "Sunday" : (i == 0) ? "Monday" : (i == 1) ? "Tuesday" : (i == 2) ? "Wednesday" : (i == 3) ? "Thursday" : (i == 4) ? "Friday" : "Saturday",
                        info = lifetime.lifetime_value[weekName];
                    info.time_start = inputs.eq(i * 2).val();
                    info.time_end = inputs.eq(i * 2 + 1).val();
                    info.enabled = $(".weekly td:eq(" + (i * 5 + 4) + ")").hasClass("off") ? 0 : 1;
                }
            }
            storageAPI.setHead("lifetime", lifetime);
        };

    $(".back-to-home").click(function () {
        var url = $(this).data("url");
        yyConfirm("您确定要退出海报编辑吗？<br>确定后将自动保存已编辑的数据！", function () {
            //todo:lyh:异步调用保存方法，将本地缓存数据保存至数据库,
            //保存操作完成后进行页面跳转
            window.location.href = url;
        });
    });

    $('.btn-page').registerPopUp({
        id: 'dpw_btn_page',
        offsetXPercent: 50,
        offsetYPercent: 50,
        offsetY: 30,
        arrowOffset: 30,
        orientation: 0,
        list: [
            {
                icon: "glyphicon glyphicon-file",
                text: "新增页面",
                callback: function () {
                    if (!$.fn.yunyeStorage) {
                        yyAlert("无法继续操作，需要yunyeStorage");
                        return false;
                    }
                    $("body").changeTemplate(
                        'destroy'
                    ).changeTemplate({
                            "target": "create",
                            "initAfter": function () {
                                $("#change-templates-list").css('height', "70%");
                            }
                        });
                }
            },
            {
                icon: "glyphicon glyphicon-duplicate",
                text: "复制页面",
                callback: function () {
                    if (!$.fn.yunyeStorage) {
                        yyAlert("无法继续操作，需要yunyeStorage");
                        return false;
                    }
                    yyConfirm("您确定要复制当前页面吗？", function () {
                        $.fn.yyTools.mask(1);
                        $.ajax({
                            type: "POST",
                            url: yunyeEditorGlobal.API.createPage,
                            dataType: "json",
                            data: {
                                "poster_id": yunyeEditorGlobal.posterId,
                                "template_id": yunyeEditorGlobal.templateId
                            },
                            success: function (posterPage) {
                                $.fn.yyTools.mask();
                                yyConfirm("复制页面成功, 是否立即跳转到新页面！", function () {
                                    window.location.href = "/poster/{0}/edit/{1}".format(
                                        yunyeEditorGlobal.posterId,
                                        posterPage.id
                                    );
                                });
                            },
                            error: function () {
                                $.fn.yyTools.mask();
                            }
                        });
                    });
                }
            }
        ]
    });



    $(".btn.btn-save").on("click", function () {
        saveData();
        var full_json = JSON.stringify(storageAPI.getPosterData());
        var url = yunyeEditorGlobal.API.save.format(
            yunyeEditorGlobal.posterId
        );
        $.ajax({
            type: 'PATCH',
            dataType: 'json',
            data: {"data": full_json},
            url: url,
            success: function (data) {
                yyAlert("保存成功");
            },
            error: function (xhr, status, statusText) {
                if (xhr.status == 500) {
                    yyAlert("保存失败，服务器内部错误");
                }
            }
        })
    });

    $(".btn.btn-post").on("click", function () {
        saveData();
        yunyeEditorGlobal.lifetime = {
            lifetime_type : "weekly",
            lifetime_timezone : "Asia/Shanghai",
            lifetime_value : {
                "Monday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Tuesday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Wednesday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Thursday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Friday": {time_start: "09:00", time_end: "17:00", enabled: 1},
                "Saturday": {time_start: "09:00", time_end: "17:00", enabled: 0},
                "Sunday": {time_start: "09:00", time_end: "17:00", enabled: 0}
            }
        };
        var full_json = JSON.stringify(storageAPI.getPosterData());
        var url = yunyeEditorGlobal.API.publish.format(
            yunyeEditorGlobal.posterId
        );
        $.ajax({
            type: 'PATCH',
            dataType: 'json',
            data: {"data": full_json},
            url: url,
            success: function (data) {
                yyAlert("发布成功");
            },
            error: function (xhr, status, statusText) {
                if (xhr.status == 500) {
                    yyAlert("发布失败，服务器内部错误");
                }
            }
        })
    });

    window.onunload = function (event) {
        saveData();
    }

});