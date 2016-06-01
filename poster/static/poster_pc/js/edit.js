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
	__require__(2);
	__require__(3);
	__require__(4);
	__require__(5);
	__require__(6);
	__require__(7);
	__require__(8);
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
					//$(item).addClass("active");
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

		api.init = function(){
			
		}
		api.destory = function(){
			
		}
		return api;
	});
},
//[模块8]头部背景颜色模块
function(module, exports, __require__){
	Editor.define("header_background_pannel",module.exports = function(){
		var api = {};
		var palette = Editor.require("palette");

		api.init = function(){
			palette.init($("#header_background_pannel .palette"),$(".header"),"background");
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
}
]);