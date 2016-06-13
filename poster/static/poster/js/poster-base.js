$(function () {

	//数据初始化
	var storageAPI = $.fn.yunyeStorage;
	var pageHeadData = storageAPI.getPosterHeadData();
	var regtelephone = /^0\d{2,3}-?\d{7,8}$/;
	var regemail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	var regphone = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;    

	var initData = function () {
		var g = yunyeEditorGlobal;
		//标题
		//if(g.unique_name)$("#logo_title").html(g.unique_name);
		if(storageAPI.getCss("logo_title"))$("#logo_title").css(storageAPI.getCss("logo_title"));
		//简述
		if(g.short_description)$("#short_description").html(g.short_description);
		if(storageAPI.getCss("#short_description"))$("#short_description").css(storageAPI.getCss("#short_description"));
		if(g.short_description.length>40){
			$("#short_description").css("fontSize","12px");
		}else if(g.short_description.length > 32 ){
			$("#short_description").css("fontSize","14px");
		}else{
			$("#short_description").css("fontSize","16px");
		}
		//logo
		if(pageHeadData.logo_title)$('.header-logo h2').html(pageHeadData.logo_title);
		if(storageAPI.getHead("logo_img"))$('.header-logo img').attr("src",storageAPI.getHead("logo_img"));
		if(storageAPI.getCss(".header-logo h2"))$('.header-logo h2').css(storageAPI.getCss(".header-logo h2"));
		if(storageAPI.getCss(".header-logo img"))$('.header-logo img').css(storageAPI.getCss(".header-logo img"));
		//电话手机邮箱
		var $phone = $('#dpw_phone');
		if(g.phone)$phone.find('input:eq(0)').val(g.phone);
		if(g.mobile)$phone.find('input:eq(1)').val(g.mobile);
		if(g.email)$('#dpw_email').find('input').val(g.email);
		//日历
		var inputs = $(".weekly input");
		for (var i = 0; i < (inputs.length) / 2; i++) {
			var weekName = (i == 6) ? "Sunday" : (i === 0) ? "Monday" : (i == 1) ? "Tuesday" : (i == 2) ? "Wednesday" : (i == 3) ? "Thursday" : (i == 4) ? "Friday" : "Saturday",
				info = yunyeEditorGlobal.lifetime.lifetime_weekly[weekName];
			inputs.eq(i * 2).val(info.start);
			inputs.eq(i * 2 + 1).val(info.end);
			if (info.enabled) {
				$(".weekly td:eq(" + (i * 6 + 4) + ")").removeClass("off");
			} else {
				$(".weekly td:eq(" + (i * 6 + 4) + ")").addClass("off");
			}
		}

		/**读取缓存背景图片*/
		if (storageAPI.getCss(".header-bar")) {
			$('.header-bar').css(storageAPI.getCss(".header-bar"));
		}
		if (storageAPI.getCss(".yunye-template")) {
			$('.yunye-template').css(storageAPI.getCss(".yunye-template"));
		}
		if (storageAPI.getCss(".bar-header")) {
			$(".bar-header").css(storageAPI.getCss(".bar-header"));
		}
		if (storageAPI.getCss(".bar-footer")) {
			$(".bar-footer").css(storageAPI.getCss(".bar-footer"));
		}
		if (storageAPI.getCss("body")) {
			$("body").css(storageAPI.getCss("body"));
		}
		if (storageAPI.getCss(".qrcode-inner .qrcode")) {
			$(".qrcode-inner .qrcode").css(storageAPI.getCss(".qrcode-inner .qrcode"));
		}
		if (storageAPI.getCss(".abutton-group a")) {
			$(".abutton-group a").css(storageAPI.getCss(".abutton-group a"));
		}
		if(storageAPI.getCss(".header-info")){
			$(".header-info").css(storageAPI.getCss(".header-info"));
		}

		/*读取主体部分*/
		if (storageAPI.getHtml()) {
			$(".yunye-template").remove();
			$(".container-fluid").append('<div class="template-box">'+storageAPI.getHtml()+'</div>');
		}
	};

	//if (!(yunyeEditorGlobal.updated_at > pageHeadData.updated_at)) {
		//yunyeEditorGlobal = $.extend(yunyeEditorGlobal, pageHeadData);

	//服务器暂时没传数据 (默认时间)
	if (!yunyeEditorGlobal.lifetime)yunyeEditorGlobal.lifetime = {
		lifetime_weekly : {
			"Monday": {start: "09:00", end: "17:00", enabled: 1},
			"Tuesday": {start: "09:00", end: "17:00", enabled: 1},
			"Wednesday": {start: "09:00", end: "17:00", enabled: 1},
			"Thursday": {start: "09:00", end: "17:00", enabled: 1},
			"Friday": {start: "09:00", end: "17:00", enabled: 1},
			"Saturday": {start: "09:00", end: "17:00", enabled: 0},
			"Sunday": {start: "09:00", end: "17:00", enabled: 0}
		},
		lifetime_special : {}
	};
	if (!(yunyeEditorGlobal.updated_at > pageHeadData.updated_at)) {
		initData();
	}
	templateScaleFun();
	
	window.onresize = function(){
		 templateScaleFun();
	};
	
	function templateScaleFun(){
		var templateScale = $('body').width()/$('.yunye-template').width();
		 var templateScaleOpt ='-webkit-transform:scale('+templateScale+','+templateScale+');'
			 +   '-moz-transform:scale('+templateScale+','+templateScale+');'
			 +   '-o-transform:scale('+templateScale+','+templateScale+');'
			 +  '-ms-transform:scale('+templateScale+','+templateScale+');'
			 +      'transform:scale('+templateScale+','+templateScale+');';
			 if($('.template-box').length <= 0){
				var templateBox = $('<div class="template-box"></div>');
				$('.yunye-template').parent().append(templateBox);
				templateBox.append($('.yunye-template'));
			 }
		
		$('.yunye-template').attr('style',templateScaleOpt);
		$('.template-box').height($('.yunye-template').height()*templateScale).css({'min-height':$(window).height() - 84 - $('.header').height()+'px'});
	}
	//失去焦点预判输入
	$('#emailInput').blur(function(){
		var email = $('#emailInput').val();
		if(!regemail.test(email)){
			alert("邮箱输入格式不正确");
			return false;
		}
	});
	$('#mobileInput').blur(function(){
		var phone = $('#mobileInput').val();
		if(!regphone.test(phone)){
			alert("手机号码输入格式不正确");
			return false;
		}
	});
	$('#phoneInput').blur(function(){
		var telephone = $('#phoneInput').val();
		if(!regtelephone.test(telephone)){
			alert("电话号码输入格式不正确");
			return false;
		}
	});


	//弹出菜单
	$(".dropdown-toggle").registerDropDown();
	$(".abutton-contact .ico-phone").registerDropDown({
		id: 'dpw_phone',
		offsetYPercent: 50,
		offsetY: 30
	});
	$(".abutton-contact .ico-email").registerDropDown({
		id: 'dpw_email',
		offsetYPercent: 50,
		offsetY: 30
	});
	$(".abutton-contact .ico-address").registerDropDown({
		id: 'dpw_address',
		offsetYPercent: 50,
		offsetY: 30
	});
	$(".abutton-contact .ico-clock").registerDropDown({
		id: 'dpw_clock',
		offsetYPercent: 50,
		offsetY: 30,
		dynamicClass: 'clock'
	});
	$('.bar-header .title').click(function(){
		$('#text-model').animate({'bottom':'0px'},200);
		$('.text-element').removeClass('text-element-act');
		$('.ele-rotate-ctrl').remove();
		$(".bar-header .title p").tEditor({
			textDelete: false,
			textCopy: false,
			pluginType: 'other'
		});
		$('#ted-edit').trigger('click');
	});

	//限制简述长度
	var limitShortDesciptin = function(e){
		var str = e.currentTarget.value;
		var len,cStr = 0,eStr = 0,i ;
		for (i = 0; i < str.length ; i++) {    
			if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {    
				cStr++;
			 } else {    
				eStr++;
			}
			len = cStr*1.75 +eStr;
			if( len > 49){
				$("#tt-content").val(str.substr(0,i));
				break;
			}
		}
		if(len > 40 ){
			$("#short_description").css("fontSize","12px");
		}else if(len > 32 ){
			$("#short_description").css("fontSize","14px");
		}else{
			$("#short_description").css("fontSize","16px");
		}
		oldShort = $("#tt-content").val();
	};
	$('.desc').registerPopUp({
		id: 'dpw_desc',
		offsetYPercent: 100,
		list: [{
				icon: "glyphicon glyphicon-font",
				text: "输入文字",
				callback: function () {
					$('#text-model').animate({'bottom':'0px'},200);
					$('.text-element').removeClass('text-element-act');
					$('.ele-rotate-ctrl').remove();
					$("#short_description").tEditor({
						textDelete: false,
						textCopy: false,
						pluginType: 'other'
					});
					$("#tt-content").off("input propertychange",limitShortDesciptin).on("input propertychange",limitShortDesciptin);
					$('#ted-edit').trigger('click');
				}
			},
			{
				icon: "glyphicon glyphicon-adjust",
				text: " 简介颜色",
				callback: function () {
					$("#colorBox").css('top', $('.content').offset().top).show();
					$(this).colorSelect({clbox: 'colorBox'}, function (ths, color) {
						$('.header-info').css('background', color);
						storageAPI.setCss(".header-info", {'background': color});
					});
				}
			},
			{
				icon: "glyphicon glyphicon-picture",
				text: " 上传图片",
				callback: function () {
					//$.fn.logoPrettify.init($('.header-info').css('background', 'url'));
					$.fn.uploads.showDialog(function (data) {
						$('.header-info').css('background', 'url(' + data.file + ')');
						$('.header-info').css('background-size', '100% 100%');
						storageAPI.setCss(".header-info", {
							'background': 'url(' + data.file + ')',
							'background-size': '100% 100%'
						});
					})
				}
			}],
		followMouse: true
	});
	$('.header-logo').registerPopUp({
		id: 'dpw_menu',
		offsetYPercent: 100,
		list: [{
				icon: "glyphicon glyphicon-font",
				text: "输入文字",
				callback: function () {
					$('.header-logo h2').css("display","inline-block");
					$('.header-logo img').hide();
					$('#text-model').animate({'bottom':'0px'},200);
					$('.text-element').removeClass('text-element-act');
					$('.ele-rotate-ctrl').remove();
					$(".header-logo h2").tEditor({
						textDelete: false,
						textCopy: false,
						pluginType: 'other'
					});
					$('#ted-edit').trigger('click');
				}
			},
			{
				icon: "glyphicon glyphicon-picture",
				text: " 上传图片",
				callback: function () {
					$.fn.logoPrettify.init($('.header-logo img').attr("src"));
				}
			},
			{icon: "glyphicon glyphicon-camera", text: "照相"},
			{icon: "glyphicon glyphicon-link", text: "图片链接",callback:function(obj){
				obj.resourceLink();
			}}],
		followMouse: true
	});
	$('.mask').registerPopUp({
		id: 'dpw_header',
		offsetXPercent: 80,
		offsetYPercent: 90,
		offsetY: 30,
		followMouse: true,
		list: [
			{
				icon: "glyphicon glyphicon-adjust",
				text: " 颜色",
				callback: function () {
					$("#colorBox").css('top', $('.mask').height() + $('.mask').offset().top).show();
					$('.header').colorSelect({clbox: 'colorBox'}, function (ths, color) {
						ths.css('background', color);
						storageAPI.setCss(".header", {'background': color});
					});
				}
			},
			{
				icon: "icon ico-system-pic",
				text: "背景图片",
				callback: function () {
					$('.header-bar').bgselect({}, function (ths, img) {
						ths.css('background', 'url(' + img + ')');
						ths.css('background-size', '100% 100%');
						storageAPI.setCss(".header-bar", {
							'background': 'url(' + img + ')',
							'background-size': '100% 100%'
						});
						$(".system-item").fadeOut(500);
					});
				}
			},
			{
				icon: "glyphicon glyphicon-picture",
				text: "上传图片",
				callback: function () {
					$.fn.uploads.showDialog(function (data) {
						if(!/\.(gif|jpg|jpeg|bmp|png)$/.test(data.file)){
							yyAlert("上传图片格式错误");
							return false;
						}
						$('.header-bar').css('background', 'url(' + data.file + ')');
						$('.header-bar').css('background-size', '100% 100%');
						storageAPI.setCss(".header-bar", {
							'background': 'url(' + data.file + ')',
							'background-size': '100% 100%'
						});

						$.fn.yyTools.mask();
					});
				}
			}
		]
	});
	$('.btn-bg').registerPopUp({
		id: 'dpw_bg',
		offsetXPercent: 50,
		offsetYPercent: 50,
		offsetY: 30,
		arrowOffset: 60,
		orientation: 0,
		list: [
			{
				icon: "icon ico-system-pic",
				text: "顶/底背景",
				callback: function () {
					$(this).bgselect({}, function (ths, img) {
						$('.bar-header,.bar-footer').css('background', 'url(' + img + ')');
						$('.bar-header,.bar-footer').css('background-size', '100% 100%');
						storageAPI.setCss(".bar-header", {
							'background': 'url(' + img + ')',
							'background-size': '100% 100%'
						});
						storageAPI.setCss(".bar-footer", {
							'background': 'url(' + img + ')',
							'background-size': '100% 100%'
						});
						$(".system-item").fadeOut(500);
					});
				}
			},
			{
				icon: "glyphicon glyphicon-picture",
				text: "顶/底图片",
				callback: function () {
					$.fn.uploads.showDialog(function (data) {
						$('.bar-header,.bar-footer').css('background', 'url(' + data.file+ ')');
						$('.bar-header,.bar-footer').css('background-size', '100% 100%');
						storageAPI.setCss(".bar-header", {
							'background': 'url(' + data.file + ')',
							'background-size': '100% 100%'
						});
						storageAPI.setCss(".bar-footer", {
							'background': 'url(' + data.file + ')',
							'background-size': '100% 100%'
						});
					});
				}
			},
			{
				icon: "glyphicon glyphicon-adjust",
				text: " 顶/底颜色",
				callback: function () {
					$("#colorBox").css('top', $('.content').offset().top).show();
					$('.bar-header,.bar-footer').colorSelect({clbox: 'colorBox'}, function (ths, color) {
						ths.css('background', color);
						storageAPI.setCss(".bar-header", {'background': color});
						storageAPI.setCss(".bar-footer", {'background': color});
						storageAPI.setCss(".bottom-container > .bottom-menu", {'background': color});
					});
				}
			},
			{
				icon: "icon ico-system-pic",
				text: "主体背景",
				callback: function () {
					$(this).bgselect({}, function (ths, img) {
						$('body').css('background', 'url(' + img + ')');
						$('body').css('background-size', '100% 100%');
						$('.yunye-template,.header').css('background', 'url()');
						storageAPI.setCss("body", {
							'background': 'url(' + img + ')',
							'background-size': '100% 100%'
						});
						$('.header,.yunye-template').css('background', 'none');
						storageAPI.setCss(".header", {'background': 'none'});
						storageAPI.setCss(".yunye-template", {'background': 'none'});
						//storageAPI.setCss(".bar-header", {'background': 'none'});
						//storageAPI.setCss(".bar-footer", {'background': 'none'});
						$(".system-item").fadeOut(500);
					});
				}
			},
			{
				icon: "glyphicon glyphicon-adjust",
				text: " 主体颜色",
				callback: function () {
					$("#colorBox").css('top', $('.content').offset().top).show();
					$('body,.yunye-template,.header').colorSelect({clbox: 'colorBox'}, function (ths, color) {
						ths.css('background', color);
						storageAPI.setCss("body", {'background': color});
						//storageAPI.setCss(".bar-header", {'background': color});
						//storageAPI.setCss(".bar-footer", {'background': color});
						storageAPI.setCss(".yunye-template", {'background': color});
						storageAPI.setCss(".header", {'background': color});
					});
				}
			},
			{
				icon: "glyphicon glyphicon-transfer",
				text: "更换模版",
				callback: function () {
					$(".yunye-template").changeTemplate('destroy').changeTemplate();
				}
			}
		]
	});
	$('.qrcode .btn').registerPopUp({
		id: 'dpw_qr',
		offsetYPercent: 100,
		arrowOffset: 20,
		followMouse: true,
		list: [
			{
				icon: "glyphicon glyphicon-adjust",
				text: "颜色",
				callback: function () {
					$("#colorBox").css('top', $('.content').offset().top).show();
					$('.qrcode-inner .qrcode,.abutton-group a').colorSelect({clbox: 'colorBox'}, function (ths, color) {
						ths.css('background', color);
						storageAPI.setCss(".qrcode-inner .qrcode", {'background': color});
						storageAPI.setCss(".abutton-group a", {'background': color});
					});
				}
			},
			{
				icon: "icon ico-system-pic",
				text: "背景图片",
				callback: function () {
					$(this).bgselect({}, function (ths, img) {
						$('.qrcode-inner .qrcode,.abutton-group a').css('background', 'url(' + img + ')');
						$('.qrcode-inner .qrcode,.abutton-group a').css('background-size', '100% 100%');
						storageAPI.setCss(".qrcode-inner .qrcode", {
							'background': 'url(' + img + ')',
							'background-size': '100% 100%'
						});
						storageAPI.setCss(".abutton-group a", {
							'background': 'url(' + img + ')',
							'background-size': '100% 100%'
						});
						$(".system-item").fadeOut(500);
					});
				}
			},
			{
				icon: "glyphicon glyphicon-picture",
				text: " 上传图片",
				callback: function () {
					$.fn.uploads.showDialog(function (data) {
						if(!/\.(gif|jpg|jpeg|bmp|png)$/.test(data.file)){
							yyAlert("上传图片格式错误");
							return false;
						}
						$('.qrcode-inner .qrcode,.abutton-group a').css('background', 'url(' + data.file + ')');
						$('.qrcode-inner .qrcode,.abutton-group a').css('background-size', '100% 100%');
						storageAPI.setCss(".qrcode-inner .qrcode", {
							'background': 'url(' + data.file + ')',
							'background-size': '100% 100%'
						});
						storageAPI.setCss(".abutton-group a", {
							'background': 'url(' + data.file + ')',
							'background-size': '100% 100%'
						});
					});
				}
			}
		]
	});

	$(document).on("clsdp", function (e,target) {
		$("#colorBox").hide();
		editor('close');
		//$('#text-model').animate({'bottom':'-265px'},200);
		$('#systemimg-model,#button-model,.tab-item').removeClass('open');
		$('.cnd-element').removeClass('active');
		$(".music-link-layout-wrap").remove();
		if(!$(target).hasClass("dropdown-toggle"))$('.dropdown-panel').removeClass("open");
		if($(target).hasClass("dropdown-toggle"))$("#dp").removeClass("open");
		if(!target)$("#dp").removeClass("open");
		if(!$(target).hasClass('ele-rotate-ctrl')){
			$('.text-element').removeClass('text-element-act');
			$('.ele-rotate-ctrl').remove();
		}
		$('.bar-footer').removeClass('footer-hide');
	});

	$('body').on('click', function (event) {
		//处理点击事件
		// var click_list = ['#closebg'];
		// var item = '';
		// for (var i in click_list) {
		//   if ($(event.target).closest(click_list[i]).length != 0) {
		//       item = click_list[i];
		//       break;
		//   }
		// }
		// switch (item) {
		//   case "#closebg":
		//       //$(".system-item").fadeOut(200);
		//       break;
		// }
		//点击被保护列表中的对象返回
		window.clickItmList = window.clickItmList || ["#dp", "#colorBox"];
		var list = window.clickItmList;
		for (var i in list) {var listitem = list[i];
			if ($(event.target).closest(listitem).length !== 0)return;
		}
		//点击页面空白区域行为
		$('#dp').removeClass('open');
	});

	//数据绑定
	$('#dpw_title input').on('change', function (event) {
		$('.edit-bar-header .title p').html(event.currentTarget.value);
		storageAPI.setHead("unique_name", event.currentTarget.value);
	});
	$('.dayinfo input').on('change', function (event) {
		var inputs = $('#dpw_clock input');
		var start = inputs[0].value, end = inputs[1].value;
		if (start && end) {
			if (end < start) {
				$(event.target).blur();
				$('#dpw_clock input').eq(0).val("");
				$('#dpw_clock input').eq(1).val("");
				yyConfirm("结束时间不能早于开始时间");
			} else {
				var specificDay = $("#year").val() + "-" + $("#month").val() + "-" + $(".hover").html();
				var enabled = $('#dateState').hasClass("off") ? 0 : 1,
					year = parseInt($("#year").val()),
					month = parseInt($("#month").val()),
					week = new Date($("#year").val() , parseInt($("#month").val()) - 1, $(".hover").html()).getDay(),
					weekName = (week === 0) ? "Sunday" : (week == 1) ? "Monday" : (week == 2) ? "Tuesday" : (week == 3) ? "Wednesday" : (week == 4) ? "Thursday" : (week == 5) ? "Friday" :  "Saturday" ,
					info = yunyeEditorGlobal.lifetime.lifetime_weekly[weekName];
				if( start==info.start && end==info.end && enabled==info.enabled){
					$(".calender .hover").removeClass("special");
					delete yunyeEditorGlobal.lifetime.lifetime_special[specificDay];
				}else{
					if(enabled){
						$("td.hover").removeClass("off").addClass("special");
					}else{
						$("td.hover").removeClass("special").addClass("off");
					}
					yunyeEditorGlobal.lifetime.lifetime_special[specificDay] = {start:start,end:end,enabled:enabled};
				}
			}
		}
	});

	/* 模版空白设置背景 */
	window.templateMainActionInit = function(){
		$('.yunye-template').registerPopUp({
			id: 'dpw_template',
			offsetYPercent: 50,
			offsetY: 30,
			followMouse: true,
			list: [
				{
					icon: "icon ico-system-pic",
					text: "系统背景",
					callback: function () {
						$(this).bgselect({}, function (ths, img) {
							$('.yunye-template').css('background', 'url(' + img + ')');
							$('.yunye-template').css('background-size', '100% 100%');
							storageAPI.setCss(".yunye-template", {
								'background': 'url(' + img + ')',
								'background-size': '100% 100%'
							});
							$(".system-item").fadeOut(500);
						});
					}
				},
				{
					icon: "glyphicon glyphicon-adjust",
					text: " 颜色",
					callback: function () {
						$("#colorBox").css('top', $('.content').offset().top).show();
						$('.yunye-template').colorSelect({clbox: 'colorBox'}, function (ths, color) {
							ths.css('background', color);
							storageAPI.setCss(".yunye-template", {'background': color});
						});
					}
				},
				{
					icon: "glyphicon glyphicon-picture",
					text: "上传图片",
					callback: function () {
						$.fn.uploads.showDialog(function (data) {
							if(!/\.(gif|jpg|jpeg|bmp|png)$/.test(data.file)){
								yyAlert("上传图片格式错误");
								return false;
							}
							$('.yunye-template').css('background', 'url(' + data.file + ')');
							$('.yunye-template').css('background-size', '100% 100%');
							storageAPI.setCss(".yunye-template", {
								'background': 'url(' + data.file + ')',
								'background-size': '100% 100%'
							});
						});
					}
				},
				{icon: "glyphicon glyphicon-camera", text: "拍照"}
			]
		});
	};

	window.templateMainActionInit();
	$(".change-template-layout").hide();
});
