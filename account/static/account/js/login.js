/**
 *
 */
$(document).ready(function () {
    $("#id_username").prop('value', localStorage.getItem("username"));
    $("#id_password").prop('value', localStorage.getItem("password"));
    var EMAIL_REGEXP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var PHONE_REGEXP = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
    //获取设备高度（软键盘调出来时高度也会变小，所以在点击事件前获取）
    var deviceH = document.documentElement.clientHeight + "px";

    //表单获得焦点后动态改变body和背景图片的大小
    $('#id_username,#id_password').on("click", function () {
        $("body").attr("style", "background:url('/static/account/img/platform_mobile_yunye.png') no-repeat;width:100%;height:" + deviceH + ";background-size: 100%" + deviceH);
    });
    if ($("#checkout").attr("checked") == "checked") {
        var username = $("#id_username").val();
        var password = $("#id_password").val();
        if (username != null && password != null) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
        }
    } else {
        //localStorage.clear();
    }

    $("#btnok").click(function () {
        var username = $("#id_username").val();
        var password = $("#id_password").val();
        if(!username){
            yyAlert("请输入邮箱/手机号");
            return false;
        }
        if(!password){
            yyAlert("请输入密码");
            return false;
        }
        if ($("#btnchk").is(':checked')) {
            if (username != null && password != null) {
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
            }
        } else {
            localStorage.clear();
        }
        $("#btnLogin").submit();
    });
    /*登陆界面注册页面跳转*/
    $("#register").click(function () {
        window.location.href = "/account/register";
    })
    /*注册点击获取验证码*/
    $("#btncode").click(function () {

        var btncodeoff = document.getElementById("btncodeoff");
        var username = $("#rg_username").val();
        if (!username) {
            yyAlert("请输入邮箱/手机号");
            return false;
        }
        if (!PHONE_REGEXP.test(username) && !EMAIL_REGEXP.test(username)) {
            yyAlert("手机号码或邮箱号格式不对");
            return false;
        }

        $.ajax({
            type: 'POST',
            url: '/account/send_message',
            data: {
                "username": username,
                "user_existed": "0"
            },
            success: function (data) {
                if (typeof(data.warning) != "undefined") {
                    yyAlert(data.warning);
                    return false;
                }
                $("#btncodeoff").show();
                $("#btncode").hide();
                settime(btncodeoff);
                if (PHONE_REGEXP.test(username)) {
                    yyAlert(data.message);
                }
            },
            error: function (xhr, status, statusText) {
                if (xhr.status == 403) {
                    yyAlert(" 用户已存在");
                }
                else if (xhr.status == 401) {
                    yyAlert("请用邮箱/手机号注册");
                }
                else {
                    yyAlert("参数错误");
                }
            }
        })
    });
    $("#btnregist").click(function () {
        var username = $.trim($("#rg_username").val());
        var code = $("#id_message").val();
        var password1 = $("#id_password1").val();
        var password2 = $("#id_password2").val();
        if (!username) {
            yyAlert("请输入邮箱/手机号");
            return false;
        }
        if (!code) {
            yyAlert("请输入验证码");
            return false;
        }
        if (!password1) {
            yyAlert("请输入密码");
            return false;
        }
        if (!password2) {
            yyAlert("请再次输入密码");
            return false;
        }
        $("#registForm").submit();
    });
    /*忘记密码后获取验证码*/
    $("#btncode-psd").click(function () {
        var btncodeoff = document.getElementById("btncodeoff-psd");
        var username = $("#username").val();
        if (!username) {
            yyAlert("请输入已注册的邮箱/手机号");
            return false;
        }
        if (!PHONE_REGEXP.test(username) && !EMAIL_REGEXP.test(username)) {
            yyAlert("手机号码或邮箱号格式不对");
            return false;
        }
        $.ajax({
            type: 'POST',
            url: '/account/send_message',
            data: {
                "username": username,
                "user_existed": "1"
            },
            success: function (data) {
                $("#btncodeoff-psd").show();
                $("#btncode-psd").hide();
                settimepsd(btncodeoff);
                if (PHONE_REGEXP.test(username)) {
                    yyAlert(data.message);
                }
            },
            error: function (xhr, status, statusText) {
                if (xhr.status == 403) {
                    yyAlert("用户未注册");
                }
                else if (xhr.status == 401) {
                    yyAlert("帐号格式错误");
                }
                else {
                    yyAlert("参数错误");
                }
            }
        })
    })
    /*忘记密码点击确定*/
    $("#btnsure").click(function () {
        var writecode = $("#message").val();
        var username = $.trim($("#username").val());
        if (!username) {
            yyAlert("请填写用户名");
            return false;
        }
        if (!writecode) {
            yyAlert("请填写验证码");
            return false;
        }
        $("#resetUsername").text(username);
        $("#id_username").val(username);
        $.ajax({
            type: 'POST',
            url: '/account/auth_message',
            data: {
                "username": username,
                "message": writecode
            },
            success: function (data) {
                $(".forget-reset").show();
                $(".forget-pwd").hide();
            },
            error: function (xhr, status, statusText) {
                if (xhr.status == 401) {
                    yyAlert("验证码不正确或已过期");
                }
                if (xhr.status == 404) {
                    yyAlert("该用户未注册");
                }
            }
        })
    })
    $("#btnFpwd").click(function () {
        var password1 = $("#password1").val();
        var password2 = $("#password2").val();
        if (password1 != password2) {
            yyAlert("两次输入密码不一致");
            return false;
        }
        $("#forgetForm").submit();
    })
    var countdown = 60;

    function settime(val) {
        if (countdown <= 0) {
            $("#btncodeoff").hide();
            $("#btncode").show();
            val.removeAttribute("disabled");
            val.value = "获取验证码";
            countdown = 60;
        } else {
            val.setAttribute("disabled", true);
            val.value = "获取验证码(" + countdown + ")";
            countdown--;
            setTimeout(function () {
                settime(val)
            }, 1000)
        }
    }

    function settimepsd(val) {
        if (countdown <= 0) {
            $("#btncodeoff-psd").hide();
            $("#btncode-psd").show();
            val.removeAttribute("disabled");
            val.value = "获取验证码";
            countdown = 60;
        } else {
            val.setAttribute("disabled", true);
            val.value = "获取验证码(" + countdown + ")";
            countdown--;
            setTimeout(function () {
                settime(val)
            }, 1000)
        }

    }
});

