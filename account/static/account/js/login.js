/**
 *
 */
$(document).ready(function () {

    /*登陆界面注册页面跳转*/
    $("#register").click(function () {
        window.location.href = "register";
    })
    /*点击获取验证码*/
    $("#btncode").click(function () {
        $("#btncodeoff").show();
        $("#btncode").hide();
        var btncodeoff = document.getElementById("btncodeoff");
        settime(btncodeoff);
        var username = $("#username").val();
        if (!username) {
            return false;
        }

        $.ajax({
            type: 'POST',
            url: '/account/send_message',
            data: {"username": username},
            success: function (data) {
                alert(data.message);
            },
            error: function (data) {
                alert(data.message);
            }
        })
    })
    var countdown = 6;

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
    }
});

