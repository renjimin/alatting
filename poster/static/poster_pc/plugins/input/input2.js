
$(function(){
    var $btn = $("#resourceLinkBtn");
    $btn.click(function(){
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

        var setResourcePreview = function(url){
            var typeName = $.fn.yyTools.getFileTypeName(url),
                preDom = "";
            console.log(typeName);
            if(typeName == "image"){
                preDom = getImageDom(url);
            }else if(typeName == "video"){
                preDom = getVideoDom(url);
            }else{
                yyAlert("不支持此格式的链接");
                preDom = false;
                return preDom;
            }
            return preDom;
        };


          var text = $.trim($("#resourceLinkText").val());
            if(text == ""){
                yyAlert("请输入图片或视频链接地址");
                return;
            }
            if(!text.match("^http://")){
                yyAlert("链接地址格式不正确,应以http://开始");
                return;
            }

        var imgele = setResourcePreview(text);

        $(".link-body-inner").empty().append(imgele);
        var target = Editor.require("hightClick").getCurrentTarget();
        target.empty().append(imgele);
        //imgele.imgoperation()
       //console.log(imgele);
        //console.log($(imgele).height())
        setTimeout(function(){
            target.imgoperation();
        },100);

    })


    


})