
$(function () {
    document.getElementById('postFile').onchange = function () {
        var val = this.value;
        var upLoadType = '.jpg,.gif,.png,.jpeg'; //['.jpg','.gif','.png']; //可上传的格式
        var fileExt = val.substr(val.lastIndexOf(".")).toLowerCase();
        var result = upLoadType.indexOf(fileExt);
        var _alertMsg = document.getElementById('error_text');
        var oFReader = new FileReader();
        if (this.files.length === 0) {
            return;
        }
        var oFile = this.files[0];

        if (oFile.size / 1024 < 100) {
            _alertMsg.innerHTML = "<font style='color:blue'></font>";
        }
        if (result < 0) {
            //_alertMsg.innerHTML="请输入正确格式:" + upLoadType;
            yyAlert("请输入正确格式:" + upLoadType);
            return;

        } else {
            _alertMsg.innerHTML = "<font style='color:blue'></font>";
        }

        oFReader.readAsDataURL(oFile);
        oFReader.onload = function (oFREvent) {
            document.getElementById("uploadPreview").src = oFREvent.target.result;
        };
    };

    var updateAction = false,
        posterId = $("#posterId").val();
    if(posterId && posterId != ""){
        updateAction = true;
    }

    var checkSlugName = function (callback) {
        var slug = $.trim($('.slug-name').val());
        if (updateAction) {
            if(callback){
                callback();
            }
        } else {
            var url = '/api/v1/poster/check/unique/';
            if (slug == '') {
                $.fn.yyTools.mask();
                return false;
            }
            $.ajax({
                url: url,
                data: {slug: encodeURIComponent(slug)},
                type: "GET",
                success: function (resp) {
                    if (resp.exists) {
                        $.fn.yyTools.mask();
                        yyAlert('海报的链接名称已经存在,请更换!');
                    } else {
                        if (callback) {
                            callback();
                        }
                    }
                },
                error: function (xhr, status, responseText) {
                    $.fn.yyTools.mask();
                    if(xhr && xhr.responseJSON && xhr.responseJSON.detail){
                        yyAlert(xhr.responseJSON.detail);
                    }else{
                        yyAlert('网络错误,请稍后再试!');
                    }
                    return false;
                }
            });
        }
    };

    var checkPosterFormValues = function () {
        var postname = $.trim($('.post-name').val()),
            postdesc = $.trim($('.post-desc').val()),
            posteimg = $.trim($('.post-img').val()),
            postemail = $.trim($('.post-email').val()),
            posttelephone = $.trim($('.post-telephone').val()),
            postphone = $.trim($('.post-phone').val()),
            postaddress = $.trim($('.post-address').val()),
            slug = $.trim($('.slug-name').val());

        if(postname == ""){
            yyAlert('请输入海报名称!');
            return false;
        }
        if(slug == ""){
            yyAlert('请输入海报链接名称!');
            return false;
        }
        if(!slug.match(/^([a-zA-Z0-9_-])*$/)){
            yyAlert('链接名称应由字母、数字、下划线或横线组成!');
            return false;
        }
        if (postdesc == '') {
            yyAlert('请输入海报简述!');
            return false;
        }
        /*if (posteimg == '' && !updateAction) {
            yyAlert('请选择海报logo图片!');
            return false;
        }*/
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (postemail == '') {
            yyAlert('请输入email!');
            return false;
        } else if (!reg.test(postemail)) {
            yyAlert('email格式不正确!');
            return false;
        }
        var reg2 = /^0\d{2,3}|^[4]00\-?\d{7}$/;
        var reg4 = /^[4]00\d{7}$/;
        if (posttelephone == '') {
            yyAlert('请输入电话号码!');
            return false;
        // }else if(posttelephone.substring(0,3)=="400"&&posttelephone.replace("-","").length!=10){
        //     yyAlert('400电话号码格式不正确!');
        //     return false;
        }else if(!reg2.test(posttelephone)){
            yyAlert('电话号码格式不正确!');
            return false;
        }

        var reg3 = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
        if (postphone == '') {
            yyAlert('请输入手机号码!');
            return false;
        } else if (!reg3.test(postphone)) {
            yyAlert('手机号码格式不正确!');
            return false;
        }
        if (postaddress == '') {
            yyAlert('请输入地址!');
            return false;
        }
        $.fn.yyTools.mask(1);

        checkSlugName(function(){
            $("#form-info").submit();
        });
    };

    $(".poster-form-back-btn").click(function () {
        var backUrl = $(this).data("back-url");
        yyConfirm("当前输入信息会丢失,您确定要返回吗?", function () {
            window.location.href = backUrl;
        });
    });

    $(".poster-form-submit-btn").click(function () {
        checkPosterFormValues();
    });

    $('#form-info input[type="text"]').on('focus',function(event){
        var _this = $(this);
        event.preventDefault();
       var bodySt = $('body').scrollTop();
        setTimeout(function(){
            var st = $(window).height()/2;
            if($('body').scrollTop() - bodySt > 50){
                return;
            }
             if(_this.offset().top > st){
                 $('body').animate({scrollTop:_this.offset().top - st + _this.height()/2 + 80},200);
             }
        },500)
        
    });
});
