(function(){

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
		return Editor.modules[moduleName];
	}
	Editor.ready = function(){
		_.each(primary, __callReady);
		function __callReady(readyFn) {
			isFunction(readyFn) && readyFn();
		}
	}

	$(Editor.ready);
	window.Editor = Editor;
})();

(function(Editor){
	Editor.define("togglePannel",function(){
		var api = {};
		var pannels = {};

		api.createPannel = function(name,options){
			if(pannels[name])return;
			options.title.name
			options.title.icon
			pannels[name] = {title:1};
		};
		return api;
	});
})(window.Editor);

(function(Editor){
	Editor.define("hightClick",function(){
		var api = {};
		var clicklist = ".header-qrcode,.header-logo,.header-abutton,.header-info,.mask,.edit-bar-header,.content-top,.content-middle,.content-bottom".split(",");

		api.ready = function(){
			$(document).on("click",function(e){
				if($(e.target).closest(".edit-body").length != 0){
					_.each(clicklist,function(item){
						if($(e.target).closest(item).length != 0){
							var transform = "";
							if($(item).closest(".yunye-template").length  != 0)transform = $(".yunye-template").css("transform");
							hightItem(item,transform);
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
				$(".vitrul-body .hightlight").width(width).height(height).css({"top":y,"left":x,"transform":transform});
			}
		}
		return api;
	});
})(window.Editor);