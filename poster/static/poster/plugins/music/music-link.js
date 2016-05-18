(function($){
    var layoutTmpl = '<div class="music-link-layout-wrap">' +
        '<div class="musiclink-input">' +
            '<div class="input-group">' +
                '<input type="text" class="form-control input-lg" id="musicLinkText" placeholder="URL">' +
                '<span class="input-group-btn">' +
                    '<button class="btn btn-default btn-lg" type="button" id="musicLinkBtn">' +
                        '<span class="glyphicon glyphicon-link"></span>' +
                    '</button>' +
                '</span>' +
            '</div>' +
        '</div><div class= "music-arrow"><span class = "glyphicon glyphicon-triangle-bottom"></span></div></div>';

    var audioDom = '<audio width="100%" controls>' +
            '<source src="{0}" type="audio/mp3">' +
            '<source src="{0}" type="audio/wav">' +
            '<source src="{0}" type="audio/ogg">' +
        '</audio>';

    var getAudioDomDom = function(url){
        return audioDom.format(url);
    };

    var methods = {
        "init": function(options){
            var $this = $(this);
            var settings = $.extend({
            }, options);

            var setResourcePreview = function(url){
                var typeName = $.fn.yyTools.getFileTypeName(url),
                    preDom = "";
                if(typeName == "audio"){
                    preDom = getAudioDomDom(url);
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
                console.log($this);
                var $btn = $("#musicLinkBtn"),
                    $destroyBtn = $(".destroy-link-layout"),
                    $confirmBtn = $(".confirm-link-input");

                $btn.click(function(){
                    var text = $.trim($("#musicLinkText").val());
                    console.log(text)
                    if(!text.match("^http://")){
                        yyAlert("链接地址格式不正确,应以http://开始");
                        return;
                    }
                    setResourcePreview(text);
                });

                $destroyBtn.click(function(){
                   $this.musicLink('destroy');
                });

                $confirmBtn.click(function(){
                    var text = $.trim($("#musicLinkText").val());
                    if(text == ""){
                        yyAlert("请输入音频链接地址");
                        return;
                    }
                    if(!text.match("^http://")){
                        yyAlert("链接地址格式不正确,应以http://开始");
                        return;
                    }
                    var retDom = setResourcePreview(text);
                    if(retDom !== false){
                        $this.empty().append(retDom);
                        $this.musicLink('destroy');
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

    $.fn.musicLink = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('方法 ' + method + ' 不存在');
        }
    };
})(jQuery);
