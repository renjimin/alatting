/**
 *自动在PC端和移动端切换touchstart和click
 */
;
(function() {
	var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click',
		_on = $.fn.on;
	$.fn.on = function() {
		if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
			if (window.location.href.indexOf("?mobile") < 0) {
				try {
					if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
						arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
						return _on.apply(this, arguments);
					} else if (/iPad/i.test(navigator.userAgent)) {
						arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
						return _on.apply(this, arguments);
					} else {
						arguments[0] = (arguments[0] === 'click')
						return _on.apply(this, arguments);
					}
				} catch (e) {}
			}
		} else {
			arguments[0] = 'click';
			return _on.apply(this, arguments);
		}
	};
})();
$(document).ready(function() {
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
	$("ul.regist-tab li").click(function() {
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
	/**
	 *电脑注册切换页面
	 */
	$(".regist-header a").click(function() {
		$(".regist-header a").removeClass("active");
		$(this).addClass("active");
		if ($(this).attr('data-item') == "server") {
			$("#id_user_type").val('server');
			$('.selectprovider-PC').hide();
			$('.selectserver-PC').show();
			$('.regist-form div:last').show();
		} else {
			$("#id_user_type").val('consumer');
			$('.selectprovider-PC').show();
			$('.selectserver-PC').hide();
			$('.regist-form div:last').hide();
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

	var checkUsername = function(username) {
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

	$("#btnok").click(function(e) {
		e.preventDefault();
		console.log(333)
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
	$("#btncode").click(function() {
		var username = "";
		var btncodeoff = document.getElementById("btncodeoff");
		if (IsPC()) {
			username = $("#rid_username").val();
		} else {
			username = $("#id_username").val();
		}
		console.log(username)
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
			success: function(data) {
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
			error: function(xhr, status, statusText) {
				if (xhr.status == 403) {
					yyAlert("用户名已经存在,请更换");
					userExists = true;
				} else if (xhr.status == 401) {
					var text = "邮箱";
					if (openCellphone) {
						text = "邮箱/手机号";
					}
					yyAlert("请使用" + text + "注册");
				} else {
					yyAlert("参数错误");
				}
			}
		})
	});
	/**
	 *注册失败填写表单
	 */
	if ($("#id_main_category").val()) {
		if ($.trim($("#id_input_category").val())) {
			selectTrade(0, function(data) {
				for (var i = 0; i < data.length; i++) {
					$('.selectserver').text(data[$("#id_main_category").val()].name);
				}
			})
		} else {
			console.log($("#id_main_category").val())
			selectTrade($("#id_main_category").val(), function(data) {
				console.log(data)
				for (var i = 0; i < data.length; i++) {
					if (data[i].id == $("#id_sub_category_ids").val()) {
						$('.selectserver').text(data[i].name);
						$("#id_input_category").attr("disabled", false);
					}
				}
			})
		}
	}
	/**
	 *注册点击事件
	 */
	$("#btnregist").click(function() {
		var username = "";
		var code = $.trim($("#id_message").val());
		var password1 = $.trim($("#id_password1").val());
		var password2 = $.trim($("#id_password2").val());
		var user_type = $.trim($("#id_user_type").val());
		var sub_category_ids = $.trim($("#id_sub_category_ids").val());
		var id_input_category = $.trim($("#id_input_category").val());
		var id_main_category = $.trim($("#id_main_category").val());
		if (IsPC()) {
			username = $.trim($("#rid_username").val());
		} else {
			username = $.trim($("#id_username").val());
		}
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
			if (!id_main_category) {
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
		};
		$("#registForm").submit();
	});

	function selectTrade(opts, callBack) {
		$.ajax({
			type: 'GET',
			url: '/api/v1/poster/categorys?parent=' + opts,
			success: function(data) {
				callBack(data);

			},
			error: function(xhr, status, statusText) {
				if (xhr.status == 403) {
					yyAlert("请登录后再操作。如果您已登录请刷新页面，谢谢！");
				}
			}
		});
	}

	var selectedname = "";
	var main_name = "";
	$(".selectserver").click(function() {
		console.log(444)
		var selected = $('body');
		selectedname = "";
		main_name = "";
		if ($('.div-server').length == 0) {
			selectTrade(0, function(data) {
				var sbox = '<div class="div-server"><div class = "server-title"><i  class="glyphicon glyphicon-remove-circle"></i><i  class="glyphicon glyphicon-ok-circle"></i></div><ul class="ul-server">';
				for (var i = 0; i < data.length; i++) {
					sbox += '<li class = "li-server" data-name = "' + data[i].name + '" data-id="' + data[i].id + '"><a >' + data[i].name + '<i class="glyphicon glyphicon-chevron-down"></i></a></li>';
				}
				sbox += '</ul></div>';
				selected.append(sbox);
			});
		} else {
			$('.div-server').fadeIn(200);
		};
		if ($('.li-server').length == 0) {
			selected.on('click', '.li-server', function(e) {
				//e.preventDefault();
				var ths = $(this);
				var sid = $(this).attr('data-id');
				var ssbox = '';
				main_name = $(this).attr('data-name');
				if($('.li-server').hasClass('open')){
					$('.li-server').removeClass('open');
					$('.li-server').children('dl').hide();
				}
				if (ths.hasClass('open')) {
					ths.removeClass('open');
					ths.children('dl').hide();
				}else{
					ths.addClass('open');
					ths.children('dl').show();
					ths.find('span').addClass('open');
				};
				//ths.addClass('open');
				$("#id_main_category").val(sid);
				if (ths.find("dl").length == 0) {
					selectTrade(sid, function(data) {
						ssbox = '<dl class = "sul-server">'
						for (var i = 0; i < data.length; i++) {
							ssbox += '<dd class = "sli-server" data-name ="' + data[i].name + '" data-id="' + data[i].id + '">' + data[i].name + '</dd>';
							// console.log(data.length);
						};
						ssbox += '</dl>'
							//ssbox += '<li class = "sli-server" ><input type = "text" placeholder = "如果上边没找到,请这里输入二级行业"></li></ul>'
						ths.append(ssbox);
					});
				}
				/*if (ths.hasClass('open')) {
					ths.removeClass('open');
					ths.children('ul').hide();
				}else{
					ths.addClass('open');
					ths.children('ul').show();
				};*/

				ths.on('click', '.sli-server', function(event) {
					//event.stopPropagation();
					selectedname = $(this).attr('data-name');
					$("#id_sub_category_ids").val($(this).attr('data-id'));
					if ($('.regist-industryinput').val().length != 0) {
						$('.regist-industryinput').prop('value', '');
						$('.regist-industryinput').attr('placeholder', '请输入');
					}
				});
			});
			selected.on('click', 'div-server .glyphicon-chevron-down', function(event) {
				//event.preventDefault();
				if ($(this).hasClass('open')) {
					$(this).removeClass('open');
					$(this).parents('a').siblings('dl').hide();
				} else {
					$(this).addClass('open');
					$(this).children('ul').show();
					$(this).find('span').addClass('open');
					$(this).parents('a').siblings('dl').show();
				};
			})
			selected.on('click', '.div-server .glyphicon-ok-circle', function(event) {
				//event.preventDefault();
				if (main_name.length > 0) {
					if (selectedname.length > 0) {
						$('.selectserver').text(selectedname);
						$('.regist-industryinput').attr('disabled', true);
					} else {
						$('.selectserver').text(main_name);
						$('.regist-industryinput').attr('disabled', false);
					}
					$('.div-server').fadeOut(200);
				} else {
					$('.div-server').fadeOut(200);
				}

			});
			selected.on('click', '.div-server .glyphicon-remove-circle', function(event) {
				//event.preventDefault();
				$('.selectserver').text("请选择行业");
				$("#id_main_category").val("");
				$("#id_sub_category_ids").val("");
				$("#id_input_category").attr("disabled", false);
				$('.div-server').fadeOut(200);
			})
		}
	});
	var messbox = "";
	$('.selectprovider').click(function() {
		messbox = "";
		console.log(messbox)
		var selected = $('body');
		if ($('.div-provider').length == 0) {
			selectTrade(0, function(data) {
				var sbox = '<div class="div-provider"><div class = "server-title"><i  class="glyphicon glyphicon-remove-circle"></i><i  class="glyphicon glyphicon-ok-circle"></i></div><ul class="ul-provider">';
				for (var i = 0; i < data.length; i++) {
					sbox += '<li class = "li-provider" data-name = "' + data[i].name + '" data-id="' + data[i].id + '">' + data[i].name + '<span class="glyphicon glyphicon-unchecked"></span></li>';
				}
				sbox += '</ul></div>';
				selected.append(sbox);
			});
		} else {
			$('.div-provider').fadeIn(200);
		}

		var messid = "";
		var meid = "";
		if ($('.li-provider').length == 0) {
			selected.off('click', '.li-provider').on('click', '.li-provider', function(e) {
				//e.preventDefault();
				var ths = $(this)
				var sid = $(this).attr('data-id');
				$("#id_main_category").val(sid);
				var ssbox = ' <dl>';
				if (ths.find('dl').length == 0) {
					selectTrade(sid, function(data) {
						for (var i = 0; i < data.length; i++) {
							ssbox += '<dd class = "sli-provider" data-name ="' + data[i].name + '" data-id="' + data[i].id + '">' + data[i].name + '<i class="glyphicon glyphicon-unchecked"></i></dd>';
						};
						ssbox += '</dl>';
						ths.append(ssbox);
					});
				} else {

				}
				if($('.li-provider').hasClass('open')){
					$('.li-provider').removeClass('open');
					$('.li-provider').children('dl').hide();
				}
				if (ths.hasClass('open')) {
					ths.removeClass('open');
					ths.children('dl').hide();
				}else{
					ths.addClass('open');
					ths.children('dl').show();
					ths.find('span').addClass('open');
				};
				ths.children('.glyphicon').off('click').on('click', function(event) {
					//event.preventDefault();
					if ($(event.target).hasClass('glyphicon-unchecked')) {
						$(event.target).removeClass('glyphicon-unchecked').addClass('glyphicon-check');
						$(event.target).next().find('.glyphicon').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
					} else {
						$(event.target).removeClass('glyphicon-check').addClass('glyphicon-unchecked');
						$(event.target).next().find('.glyphicon').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
					};
				})
				selected.off('click', '.sli-provider').on('click', '.sli-provider', function(event) {
					var ths = $(this);
					//event.preventDefault();
					if ($(event.target).hasClass("glyphicon")) {
						if ($(event.target).hasClass('glyphicon-unchecked')) {
							$(event.target).removeClass('glyphicon-unchecked').addClass('glyphicon-check');
						} else {
							$(event.target).removeClass('glyphicon-check').addClass('glyphicon-unchecked');
						};
					}
				});
			});
			selected.off("click", '.div-provider .glyphicon-ok-circle').on('click', '.div-provider .glyphicon-ok-circle', function(event) {
				// console.log($('.div-provider .glyphicon-check').parents('li'));
				//event.preventDefault();
				var i = $('.sli-provider .glyphicon-check');
				var meid = "";
				for (var n = 0; n < i.length; n++) {
					$(i[n]).parent('dd').attr('data-id');
					meid += $(i[n]).parent('dd').attr('data-id') + ",";
					messbox += $(i[n]).parent('dd').attr('data-name') + ",";
				}
				meid = meid.substring(0, meid.length - 1);
				messbox = messbox.substring(0, messbox.length - 1);
				if (messbox.length > 0) {
					$('.selectprovider').text(messbox);
				} else {
					$('.selectprovider').text("我要找的服务(可多选)");
				}
				$("#id_sub_category_ids").val(meid);
				$('.div-provider').fadeOut(200);
			});
			selected.off("click", '.div-provider .glyphicon-remove-circle').on('click', '.div-provider .glyphicon-remove-circle', function(event) {
				//event.preventDefault();
				$('.selectprovider').text("我要找的服务(可多选)");
				$("#id_main_category").val("");
				$("#id_sub_category_ids").val("");
				$('.div-provider').fadeOut(200);
			})
		}
	});

	/*忘记密码后获取验证码*/
	$("#btncode-psd").click(function() {
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
			success: function(data) {
				$("#btncodeoff-psd").show();
				$("#btncode-psd").hide();
				settimepsd(btncodeoff);
				if (PHONE_REGEXP.test(username)) {
					yyAlert(data.message);
				}
			},
			error: function(xhr, status, statusText) {
				if (xhr.status == 403) {
					yyAlert("用户未注册");
				} else if (xhr.status == 401) {
					yyAlert("帐号格式错误");
				} else {
					yyAlert("参数错误");
				}
			}
		})
	});
	/*忘记密码点击确定*/
	$("#btnsure").click(function() {
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
			success: function(data) {
				$(".forget-reset").show();
				$(".forget-pwd").hide();
			},
			error: function(xhr, status, statusText) {
				if (xhr.status == 401) {
					yyAlert("验证码不正确或已过期");
				}
				if (xhr.status == 404) {
					yyAlert("该用户未注册");
				}
			}
		})
		console.log(2323)
	});
	$("#btnFpwd").click(function() {
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
			setTimeout(function() {
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
			setTimeout(function() {
				settime(val)
			}, 1000)
		}

	}
	/**
	 *
	 */
	var selectedname = "";
	var main_name = "";
	$(".selectserver-PC").click(function() {
		var selected = $('body');
		$('#pc-server').show();
		if ($('#pcul-server').children().length == 0) {
			$.ajax({
				type: 'GET',
				url: '/api/v1/poster/categorys?parent=0',
				success: function(data) {
					var sbox = '<ul>';
					for (var i = 0; i < data.length; i++) {
						sbox += '<li class = "pcli-server" data-name = "' + data[i].name + '" data-id="' + data[i].id + '"><a >' + data[i].name + '<i class="fa fa-angle-right"></i></a></li>';
					}
					sbox += '</ul>';
					$('#pcul-server').append(sbox);
				},
				error: function(xhr, status, statusText) {
					if (xhr.status == 403) {
						yyAlert("请登录后再操作。如果您已登录请刷新页面，谢谢！");
					}
				}
			});
		}
	});

	$('#pcul-server').on('click', '.pcli-server', function(e) {
		var ths = $(this);
		var sid = $(this).attr('data-id');
		var ssbox = '';
		main_name = $(this).attr('data-name');
		console.log(sid)
		$("#id_main_category").val(sid);
		$('.pcli-server').removeClass('active');
		ths.addClass('active');
		if ($('#pcsul-' + sid).length == 0) {
			$.ajax({
				type: 'GET',
				url: '/api/v1/poster/categorys?parent=' + sid,
				success: function(data) {
					ssbox = '<dl class = "pcsul-server" id = "pcsul-' + sid + '">'
					for (var i = 0; i < data.length; i++) {
						ssbox += '<dd class = "pcsli-server" data-name ="' + data[i].name + '" data-id="' + data[i].id + '">' + data[i].name + '</dd>';
					};
					ssbox += '</dl>';
					$('.pcsul-server').hide();
					$('#pcright-server').append(ssbox);
				},
				error: function(xhr, status, statusText) {
					if (xhr.status == 403) {
						yyAlert("请登录后再操作。如果您已登录请刷新页面，谢谢！");
					}
				}
			});
		} else {
			$('.pcsul-server').hide();
			$('#pcsul-' + sid).show();
		}
	});
	$('#pcright-server').on('click', '.pcsli-server', function(event) {
		selectedname = $(this).attr('data-name');
		$('.pcsli-server').removeClass('active');
		$(this).addClass('active');
		$("#id_sub_category_ids").val($(this).attr('data-id'));
		if ($('.writer-category').val().length != 0) {
			$('.writer-category').prop('value', '');
			$('.writer-category').attr('placeholder', '请输入');
		}
	});

	$("#pc-server").on('click', '.fa-check-circle', function(event) {
		if (main_name.length > 0) {
			if (selectedname.length > 0) {
				$('.selectserver-PC').text(selectedname);
				$('.writer-category').attr('disabled', true);
			} else {
				$('.selectserver').text(main_name);
				$('.writer-category').attr('disabled', false);
			}
			$('.pc-server').fadeOut(200);
		} else {
			$('.pc-server').fadeOut(200);
		}
	});
	$("#pc-server").on('click', '.fa-times-circle', function(event) {
		$('.selectserver').text("请选择行业");
		$("#id_main_category").val("");
		$("#id_sub_category_ids").val("");
		$("#id_input_category").attr("disabled", false);
		$('.pc-server').fadeOut(200);
	});


	/**
	 *
	 */
	$(".selectprovider-PC").click(function() {
		var selected = $('body');
		selectedname = "";
		main_name = "";
		$('#pc-provider').show();
		if ($('#pcul-provider').children().length == 0) {
			$.ajax({
				type: 'GET',
				url: '/api/v1/poster/categorys?parent=0',
				success: function(data) {
					var sbox = '<ul>';
					for (var i = 0; i < data.length; i++) {
						sbox += '<li class = "pcli-provider" data-name = "' + data[i].name + '" data-id="' + data[i].id + '"><a >' + data[i].name + '<i class="fa fa-angle-right"></i></a></li>';
					}
					sbox += '</ul>';
					$('#pcul-provider').append(sbox);
				},
				error: function(xhr, status, statusText) {
					if (xhr.status == 403) {
						yyAlert("请登录后再操作。如果您已登录请刷新页面，谢谢！");
					}
				}
			});
		}
	});

	var providermainbox = "";
	var providernumber = "";
	var providermeid = "";
	$('#pcul-provider').on('click', '.pcli-provider', function(e) {
		var ths = $(this);
		var sid = $(this).attr('data-id');
		var ssbox = '';
		main_name = $(this).attr('data-name');
		$("#id_main_category").val(sid);
		$('.pcli-provider').removeClass('active');
		ths.addClass('active');
		if ($('#ppcsul-' + sid).length == 0) {
			$.ajax({
				type: 'GET',
				url: '/api/v1/poster/categorys?parent=' + sid,
				success: function(data) {
					ssbox = '<dl class = "pcsul-provider" id = "ppcsul-' + sid + '" data-id="' + sid + '">'
					for (var i = 0; i < data.length; i++) {
						ssbox += '<dd class = "pcsli-provider" data-name ="' + data[i].name + '" data-id="' + data[i].id + '">' + data[i].name + '<i class = "fa fa-square-o check"></i></dd>';
					};
					ssbox += '<dd class = "pcsli-provider">全选<i class = "fa fa-square-o checkall"></i></dd></dl>';
					$('.pcsul-provider').hide();
					$('#pcright-provider').append(ssbox);
				},
				error: function(xhr, status, statusText) {
					if (xhr.status == 403) {
						yyAlert("请登录后再操作。如果您已登录请刷新页面，谢谢！");
					}
				}
			});
		} else {
			$('.pcsul-provider').hide();
			$('#ppcsul-' + sid).show();
		}
	});
	$('#pcright-provider').on('click', '.pcsli-provider', function(event) {
		selectedname = $(this).attr('data-name');
		$('.pcsli-provider').removeClass('active');
		$(this).addClass('active');
	});
	$('#pcright-provider').on("click", ".pcsul-provider .check", function() {
		if ($(this).hasClass("fa-check-square-o")) {
			$(this).removeClass('fa-check-square-o').addClass('fa-square-o');
		} else {
			$(this).addClass('fa-check-square-o').removeClass('fa-square-o');
		}
	})
	$('#pcright-provider').on("click", ".pcsul-provider .checkall", function() {
		if ($(this).hasClass("fa-check-square-o")) {
			$(".pcsul-provider i").removeClass('fa-check-square-o').addClass('fa-square-o');
		} else {
			$(".pcsul-provider i").addClass('fa-check-square-o').removeClass('fa-square-o');
		}
	})
	$("#pc-provider").on('click', '.fa-check-circle', function(event) {
		var i = $('.pcsli-provider .fa-check-square-o').not('.checkall');
		for (var n = 0; n < i.length; n++) {
			$(i[n]).parent('dd').not('.checkall').attr('data-id');
			providermainbox += $(i[n]).parent('dd').parent('dl').attr('data-id') + ",";
			providermeid += $(i[n]).parent('dd').attr('data-name') + ",";
			providernumber += $(i[n]).parent('dd').attr('data-id') + ",";
		}
		providermainbox = providermainbox.substring(0, providermainbox.length - 1);
		providermeid = providermeid.substring(0, providermeid.length - 1);
		providernumber = providernumber.substring(0, providernumber.length - 1);
		$("#id_main_category").val(providermainbox);
		$("#id_sub_category_ids").val(providernumber);
		if (providermeid.length > 0) {
			$('.selectprovider-PC').text(providermeid);
		}
		$('.pc-provider').fadeOut(200);
	});
	$("#pc-provider").on('click', '.fa-times-circle', function(event) {
		//event.preventDefault();
		$('.selectprovider').text("我要找的服务(可多选)");
		$("#id_main_category").val("");
		$("#id_sub_category_ids").val("");
		$('.pc-provider').fadeOut(200);
	});

	function IsPC() {
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone",
			"SymbianOS", "Windows Phone",
			"iPad", "iPod"
		];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	}
	/*$('.eys-psd1').mousedown(function(event) {
		console.log(1)
		event.stopPropagation();
		$(this).removeClass('fa-eye-slash ').addClass('fa-eye');
		$("#id_password1").attr("type", "text");
	});
	$('.eys-psd1').mouseup(function() {
		console.log(2)
		$(this).removeClass('fa-eye ').addClass('fa-eye-slash');
		$("#id_password1").attr("type", "password");
	});
	$('.eys-psd2').mousedown(function() {
		console.log(3)
		$(this).removeClass('fa-eye-slash ').addClass('fa-eye');
		$("#id_password2").attr("type", "text");
	});
	$('.eys-psd2').mouseup(function() {
		console.log(4)
		$(this).removeClass('fa-eye ').addClass('fa-eye-slash');
		$("#id_password2").attr("type", "password");
	});*/
});