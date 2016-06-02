(function(modules) { 
	var installedModules = {};//模块缓存对象
	function __require__(moduleId){
		if(installedModules[moduleId])return installedModules[moduleId].exports;//检查模块是否在缓存中
		var module = installedModules[moduleId] = {
			exports: {},
			id: moduleId,
			loaded: false
		}//为模块创建一个模型(并放入缓存)
		modules[moduleId].call(module.exports, module, module.exports, __require__);//执行模块方法
		module.loaded = true;//标记模块为已加载
		return module.exports;//将模块的exports返回
	}
	__require__.m = modules;//暴露模块对象
	__require__.c = installedModules;//暴露模块缓存
	__require__.p = "/";//公共路径
	return __require__(0);//加载入口模块,并返回模块export
})([
//[模块0]入口模块
function(module, exports, __require__) {
	__require__(1);
	__require__(9);
	__require__(12);
	__require__(14);
	__require__(2);
	__require__(3);
	__require__(4);
	__require__(5);
	__require__(6);
	__require__(7);
	__require__(8);
	__require__(13);
},
//[模块1]核心模块
function(module, exports, __require__) {
	var Editor = {
		modules :{}
	};
	var isFunction = $.isFunction;
	var domready = false;
	var primary = [];

	Editor.define = function(moduleName,factory){
		var instance = Editor.modules[moduleName] = factory() || {};
		if(domready){
			instance.ready && isFunction(instance.ready) && instance.ready();
		}else{
			if( !_.contains(primary, instance.ready))primary.push(instance.ready);
		}
		return instance;
	}
	Editor.require = function(moduleName){
		if(Editor.modules[moduleName])return Editor.modules[moduleName];
		return null;
	}
	Editor.ready = function(){
		_.each(primary, __callReady);
		function __callReady(readyFn) {
			isFunction(readyFn) && readyFn();
		}
	}

	$(Editor.ready);
	window.Editor = Editor;
},
//[模块2]右侧面板菜单toggle模块
function(module, exports, __require__){
	var api = {};
	var menuList;
	
	api.init = function(pannelName){
		var pannel = $("#" + pannelName);
		menuList = pannel.find(".nav-item");
		_.each(menuList,function(item){
			var aTag = $(item).find(".nav-link");
			if(aTag.data("toggle"))aTag.on("click",function(){
				var subnav = $(item).find(".subnav");
				if(subnav.is(":visible")){
					subnav.slideUp(200);
				}else{
					subnav.slideDown(200);
				}
			});
		});
		var editorModule = Editor.require(pannelName);
		if(editorModule && editorModule.init && $.isFunction(editorModule.init))editorModule.init();
	}
	api.destory = function(pannelName){
		var pannel = $("#" + pannelName);
		menuList = pannel.find(".nav-item");
		_.each(menuList,function(item){
			var aTag = $(item).find(".nav-link");
			if(aTag.data("toggle"))aTag.off("click");
		});
		var editorModule = Editor.require(pannelName);
		if(editorModule && editorModule.destory && $.isFunction(editorModule.destory))editorModule.destory();
	}
	module.exports = api;
},
//[模块3]切换右侧面板模块
function(module, exports, __require__){
	Editor.define("switchPannel",module.exports = function(){
		var api = {};
		var currentPannel;

		api.switchPannel = function(pannelName){
			if(currentPannel == pannelName)return;
			$(".active").removeClass("active");
			$("#" + currentPannel).hide();
			__require__(2).destory(currentPannel);

			currentPannel = pannelName;
			$("#" + pannelName).show();
			if($("[data-pannel="+currentPannel+"]"))$("[data-pannel="+currentPannel+"]").addClass("active");
			__require__(2).init(currentPannel);
		}
		api.getCurrentPannel = function(){
			return currentPannel;
		}
		return api;
	});
},
//[模块4]点击高亮模块
function(module, exports, __require__){
	Editor.define("hightClick",module.exports = function(){
		var api = {};
		var pannelSwitcher = Editor.require("switchPannel");
		var clicklist = ".header-qrcode,.header-logo,.header-abutton,.header-info,.mask,.edit-bar-header,.yunye-template > .content > div".split(",");
		var currentSelect = null;

		api.ready = function(){
			$(document).on("click",function(e){
				if($(e.target).closest(".edit-body").length != 0){
					_.each(clicklist,function(itemSelector){
						if( $(e.target).closest(itemSelector).length == 0 )return;
						if( $(itemSelector).length == 1 ){
							var item  = $(itemSelector);
						}else{
							var item  = $(e.target).closest(itemSelector);
						}
						var transform = "",pannelName = "";
						if(item.closest(".yunye-template").length  != 0){
							transform = $(".yunye-template").css("transform");
							pannelName = "template_clip_pannel";
							item.addClass("active");
						}else{
							pannelName = $(itemSelector).data("pannel");
						}
						hightItem(item,transform);
						pannelSwitcher.switchPannel(pannelName);
					});
				}
			});
			function hightItem(item,transform){
				var editBody = $(".edit-body"),
					x = item.offset().left - $(".edit-body").offset().left,
					y = item.offset().top - $(".edit-body").offset().top,
					width = item.outerWidth() - 4,
					height = item.outerHeight() - 4;
				currentSelect = item;
				$(".hightlight").show().width(width).height(height).css({"top":y,"left":x,"transform":transform});
			}
		}
		api.resizeHighLigh = function(){
			if( !api.getCurrentTarget() )return;
			var item = api.getCurrentTarget(),
				width = item.outerWidth() - 4,
				height = item.outerHeight() - 4;
			$(".hightlight").width(width).height(height);
		}
		api.removeHighLigh = function(){
			if(currentSelect)currentSelect.removeClass("active");
			$(".hightlight").hide();
		}
		api.getCurrentTarget = function(){
			return currentSelect;
		}
		return api;
	});
},
//[模块5]点击头部切换面板模块
function(module, exports, __require__){
	Editor.define("headerClick",module.exports = function(){
		var api = {};
		var pannelSwitcher =  Editor.require("switchPannel");
		var clicklist = ".item-text,.item-sysimg,.item-button,.item-music".split(",");

		api.ready = function(){
			_.each(clicklist,function(item){
				$(item).on("click",function(){
					Editor.require("hightClick").removeHighLigh();
					pannelSwitcher.switchPannel($(item).data("pannel"));
				});
			});
		}
		return api;
	});
},
//[模块6]数据模块
function(module, exports, __require__){
	Editor.define("dataHandler",module.exports = function(){
		var api = {};
		var binders = {};

		api.ready = function(){
			//有绑定的数据
			api.bindData($("#logo_title"),"unique_name");
			api.bindData($("#titleInput"),"unique_name");
			api.bindData($("#titleLastLength"),"unique_name","var calV = 10 - String(__value__).length;( calV < 0) ? 0 : calV;");
			api.setValue("unique_name",yunyeEditorGlobal.unique_name);
			api.bindData($("#short_description"),"short_description");
			api.bindData($("#descInput"),"short_description");
			api.bindData($("#descLastLength"),"short_description","Editor.require('hightClick').resizeHighLigh();var calV = 50 - String(__value__).length;( calV < 0) ? 0 : calV;");
			api.setValue("short_description",yunyeEditorGlobal.short_description);
			//无需绑定的数据
			$("#phoneInput").val(yunyeEditorGlobal.phone);
			$("#mobileInput").val(yunyeEditorGlobal.mobile);
			$("#emailInput").val(yunyeEditorGlobal.email);
			$("#adressInput").val(yunyeEditorGlobal.address);
		}
		api.bindData = function(element,valueName,eval){
			if(binders[valueName]){
				binders[valueName].elements.push({"element":element,"eval":eval});
			}else{
				binders[valueName] = {
					elements:[{"element":element,"eval":eval}],
					value:null
				};
			}
			if( element.is("input, textarea, select") ){
				element.off("input propertychange").on("input propertychange",function(){
					api.setValue(valueName,element.val(),element);
				});
			}
		}
		api.setValue = function(valueName,value,valueItem){
			binders[valueName].value = value;
			_.each(binders[valueName].elements,function(obj){
				var item = obj.element,
					compiledValue;
				if( item==valueItem )return;
				if(obj.eval){
					var __value__ = value;
					compiledValue = eval(obj.eval);
				}else{
					compiledValue = value;
				}
				if( item.is("input, textarea, select") ){
					item.val( compiledValue );
				}else{
					item.html( compiledValue );
				}
			});
		}
		api.getValue = function(valueName){
			return binders[valueName].value;
		}
		return api;
	});
},
//[模块7]contact模块
function(module, exports, __require__){
	Editor.define("contact_pannel",module.exports = function(){
		var api = {};
		var daterModule = __require__(10),
			calendarModule = __require__(11);

		api.init = function(){
			var nowTime = daterModule.getToday();
			calendarModule.init(nowTime.year,nowTime.month);
		}
		api.destory = function(){
			calendarModule.offEvent();
		}
		return api;
	});
},
//[模块8]头部背景颜色模块
function(module, exports, __require__){
	Editor.define("header_background_pannel",module.exports = function(){
		var api = {};
		var palette = Editor.require("palette");
		var system_context = Editor.require("system_context");
		api.init = function(){
			palette.init($("#header_background_pannel .palette"),$(".header"),"background");
			system_context.init($("#header_background_pannel .system_context"),$(".header"),"background");
		}
		api.destory = function(){
			palette.destory();
		}
		return api;
	});
},
//[模块9]调色板模块
function(module, exports, __require__){
	Editor.define("palette",module.exports = function(){
		var api ={};
		var colorSet   = [["#ffffff","#ffffff","#e2e3e5","#e46d1d8","#388bb7","#47b4f9","#7ac7fb","#5c89cd","#3650bf","#7934ff","#8500ff","#9900cd","#cb00bc"],
						["#a7a7a7","#555555","#55e1bc","#51c2ae","#2c749c","#809cff","#4a3eff","#a106ff","#9200c5","#c137ff","#ec6db4","#eb6d78","#ef008f"],
						["#1e1e1e","#1f965c","#1aa901","#77dd00","#b1df73","#c8ff01","#eeea02","#d6ba01","#c57401","#f28715","#f65b2f","#d92940","#000108"]];
		var container = null;
		api.init = function(div,target,cssName){
			if( !div.html().trim() ){
				var str = "";
				_.each(colorSet,function(arr){
					str += "<tr>"
					_.each(arr,function(color){
						str += "<td style='background:"+ color +";'></td>"
					});
					str += "</tr>"
				});
				str = "<table class='colorBox'>"+ str +"</table>"
				str += "<div class='colorPannel'><div class='colorGrid' style='background-color: rgb(255, 0, 0);'><div class='color-picker'><div></div></div></div><div class='colorSlider'><div class='color-picker'></div></div>"
					+"<table><tr><td style='background:#000000;'></td><td style='background:#ffffff;'></td><td style='background:#ffecce;'></td></tr>"
					+"<tr><td style='background:#ff8001;'></td><td style='background:#458026;'></td><td style='background:#ffff01;'></td></tr>"
					+"<tr><td style='background:#fe0000'></td><td style='background:#008001;'></td><td style='background:#0000fe;'></td></tr>"
					+"<tr style='margin-bottom: 15px;display: block;'><td style='background:#ee82ef;'></td></tr>"
					+"<tr><td style='background:'></td><td style='background:#666666;'></td><td style='background:#8e3b2d;'></td></tr>"
					+"<tr><td style='background:#c1c1c1;'></td><td style='background:#cecece;'></td><td style='background:#f4f4f4;'></td></tr></table>"
					+"<div class='colorPrev' style='background-color: rgb(128, 64, 64);'></div><input type='' value='#804040'/></div>"
				div.empty().append(str);
			}
			container = div;
			api.initColorBox(target,cssName);
			api.initPannel(target,cssName);
		}
		api.destory = function(div){
			container.find(".colorBox").off("click");
			container.find(".colorPannel table").off("click");
			container.find(".colorPannel input").off("change");
			$(document)
				.off('mousedown.colorPannel touchstart.colorPannel', '.colorGrid, .colorSlider')
				.off('mousemove.colorPannel touchmove.colorPannel')
				.off('mouseup.colorPannel touchend.colorPannel');
			container = null;
		}
		api.initColorBox = function(targetToChange,cssName){
			container.find(".colorBox").on("click",function(e){
				var index = $(e.currentTarget).find("td").index($(e.target));
				if( index==38 ){
					var colorPannel = $(e.currentTarget).next();
					if(colorPannel.is(":visible")){
						colorPannel.slideUp(200);
					}else{
						colorPannel.slideDown(200);
					}
				}else{
					if( index==0 ){
						var bgC = "transparent";
					}else{
						var bgC = $(e.target).css("background-color");
					}
					targetToChange.css(cssName,bgC);
				}
			});
			container.find(".colorPannel table").on("click",function(e){
				var index = $(e.currentTarget).find("td").index($(e.target));
				var bgC = $(e.target).css("background-color");
				targetToChange.css(cssName,bgC);
			});
			container.find(".colorPannel input").on("change",function(e){
				var inputValue = $(e.currentTarget).val().trim().substr(1);
				var bgC = parseHex(inputValue);
				container.find(".colorPannel .colorPrev").css('background',bgC);
				targetToChange.css(cssName,bgC);
			});
		}
		api.initPannel = function(targetToChange,cssName){
			$(document)
			.on('mousedown.colorPannel touchstart.colorPannel', '.colorGrid, .colorSlider', function(event) {
				var target = $(this);
				event.preventDefault();
				$(document).data('colors-target', target);
				move(target, event, true);
			})
			.on('mousemove.colorPannel touchmove.colorPannel', function(event) {
				var target = $(document).data('colors-target');
				if( target ) move(target, event);
			})
			.on('mouseup.colorPannel touchend.colorPannel', function() {
				$(this).removeData('colors-target');
			});
			function move(target, event){
				var picker = target.find('[class$=-picker]'),
					offsetX = target.offset().left,
					offsetY = target.offset().top,
					x = Math.round(event.pageX - offsetX),
					y = Math.round(event.pageY - offsetY),
					wx, wy, r, phi;
				if( event.originalEvent.changedTouches ) {
					x = event.originalEvent.changedTouches[0].pageX - offsetX;
					y = event.originalEvent.changedTouches[0].pageY - offsetY;
				}
				if( x < 0 ) x = 0;
				if( y < 0 ) y = 0;
				if( x > target.width() ) x = target.width();
				if( y > target.height() ) y = target.height();
				if( target.is('.colorGrid') ) {
					picker.stop(true).animate({top: y + 'px',left: x + 'px'}, 0, 'swing', function() {updateFromControl(target,targetToChange,cssName);});
				}else{
					picker.stop(true).animate({top: y + 'px'}, 0, 'swing', function() {updateFromControl(target,targetToChange,cssName);});
				}
			}
			function updateFromControl(target,targetToChange,cssName) {
				function getCoords(picker, container) {
					var left, top;
					if( !picker.length || !container ) return null;
					left = picker.offset().left;
					top = picker.offset().top;
					return {x: left - container.offset().left + (picker.outerWidth() / 2),
							y: top - container.offset().top + (picker.outerHeight() / 2)};
				}
				var hue, saturation, brightness, x, y, r, phi,
					minicolors = target.parent(),
					grid = minicolors.find('.colorGrid'),
					slider = minicolors.find('.colorSlider'),
					gridPicker = grid.find('[class$=-picker]'),
					sliderPicker = slider.find('[class$=-picker]'),
					gridPos = getCoords(gridPicker, grid),
					sliderPos = getCoords(sliderPicker, slider);
				hue = keepWithin(360 - parseInt(sliderPos.y * (360 / slider.height()), 10), 0, 360);
				saturation = keepWithin(Math.floor(gridPos.x * (100 / grid.width())), 0, 100);
				brightness = keepWithin(100 - Math.floor(gridPos.y * (100 / grid.height())), 0, 100);
				grid.css('backgroundColor', rgb2hex(hsb2rgb({ h: hue, s: 100, b: 100 })));
				var hex = rgb2hex(hsb2rgb({ h: hue, s:saturation, b:brightness }));
				targetToChange.css( cssName,hex );
				minicolors.find(".colorPrev").css( 'backgroundColor',hex );
				minicolors.find("input").val( hex );
			}
			function keepWithin(value, min, max) {
				if( value < min ) value = min;
				if( value > max ) value = max;
				return value;
			}
		}
		function hsb2rgb(hsb) {
			var rgb = {};
			var h = Math.round(hsb.h);
			var s = Math.round(hsb.s * 255 / 100);
			var v = Math.round(hsb.b * 255 / 100);
			if(s === 0) {
				rgb.r = rgb.g = rgb.b = v;
			} else {
				var t1 = v;
				var t2 = (255 - s) * v / 255;
				var t3 = (t1 - t2) * (h % 60) / 60;
				if( h === 360 ) h = 0;
				if( h < 60 ) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
				else if( h < 120 ) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
				else if( h < 180 ) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
				else if( h < 240 ) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
				else if( h < 300 ) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
				else if( h < 360 ) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
				else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
			}
			return {r: Math.round(rgb.r),g: Math.round(rgb.g),b: Math.round(rgb.b)};
		}
		function rgb2hex(rgb) {
			var hex = [rgb.r.toString(16),rgb.g.toString(16),rgb.b.toString(16)];
			$.each(hex, function(nr, val) {
				if (val.length === 1) hex[nr] = '0' + val;
			});
			return '#' + hex.join('');
		}
		function parseHex(string, expand) {
			string = string.replace(/[^A-F0-9]/ig, '');
			if( string.length !== 3 && string.length !== 6 ) return '';
			if( string.length === 3 && expand ) {
				string = string[0] + string[0] + string[1] + string[1] + string[2] + string[2];
			}
			return '#' + string;
		}
		return api;
	});
},
//[模块10]日期模块
function(module, exports, __require__){
	var api = {};

	api.getToday = function(){
		var date = new Date();//获得时间对象
		var nowYear = date.getFullYear();//获得当前年份
		var nowMonth = date.getMonth() + 1;//获得当前月份
		var today = date.getDate();//获得当前天数
		var nowWeek = new Date(nowYear, nowMonth - 1, 1).getDay();//获得当前星期
		var nowLastday = api.getMonthNum(nowMonth, nowYear);//获得最后一天
		return {year:nowYear,month:nowMonth,day:today,week:nowWeek,lastday:nowLastday};
	}
	api.getMonthNum = function(month,year){
		month = parseInt(month - 1);
		var LeapYear = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true: false;
		_.each([{num:[0,2,4,6,7,9,11],value:31},{num:[3,5,8,10],value:30},{num:[1],value:LeapYear ? 29: 28}],function(obj){
			_.each(obj.num,function(n){
				if(n == month)monthNum = obj.value;
			});
		});
		return monthNum;
	}
	module.exports = api;
},
//[模块11]calendar模块
function(module, exports, __require__){
	var api = {};
	var inited = false;
	var daterModule = __require__(10);

	api.init = function(year, month){
		if(!inited){
			inited = true;
			api.gotoYM(year, month);
		}
		api.bindEvent();
	}
	api.gotoYM = function(year, month){
		var week = new Date(year, month - 1, 1).getDay();
		var lastday = daterModule.getMonthNum(month,year);
		$("#year").val(year);
		$("#month").val(month);
		var table = document.getElementById("calender");
		var n = 1;
		for (var j = 0; j < week; j++) {
			table.rows[1].cells[j].innerHTML = "&nbsp;"
			table.rows[1].cells[j].className = "";
		}
		for (var j = week; j < 7; j++) {
			//table.rows[1].cells[j].className = calculateClass(j,n);
			table.rows[1].cells[j].innerHTML = n;
			n++;
		}
		for (var i = 2; i < 7; i++) {
			for (j = 0; j < 7; j++) {
				if (n > lastday) {
					table.rows[i].cells[j].innerHTML = "&nbsp;"
					table.rows[i].cells[j].className = "";
				}else {
					//table.rows[i].cells[j].className = calculateClass(j,n);
					table.rows[i].cells[j].innerHTML = n;
					n++;
				}
			}
		}
	}
	api.bindEvent = function(){
		$("#calender td").on('click',function(event) {
			if( event.target.innerHTML  == "&nbsp;" )return;
			$('.calenderTable input').eq(0).val("").attr("disabled",false);
			$('.calenderTable input').eq(1).val("").attr("disabled",false);
			$("td.hover").removeClass("hover");
			$(this).addClass("hover");
			var specificDay = $("#year").val() + "-" + $("#month").val() + "-" + event.target.innerHTML;
			//setInput(specificDay);
		});
		$(".fa.fa-cog").on("click",function(event) {
			if($(".weekly").is(":visible")){
				$(".calender").show();
				$(".weekly").hide();
				api.gotoYM(parseInt($("#year").val()), parseInt($("#month").val()));
			}else{
				$(".calender").hide();
				$(".weekly").show();
			}
		});
	}
	api.offEvent = function(){
		$("#calender td").off('click');
		$(".fa.fa-cog").off("click");
	}
	module.exports = api;
},
//[模块12]文字编辑模块
function(module, exports, __require__){
	Editor.define("textEditor",module.exports = function(){
		var api ={};
		var container,textColorInput,textSizeInput,borderColorInput,borderSizeInput,textOpacityInput,textShadowInput,ID,sliderTarget;

		api.init = function(div,target){
			if( !container ){
				ID = "textEditor_" + $(".ttttEditor").length ; 
				var str = "<div class='form-horizontal ttttEditor "+ID+"'>"
							+"<div class='form-group'><label class='col-xs-2 control-label'>颜色</label><div class='col-xs-4'><input class='form-color text-color jscolor' readonly='readonly'></div><label class='col-xs-2 control-label'>大小</label><div class='col-xs-4'><select class='form-control text-fontSize'><option value='12'>12px</option><option value='13'>13px</option><option value='14'>14px</option><option value='15'>15px</option><option value='16'>16px</option><option value='17'>17px</option><option value='18'>18px</option><option value='19'>19px</option><option value='20'>20px</option><option value='21'>21px</option><option value='22'>22px</option><option value='23'>23px</option><option value='24'>24px</option><option value='25'>25px</option><option value='26'>26px</option><option value='27'>27px</option><option value='28'>28px</option><option value='29'>29px</option></select></div></div>"
							+"<div class='form-group'><label class='col-xs-2 control-label'>透明度</label><div class='col-xs-7'><input type='range' class='range text-opacity' name='opacity' min='0' max='100' value='100'></div><div class='col-xs-3'><input type='text' class='form-control text-opacity' value='100%'></div></div>"
							+"<div class='form-group'><label class='col-xs-2 control-label'>阴影</label><div class='col-xs-7'><input type='range' class='range text-boxShadow' name='volume' min='0' max='100' value='0'></div><div class='col-xs-3'><input type='text' class='form-control text-boxShadow' value='0px'></div></div>"
							+"<div class='form-group'><label class='col-xs-2 control-label'>边框</label><div class='col-xs-7'><input class='form-color text-color jscolor' readonly='readonly'></div><div class='col-xs-3'><input type='text' class='form-control border-Control' value='0px'></div></div>"
						+"</div>";
				div.empty().append(str);
				container = div,
				textColorInput = container.find(".form-color.text-color.jscolor").eq(0),
				textSizeInput = container.find(".form-control.text-fontSize").eq(0),
				borderColorInput = container.find(".form-color.text-color.jscolor").eq(1),
				borderSizeInput = container.find(".border-Control").eq(0),
				textOpacityInput = container.find(".form-control.text-opacity"),
				textShadowInput = container.find(".form-control.text-boxShadow");

				target.css("fontSize",textSizeInput.val() + "px");
				target.css("borderWidth",borderSizeInput.val());
				new jscolor(container.find(".form-color.text-color.jscolor")[0]);
				new jscolor(container.find(".form-color.text-color.jscolor")[1]);
			}
			api.initEditor(target);
		}
		api.initEditor = function(target){
			textColorInput.on("input propertychange change",function(e){
				target.css("color",$(e.target).css("background-color"));
			});
			borderColorInput.on("input propertychange change",function(e){
				target.css("borderColor",$(e.target).css("background-color"));
			});
			textSizeInput.on("change",function(e){
				target.css("fontSize",textSizeInput.val() + "px");
			});
			borderSizeInput.on("change",function(e){
				target.css("borderWidth",borderSizeInput.val());
			});
			textOpacityInput.on("change",function(e){
				
			});
			api.initSliders(target);
		}
		api.initSliders = function(target){
			$(document)
			.on("mousedown."+ID+" touchstart."+ID,".range.text-opacity,.range.text-boxShadow",function(event){
				sliderTarget = $(this);
				event.preventDefault();
				move(event);
			})
			.on("mousemove."+ID+" touchmove."+ID,function(event){
				if(!sliderTarget)return;
				move(event);
			})
			.on("mouseup."+ID+" touchend."+ID,function(event){
				sliderTarget = null;
			})
			function move(event){
				if(!sliderTarget)return;
				var offsetX = sliderTarget.offset().left,
					x = Math.round(event.pageX - offsetX),
					wx = sliderTarget.outerWidth();
				if( x < 0 ) x = 0;
				if( x > wx ) x = wx;
				var percent = Math.round(x/wx *100);
				sliderTarget.val(percent);
				if(sliderTarget.is(".text-opacity")){
					textOpacityInput.val(percent+"%");
					target.css("opacity",percent/100);
				}else{
					var pxv = 5 * percent /100;
					textShadowInput.val(pxv+"px");
					target.css("textShadow","#000 "+ pxv +"px "+ pxv +"px 2px");
				}
			}
		}
		api.destory = function(div){
			_.each([textColorInput,borderColorInput,textSizeInput,borderSizeInput],function(item){
				item.off("input propertychange change");
			});
			$(document)
			.off("mousedown."+ID+" touchstart."+ID,".range.text-opacity,.range.text-boxShadow")
			.off("mousemove."+ID+" touchmove."+ID)
			.off("mouseup."+ID+" touchend."+ID);
		}
		return api;
	});
},
//[模块13]logo编辑模块
function(module, exports, __require__){
	Editor.define("logo_pannel",module.exports = function(){
		var api ={};
		var pannel,textBtn,textEdit,imgBtn,imgEdit,textEditor;

		api.ready = function(){
			pannel = $("#logo_pannel"),
			textBtn = pannel.find(".nav-link").eq(0),
			textEdit = pannel.find(".subnav").eq(0),
			imgBtn = pannel.find(".nav-link").eq(1),
			imgEdit = pannel.find(".subnav").eq(1),
			textEditor = Editor.require("textEditor");

			var dataHandler = Editor.require("dataHandler");
			dataHandler.bindData($(".header-logo h2"),"header_logo_text");
			dataHandler.bindData(pannel.find(".text-textarea"),"header_logo_text");
		}
		api.init = function(){
			var state = $(".header-logo h2").is(":visible");
			if(state){
				showText();
			}else{
				showImg();
			}
			textBtn.off("click").on("click",function(){
				showText();
			});
			imgBtn.off("click").on("click",function(){
				showImg();
			});
			textEditor.init($(".textEditor"),$(".header-logo h2"));
		}
		function showText(){
			textEdit.slideDown(200);
			imgEdit.slideUp(200);
			$(".header-logo h2").show();
			$(".header-logo img").hide();
		}
		function showImg(){
			textEdit.slideUp(200);
			imgEdit.slideDown(200);
			$(".header-logo img").show();
			$(".header-logo h2").hide();
		}
		api.destory = function(div){
			textEditor.destory();
		}
		return api;
	});
},
//头部背景设置
function(module, exports, __require__){
	Editor.define("system_context",module.exports = function(){
		var api ={};
		var container = null;
		var str = "";
		console.log(44);
		api.init = function(div,target,cssName){
			if( !container ){
				$.ajax({
					type:'GET',
					async:false,
					url:'/api/v1/poster/system/background',
					success:function(data){
						str = '<div class = "system_context-div"><ul class = "system_context-ul">';
						for (var i = 0; i < data.length; i++) {
							str += '<li class = "system_context-li" data-url ='+data[i].image_url+'><img src ="'+data[i].image_url+'"></li>';
							console.log(data.length)
						};
						str +="</ul></div>";
					},
					error:function(){

					}
				})
				console.log(div);				
				div.empty().append(str);
			}
			container = div;
			api.systemContext(target,cssName);
		}
		/*api.destory = function(div){
			container.find(".colorBox").off("click");
			container.find(".colorPannel table").off("click");
			container.find(".colorPannel input").off("change");
			$(document)
				.off('mousedown.colorPannel touchstart.colorPannel', '.colorGrid, .colorSlider')
				.off('mousemove.colorPannel touchmove.colorPannel')
				.off('mouseup.colorPannel touchend.colorPannel');
			container = null;
		}*/
		api.systemContext = function(targetToChange,cssName){
			container.find(".system_context-li").on("click",function(e){
				var bgC = 'url('+$(this).attr('data-url')+')';
				targetToChange.css(cssName,bgC);
				targetToChange.css('background-size','100% 100%');
			});
		}
		return api;
	});
}
]);