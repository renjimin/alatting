/**
 *
 */
$(document).ready(function () {
    $("#id_username").prop('value', localStorage.getItem("username"));
    $("#id_password").prop('value', localStorage.getItem("password"));
    //获取设备高度（软键盘调出来时高度也会变小，所以在点击事件前获取）

    var deviceH = document.documentElement.clientHeight + "px";

    //表单获得焦点后动态改变body和背景图片的大小
    $('input').on("click", function () {
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
        if (username != null && password != null) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
        }
    });
    /*登陆界面注册页面跳转*/
    $("#register").click(function () {
        window.location.href = "/account/register";
    })
    /*点击获取验证码*/
    var code = "";
    $("#btncode").click(function () {
        $("#btncodeoff").show();
        $("#btncode").hide();
        var btncodeoff = document.getElementById("btncodeoff");
        settime(btncodeoff);
        var EMAIL_REGEXP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        var PHONE_REGEXP = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
        var username = $("#id_username").val();
        if (!username) {
            yyAlert("请输入用户名");
            return false;
        }
        if (!PHONE_REGEXP.test(username) && !EMAIL_REGEXP.test(username)) {
            yyAlert("手机号码或邮箱号格式不对");
            return false;
        }
        $.ajax({
            type: 'POST',
            url: '/account/send_message',
            data: {"username": username},
            success: function (data) {
                if (PHONE_REGEXP.test(username)) {
                    code = data.message;
                    yyAlert(data.message);
                }
            },
            error: function (data) {
                yyAlert(data.message);
            }
        })
    })
    /*忘记密码点击确定*/
    $("#btnsure").click(function () {
        var writecode = $("#id_message").val();
        var username = $("#id_username").val();
        if (!writecode) {
            yyAlert("请填写验证码");
            return false;
        }
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
            }
        })
    })
    /*重置密码点击事件*/
    $("#btnpwd").click(function () {
        var username = $("#id_username").val();
        var password1 = $("#password1").val();
        var password2 = $("#password2").val();
        $.ajax({
            type: 'POST',
            url: '/account/reset_password',
            data: {
                "username": username,
                "password1": password1,
                "password2": password2
            },
            success: function (data) {
                // yyAlert(data.detail, function () {
                window.location.href = "/account/login"
                //});
            },
            error: function (data) {
                yyAlert(data.detail);
            }
        })
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
        }
        setTimeout(function () {
            settime(val)
        }, 1000)
    }
});

