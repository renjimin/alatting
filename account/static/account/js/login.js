/**
 *
 */
$(document).ready(function () {
    var openCellphone = false;

    var tmpUsername = localStorage.getItem("username"),
        tmpPwd = localStorage.getItem("password");
    if (tmpUsername && tmpPwd) {
        $("#id_username").prop('value', tmpUsername);
        $("#id_password").prop('value', tmpPwd);
    }
    var EMAIL_REGEXP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var PHONE_REGEXP = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
    //获取设备高度（软键盘调出来时高度也会变小，所以在点击事件前获取）
    var deviceH = document.documentElement.clientHeight + "px";
    $("ul.regist-tab li:last").css('background', "black");
    $("#id_user_type").val('server');
    $("ul.regist-tab li").click(function () {
        $("ul.regist-tab li").removeClass("regist-tab-act");
        $("ul.regist-tab li").css('background', "black");
        $(this).addClass("regist-tab-act");
        $(this).css('background', "");
        if ($(this).attr('data-item') == "server") {
            $("#id_user_type").val('server');
            $('.selectprovider').hide();
            $('.selectserver').show();
            $('.list li:last').show();
        } else {
            $("#id_user_type").val('consumer');
            $('.selectprovider').show();
            $('.selectserver').hide();
            $('.list li:last').hide();
        }
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

    var checkUsername = function (username) {
        if (!username) {
            var text = "邮箱";
            if (openCellphone) {
                text = "邮箱或手机号";
            }
            yyAlert("请输入" + text);
            return false;
        }
        if (!EMAIL_REGEXP.test(username)) {
            yyAlert("邮箱格式不正确");
            return false;
        }
        if (openCellphone && !PHONE_REGEXP.test(username)) {
            yyAlert("手机号码格式不正确");
            return false;
        }
        return true;
    };

    $("#btnok").click(function (e) {
        e.preventDefault();

        var username = $.trim($("#id_username").val());
        var password = $.trim($("#id_password").val());

        if (!checkUsername(username)) {
            return false;
        }
        if (!password) {
            yyAlert("请输入密码");
            return false;
        }
        if (password.length < 5) {
            yyAlert("密码长度应不小于5位");
            return false;
        }
        if ($("#btnchk").is(':checked') && isLocalStorageSupported()) {
            if (username != null && password != null) {
                localStorage.username = username;
                localStorage.password = password;
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
        if (!checkUsername(username)) {
            return false;
        }
        $.ajax({
            type: 'POST',
            url: '/api/v1/account/send_message',
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
                    if (openCellphone) {
                        text = "邮箱/手机号";
                    }
                    yyAlert("请使用" + text + "注册");
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
        var user_type = $.trim($("#id_user_type").val());
        var sub_category_ids = $.trim($("#id_sub_category_ids").val());
        var id_input_category = $.trim($("#id_input_category").val());
        var id_main_category = $.trim($("#id_main_category").val());
        if (!checkUsername(username)) {
            return false;
        }
        if (userExists) {
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
        if (password1 != password2) {
            yyAlert("两次密码不一致");
            return false;
        }
        if (password1.length < 5 || password2.length < 5) {
            yyAlert("密码长度不能小于5位");
            return false;
        }
        if (user_type == "server") {
            if(!id_main_category){
                yyAlert("请选择一级行业类");
                return false;
            }
            if (!sub_category_ids && !id_input_category) {
                yyAlert("请选择行业或输入要选择的行业");
                return false;
            };
        } else {
            if (!sub_category_ids) {
                yyAlert("请选择要服务的行业");
                return false;
            };
        } ;
        $("#registForm").submit();
    });
    function selectTrade(opts, callBack) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/poster/categorys?parent=' + opts,
            success: function (data) {
                callBack(data);

            },
            error: function (xhr, status, statusText) {
                if (xhr.status == 403) {
                    yyAlert("请登录后再操作。如果您已登录请刷新页面，谢谢！");
                }
            }
        });
    }

    $(".selectserver").click(function () {
        var selected = $('body');
        var selectedname = "";
        var main_name = "";
        if ($('.div-server').length ==0) {
            selectTrade(0, function (data) {
                var sbox = '<div class="div-server"><div><i  class="glyphicon glyphicon-ok-circle"></i></div><ul class="ul-server">';
                for (var i = 0; i < data.length; i++) {
                    sbox += '<li class = "li-server" data-name = "' + data[i].name + '" data-id="' + data[i].id + '"><a >' + data[i].name + '<span class="glyphicon glyphicon-chevron-down"></span></a></li>';
                }
                sbox += '</ul></div>';
                selected.append(sbox);
            });
        }else{
            $('.div-server').fadeIn(200);
        };
        selected.on('click', '.li-server', function () {
            var ths = $(this);
            var sid = $(this).attr('data-id');
            var ssbox = '';
            main_name = $(this).attr('data-name');
            if($('.li-server').hasClass('open')){
                $('.li-server').removeClass('open');
                $('.li-server').children('ul').hide();
            }
            if (ths.hasClass('open')) {
                ths.removeClass('open');
                ths.children('ul').hide();
            }else{
                ths.addClass('open');
                ths.children('ul').show();
            };
            //ths.addClass('open');
            $("#id_main_category").val(sid);
             if (ths.find("li").length == 0) {
                selectTrade(sid, function (data) {
                    ssbox = '<ul class = "sul-server">'
                    for (var i = 0; i < data.length; i++) {
                        ssbox += '<li class = "sli-server" data-name ="' + data[i].name + '" data-id="' + data[i].id + '">' + data[i].name + '</li>';
                        // console.log(data.length);
                    } ;
                    ssbox += '</ul>'
                        ths.append(ssbox);
                });
             }else{

             }
            /*if (ths.hasClass('open')) {
                ths.removeClass('open');
                ths.children('ul').hide();
            }else{
                ths.addClass('open');
                ths.children('ul').show();
            };*/
            $('.li-server').on('click', '.sli-server', function (event) {
                event.stopPropagation();
                selectedname = $(this).attr('data-name');
                $('.selectserver').text(selectedname);
                $("#id_sub_category_ids").val($(this).attr('data-id'));
                //$('.div-server').fadeOut(200);
            });
        });
        selected.on('click', '.glyphicon-ok-circle', function () {
            if(selectedname.length>0){
                $('.selectserver').text(selectedname);
                $('.regist-industryinput').attr('disabled',true);
            }else{
            	$('.selectserver').text(main_name);
            }
            $('.div-server').fadeOut(200);
        })
    });

    $('.selectprovider').click(function () {
        var selected = $('body');
            if ($('.div-provider').length ==0) {
                 selectTrade(0, function (data) {
                    var sbox = '<div class="div-provider"><div><i  class="glyphicon glyphicon-ok-circle"></i></div><ul class="ul-provider">';
                    for (var i = 0; i < data.length; i++) {
                        sbox += '<li class = "li-provider" data-id="' + data[i].id + '">' + data[i].name + '<span class="glyphicon glyphicon-unchecked"></span></li>';
                    }
                    sbox += '</ul></div>';
                    selected.append(sbox);
                });
            }else{
                $('.div-provider').fadeIn(200);
            }

        var messbox = "";
        var messid = "";
        var meid = "";
        selected.off('click','.li-provider').on('click', '.li-provider',function () {
            var ths = $(this)
            var sid = $(this).attr('data-id');
            $("#id_main_category").val(sid);
            var ssbox = ' <ul>';
            if (ths.find('li').length == 0) {
                selectTrade(sid, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        ssbox += '<li class = "sli-provider" data-name ="' + data[i].name + '" data-id="' + data[i].id + '">' + data[i].name + '<span class="glyphicon glyphicon-unchecked"></span></li>';
                    };
                    ssbox += '</ul>';
                    ths.append(ssbox);
                });
            }else{

            }
            ths.children('.glyphicon').off('click').on('click',function(event){
                if ($(event.target).hasClass('glyphicon-unchecked')) {
                    $(event.target).removeClass('glyphicon-unchecked').addClass('glyphicon-check');
                    $(event.target).next().find('.glyphicon').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
                }else{
                    $(event.target).removeClass('glyphicon-check').addClass('glyphicon-unchecked');
                    $(event.target).next().find('.glyphicon').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
                };
            })
            selected.off('click','.sli-provider').on('click', '.sli-provider',function (event) {
                var selectedname = $(this).attr('data-name');
                var ths = $(this);
                event.stopPropagation();
                if ($(event.target).hasClass("glyphicon")) {
                    if ($(event.target).hasClass('glyphicon-unchecked')) {
                        $(event.target).removeClass('glyphicon-unchecked').addClass('glyphicon-check');
                    }else{
                        $(event.target).removeClass('glyphicon-check').addClass('glyphicon-unchecked');
                    };
                }
            });
        });
        selected.off("click", '.glyphicon-ok-circle').on('click', '.glyphicon-ok-circle', function () {
           // console.log($('.div-provider .glyphicon-check').parents('li'));
            var i = $('.div-provider .glyphicon-check');
            var meid = "";
            for(var n=0;n<i.length;n++){
                $(i[n]).parent('li').attr('data-id');
                meid += $(i[n]).parent('li').attr('data-id')+",";
                messbox += $(i[n]).parent('li').attr('data-name')+","
            }
            meid = meid.substring(0,meid.length-1);
            messbox = messbox.substring(0,messbox.length-1);
            if(messbox.length>0){
                $('.selectprovider').text(messbox);
            }
            $("#id_sub_category_ids").val(meid);
            $('.div-provider').fadeOut(200);
        });
    });

    /*忘记密码后获取验证码*/
    $("#btncode-psd").click(function () {
        var btncodeoff = document.getElementById("btncodeoff-psd");
        var username = $("#username").val();
        if (!checkUsername(username)) {
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
        if (!checkUsername(username)) {
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

