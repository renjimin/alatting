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
	__require__(2);
	__require__(3);
	__require__(4);
	__require__(5);
	__require__(6);
	__require__(7);
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
	
	api.init = function(pannel){
		var pannelName = __require__(3).getCurrentPannel(),
			pannel = $("#" + pannelName);
		menuList = pannel.find(".nav-item");
		_.each(menuList,function(item){
			var aTag = $(item).find(".nav-link");
			if(aTag.data("toggle"))aTag.off("click").on("click",function(){
				var subnav = $(item).find(".subnav");
				if(subnav.is(":visible")){
					subnav.slideUp(200);
				}else{
					subnav.slideDown(200);
				}
			});
		});
		if(Editor.require(pannelName)){
			var editorModule = Editor.require(pannelName);
			editorModule.init();
		}
	}
	module.exports = api;
},
//[模块3]切换右侧面板模块
function(module, exports, __require__){
	var api = {};
	var currentPannel;

	api.switchPannel = function(pannelName){
		if(currentPannel == pannelName)return;
		$("#" + currentPannel).hide();
		$("#" + pannelName).show();
		currentPannel = pannelName;
		var toggleMenu = __require__(2);
		toggleMenu.init($("#" + pannelName));
	}
	api.getCurrentPannel = function(){
		return currentPannel;
	}
	module.exports = api;
},
//[模块4]点击高亮模块
function(module, exports, __require__){
	Editor.define("hightClick",module.exports = function(){
		var api = {};
		var pannelSwitcher =  __require__(3);
		var clicklist = ".header-qrcode,.header-logo,.header-abutton,.header-info,.mask,.edit-bar-header,.content-top,.content-middle,.content-bottom".split(",");
		var currentSelect = null;

		api.ready = function(){
			$(document).on("click",function(e){
				if($(e.target).closest(".edit-body").length != 0){
					_.each(clicklist,function(item){
						if($(e.target).closest(item).length != 0){
							$(".active").removeClass("active");
							var transform = "";
							if($(item).closest(".yunye-template").length  != 0)transform = $(".yunye-template").css("transform");
							hightItem(item,transform);
							pannelSwitcher.switchPannel($(item).data("pannel"));
							return;
						}
					});
				}
			});
			function hightItem(itemName,transform){
				var item = $(itemName),
					editBody = $(".edit-body"),
					x = item.offset().left - $(".edit-body").offset().left,
					y = item.offset().top - $(".edit-body").offset().top,
					width = item.outerWidth() - 4,
					height = item.outerHeight() - 4;
				item.addClass("active");
				currentSelect = item;
				$(".vitrul-body .hightlight").show().width(width).height(height).css({"top":y,"left":x,"transform":transform});
			}
		}
		api.removeHighLigh = function(){
			$(".vitrul-body .hightlight").hide();
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
		var pannelSwitcher =  __require__(3);
		var clicklist = ".item-text,.item-sysimg,.item-button,.item-music".split(",");

		api.ready = function(){
			_.each(clicklist,function(item){
				$(item).on("click",function(){
					$(".active").removeClass("active");
					Editor.require("hightClick").removeHighLigh();
					$(item).addClass("active");
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
			api.setValue("unique_name",yunyeEditorGlobal.unique_name);
			api.bindData($("#short_description"),"short_description");
			api.bindData($("#descInput"),"short_description");
			api.setValue("short_description",yunyeEditorGlobal.short_description);
			//无需绑定的数据
			$("#phoneInput").val(yunyeEditorGlobal.phone);
			$("#mobileInput").val(yunyeEditorGlobal.mobile);
			$("#emailInput").val(yunyeEditorGlobal.email);
			$("#adressInput").val(yunyeEditorGlobal.address);
		}
		api.bind 
		api.bindData = function(element,valueName){
			if(binders[valueName]){
				binders[valueName].elements.push(element);
			}else{
				binders[valueName] = {
					elements:[element],
					value:null
				};
			}
			if( element.is("input, textarea, select") ){
				element.off("input propertychange").on("input propertychange",function(){
					api.setValue(valueName,element.val());
				});
			}
		}
		api.setValue =function(valueName,value){
			binders[valueName].value = value;
			_.each(binders[valueName].elements,function(item){
				if( item.is("input, textarea, select") ){
					item.val( value );
				}else{
					item.html( value );
				}
			});
		}
		return api;
	});
},
//[模块7]图片视频编辑模块
function(module, exports, __require__){
	Editor.define("template_clip_pannel",module.exports = function(){
		var api = {};

		api.init = function(){
			$("#template_clip_pannel .nav-link").on("click",function(){
				var target = Editor.require("hightClick").getCurrentTarget();
				console.log(target);
			});

		}
		return api;
	});
}
]);