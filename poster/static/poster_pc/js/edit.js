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

