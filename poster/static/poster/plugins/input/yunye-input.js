(function($){
    var layoutTmpl = '<div class="resource-link-layout-wrap">' +
        '<div class="resource-link-layout">' +
        '<div class="link-header">' +
            '<span class="glyphicon glyphicon-link"></span> 图片视频链接' +
            '<a href="javascript:void(0);" class="link-head-btn destroy-link-layout"><span class="glyphicon glyphicon-remove"></span></a>' +
            '<a href="javascript:void(0);" class="link-head-btn confirm-link-input"><span class="glyphicon glyphicon-ok"></span></a>' +
        '</div>' +
        '<div class="link-body">' +
            '<div class="link-body-inner"></div>' +
        '</div>' +
        '<div class="link-input">' +
            '<div class="input-group">' +
                '<input type="text" class="form-control input-lg" id="resourceLinkText" placeholder="请输入图片或视频链接">' +
                '<span class="input-group-btn">' +
                    '<button class="btn btn-default btn-lg" type="button" id="resourceLinkBtn">' +
                        '<span class="glyphicon glyphicon-link"></span>' +
                    '</button>' +
                '</span>' +
            '</div>' +
        '</div>' +
        '</div></div>';

    var imageDom = '<img src="{0}" width="100%">',
        videoDom = '<video width="100%" controls>' +
            '<source src="{0}" type="video/mp4">' +
            '<source src="{0}" type="video/ogg">' +
            '<source src="{0}" type="video/webm">' +
        '</video>';

    var getImageDom = function(url){
        return imageDom.format(url);
    };
    var getVideoDom = function(url){
        return videoDom.format(url);
    };

    var methods = {
        "init": function(options){
            var settings = $.extend({
            }, options);

            var setResourcePreview = function(url){
                var typeName = $.fn.yyTools.getFileTypeName(url),
                    preDom = "";
                if(typeName == "image"){
                    preDom = getImageDom(url);
                }else if(typeName == "video"){
                    preDom = getVideoDom(url);
                }else{
                    yyAlert("不支持此格式的链接");
                    preDom = false;
                    return preDom;
                }
                $(".link-body-inner").empty().append(preDom);
                return preDom;
            };

            return this.each(function(){
                $("body").append(layoutTmpl);
                var $this = $(this);
                var $btn = $("#resourceLinkBtn"),
                    $destroyBtn = $(".destroy-link-layout"),
                    $confirmBtn = $(".confirm-link-input");

                $btn.click(function(){
                    var text = $.trim($("#resourceLinkText").val());
                    if(!text.match("^http://")){
                        yyAlert("链接地址格式不正确,应以http://开始");
                        return;
                    }
                    setResourcePreview(text);
                });

                $destroyBtn.click(function(){
                   $this.resourceLink('destroy');
                });

                $confirmBtn.click(function(){
                    var text = $.trim($("#resourceLinkText").val());
                    if(text == ""){
                        yyAlert("请输入图片或视频链接地址");
                        return;
                    }
                    if(!text.match("^http://")){
                        yyAlert("链接地址格式不正确,应以http://开始");
                        return;
                    }
                    var retDom = setResourcePreview(text);
                    if(retDom !== false){
                        $this.empty().append(retDom);
                        $this.resourceLink('destroy');
                    }
                });
            });
        },

        "destroy": function () {
            return this.each(function(){
                $(".resource-link-layout-wrap").remove();
            });
        }
    };

    $.fn.resourceLink = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('方法 ' + method + ' 不存在');
        }
    };
})(jQuery);
