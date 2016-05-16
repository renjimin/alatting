
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

    var checkPosterName = function (callback) {
        var postname = $.trim($('.post-name').val());
        if (updateAction) {
            if(callback){
                callback();
            }
        } else {
            var url = '/api/v1/poster/check/unique/';
            if (postname == '') {
                return false;
            }
            $.ajax({
                url: url,
                data: {name: encodeURIComponent(postname)},
                type: "GET",
                success: function (data) {
                    if (data.exists) {
                        yyAlert('海报名称已经存在,请更换!');
                    } else {
                        if (callback) {
                            callback();
                        }
                    }
                },
                error: function () {
                    yyAlert('网络错误,请稍后再试!');
                    return false;
                }
            });
        }
    };

    $(".post-name").blur(function () {
        checkPosterName();
    });

    var checkPosterFormValues = function () {
        var postdesc = $.trim($('.post-desc').val()),
            posteimg = $.trim($('.post-img').val()),
            postemail = $.trim($('.post-email').val()),
            posttelephone = $.trim($('.post-telephone').val()),
            postphone = $.trim($('.post-phone').val()),
            postaddress = $.trim($('.post-address').val());

        if (postdesc == '') {
            yyAlert('海报简述不能为空!');
            return false;
        }
        if (posteimg == '' && !updateAction) {
            yyAlert('海报logo不能为空!');
            return false;
        }
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (postemail == '') {
            yyAlert('email不能为空!');
            return false;
        } else if (!reg.test(postemail)) {
            yyAlert('email格式不正确!');
            return false;
        }
        var reg2 = /^0\d{2,3}-?\d{7,8}$/;
        if (posttelephone == '') {
            yyAlert('电话不能为空!');
            return false;
        } else if (!reg2.test(posttelephone)) {
            yyAlert('电话格式不正确!');
            return false;
        }
        var reg3 = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
        if (postphone == '') {
            yyAlert('手机不能为空!');
            return false;
        } else if (!reg3.test(postphone)) {
            yyAlert('手机格式不正确!');
            return false;
        }
        if (postaddress == '') {
            yyAlert('地址不能为空!');
            return false;
        }
        $("#form-info").submit();
    };

    $(".poster-form-back-btn").click(function () {
        var backUrl = $(this).data("back-url");
        yyConfirm("当前输入信息会丢失,您确定要返回吗?", function () {
            window.location.href = backUrl;
        });
    });

    $(".poster-form-submit-btn").click(function () {
        checkPosterName(
            checkPosterFormValues
        );
    });
});
