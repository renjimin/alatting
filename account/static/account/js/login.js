/**
 *
 */
$(document).ready(function () {

    /*登陆界面注册页面跳转*/
    $("#register").click(function () {
        window.location.href = "/account/register";
    })
    /*点击获取验证码*/
    $("#btncode").click(function () {
        //alert("11")
        /*$("#btncodeoff").show();
         $("#btncode").hide();*/
        /*var btncodeoff = document.getElementById("btncodeoff");
         settime(btncodeoff);*/
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
                    yyAlert(data.message);
                }
            },
            error: function (data) {
                yyAlert(data.message);
            }
        })
    })
    /* var countdown = 6;

     function settime(val) {
     if (countdown < 0) {
     $("#btncodeoff").hide();
     $("#btncode").show();
     val.removeAttribute("disabled");
     val.value = "获取验证码";
     } else {
     val.setAttribute("disabled", true);
     val.value = "获取验证码(" + countdown + ")";
     countdown--;
     }
     setTimeout(function () {
     settime(val)
     }, 1000)
     }*/
});

