/**
 *
 */
$(document).ready(function () {
    var openCellphone = false;

    var tmpUsername = localStorage.getItem("username"),
        tmpPwd = localStorage.getItem("password");
    if(tmpUsername && tmpPwd){
        $("#id_username").prop('value', tmpUsername);
        $("#id_password").prop('value', tmpPwd);
    }
    var EMAIL_REGEXP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var PHONE_REGEXP = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
    //获取设备高度（软键盘调出来时高度也会变小，所以在点击事件前获取）
    var deviceH = document.documentElement.clientHeight + "px";

    //Default Action
    $(".tab-content").hide(); //Hide all content
    $("ul.regist-tab li:first").addClass("active").show(); //Activate first tab
    $(".tab-content:first").show(); //Show first tab content
    
    //On Click Event
    $("ul.regist-tab li").click(function() {
        $("ul.regist-tab li").removeClass("active"); //Remove any "active" class
        $(this).addClass("active"); //Add "active" class to selected tab
        $(".tab-content").hide(); //Hide all tab content
        var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
        $(activeTab).fadeIn(); //Fade in the active content
        $(this).css('background',"#000")
        return false;
    });

    function isLocalStorageSupported() {
        var testKey = 'test',
            storage = window.localStorage;
        try {
            storage.setItem(testKey, 'testValue');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
    var checkUsername = function(username){
        if(!username){
            var text = "邮箱";
            if(openCellphone){
                text = "邮箱或手机号";
            }
            yyAlert("请输入" + text);
            return false;
        }
        if(!EMAIL_REGEXP.test(username)){
            yyAlert("邮箱格式不正确");
            return false;
        }
        if(openCellphone && !PHONE_REGEXP.test(username)){
            yyAlert("手机号码格式不正确");
            return false;
        }
        return true;
    };

    $("#btnok").click(function (e) {
        e.preventDefault();

        var username = $.trim($("#id_username").val());
        var password = $.trim($("#id_password").val());

        if(!checkUsername(username)){
            return false;
        }
        if(!password){
            yyAlert("请输入密码");
            return false;
        }
        if(password.length < 5){
            yyAlert("密码长度应不小于5位");
            return false;
        }
        if ($("#btnchk").is(':checked') && isLocalStorageSupported()) {
            if (username != null && password != null) {
                localStorage.username= username;
                localStorage.password=password;
            }
        } else {
            localStorage.clear();
        }
        $("#btnLogin").submit();
    });
    /*注册点击获取验证码*/
    var userExists = false;
    $("#btncode").click(function () {
        var btncodeoff = document.getElementById("btncodeoff");
        var username = $("#id_username").val();
        if(!checkUsername(username)){
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
                userExists = false;
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
                    yyAlert("用户名已经存在,请更换");
                    userExists = true;
                }
                else if (xhr.status == 401) {
                    var text = "邮箱";
                    if(openCellphone){
                        text = "邮箱/手机号";
                    }
                    yyAlert("请使用"+text+"注册");
                }
                else {
                    yyAlert("参数错误");
                }
            }
        })
    });

    $("#btnregist").click(function () {
        var username = $.trim($("#id_username").val());
        var code = $.trim($("#id_message").val());
        var password1 = $.trim($("#id_password1").val());
        var password2 = $.trim($("#id_password2").val());
        if(!checkUsername(username)){
            return false;
        }
        if(userExists){
            yyAlert("用户名已经存在,请更换");
            return;
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
        if(password1!= password2){
            yyAlert("两次密码不一致");
            return false;
        }
        if(password1.length < 5 || password2.length < 5){
            yyAlert("密码长度不能小于5位");
            return false;
        }
        $("#registForm").submit();
    });

    /*忘记密码后获取验证码*/
    $("#btncode-psd").click(function () {
        var btncodeoff = document.getElementById("btncodeoff-psd");
        var username = $("#username").val();
        if(!checkUsername(username)){
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
    });
    /*忘记密码点击确定*/
    $("#btnsure").click(function () {
        var writecode = $("#message").val();
        var username = $.trim($("#username").val());
        if(!checkUsername(username)){
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
    });
    $("#btnFpwd").click(function () {
        var password1 = $("#password1").val();
        var password2 = $("#password2").val();
        if (password1 != password2) {
            yyAlert("两次输入密码不一致");
            return false;
        }
        $("#forgetForm").submit();
    });
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

