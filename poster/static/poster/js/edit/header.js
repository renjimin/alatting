$(function () {
    $(".back-to-home").click(function () {
        var url = $(this).data("url");
        yyConfirm("您确定要退出海报编辑吗？<br>确定后将自动保存已编辑的数据！", function () {
            //todo:lyh:异步调用保存方法，将本地缓存数据保存至数据库,
            //保存操作完成后进行页面跳转
            window.location.href = url;
        });
    });

    var saveData = function () {
        setHeadTimeStamp("phone", $('phoneInput').val());
        setHeadTimeStamp("mobile", $('mobileInput').val());
        setHeadTimeStamp("email", $('emailInput').val());

        if ($('.header-logo h2')[0]) {
            setHeadTimeStamp("logo_text", $('.header-logo h2').html());
            setHeadTimeStamp("logoTitleType", "text");
            setHeadTimeStamp("logo_image", "");
        } else {
            setHeadTimeStamp("logo_text", "");
            setHeadTimeStamp("logoTitleType", "image");
            setHeadTimeStamp("logo_image", {
                url: $('.header-logo img').attr("src"),
                id: $('.header-logo img').attr("data-src-id")
            });
        }
    };

    window.onunload = function (event) {
        saveData();
    };

    $(".btn.btn-save").on("click", function () {
        //saveData();
        var full_json = JSON.stringify(storageAPI.getPosterData());
        var url = '/api/v1/poster/save/' + storageKey.replace("yunyeTemplateData", "") + '/';
        $.ajax({
            type: 'PATCH',
            dataType: 'json',
            data: {"data": full_json},
            url: url,
            success: function (data) {
                yyAlert("保存成功");
                console.log(data)
            },
            error: function (xhr, status, statusText) {
                if (xhr.status == 500) {
                    yyAlert("服务器内部错误");
                }
            }
        })
    });

    $(".btn.btn-post").on("click", function () {
        var full_json = JSON.stringify(storageAPI.getPosterData());
        var url = '/api/v1/poster/publish/' + storageKey.replace("yunyeTemplateData", "") + '/';
        $.ajax({
            type: 'PATCH',
            dataType: 'json',
            data: {"data": full_json},
            url: url,
            success: function (data) {
                yyAlert("发布成功");
                console.log(data)
            },
            error: function (xhr, status, statusText) {
                if (xhr.status == 500) {
                    yyAlert("服务器内部错误，请联系程序猿。");
                }
            }
        })
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
});