$(function() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=C5LOoqZmix3NyQn11w5z8IEzh1M57Rry&callback=init";
	document.body.appendChild(script);

	window.init = function() {
		window.baiduMap = new BMap.Map("allmap"); // 创建Map实例

		var _localAdress;
		if (!(yunyeEditorGlobal.updated_at > $.fn.yunyeStorage.getHead("updated_at")) && $.fn.yunyeStorage.getHead("address")) {
			_localAdress = $.fn.yunyeStorage.getHead("address").address;
		} else {
			_localAdress = yunyeEditorGlobal.address;
		}
		//console.log(_localAdress);
		var local = new BMap.LocalSearch(baiduMap, { //智能搜索
			onSearchComplete: function() {
				if (pp = local.getResults().getPoi(0)) {
					var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
					baiduMap.clearOverlays();
					baiduMap.addOverlay(new BMap.Marker(pp)); //添加标注
					baiduMap.centerAndZoom(pp, 14);
					var add = {
						address: $("#suggestId").val(),
						city: local.getResults().city,
						province: local.getResults().province
					}
					$.fn.yunyeStorage.setHead("address", add);
				} else {
					$("#suggestId").val("");
					$("#suggestId").attr('placeholder', '未搜索到您所填的位置');
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition(function(r) {
						if (this.getStatus() == BMAP_STATUS_SUCCESS) {
							//yyAlert("没找到你要输入的地址,自动定位到当前位置");
							var mk = new BMap.Marker(r.point);
							baiduMap.clearOverlays();
							baiduMap.addOverlay(mk);
							baiduMap.centerAndZoom(r.point, 14);
							$.fn.yunyeStorage.setHead("address", '');
						} else {
							//yyAlert("没找到你要输入的地址和自动定位失败,地址设为光谷",function(){
								local.search("光谷");
								$.fn.yunyeStorage.setHead("address", '');
							//});

						}
					}, {
						enableHighAccuracy: true
					})
				}
			}
		});
		$("#suggestId").val(_localAdress);
		local.search(_localAdress);
		$("#suggestId").on("change", function() {
			local.search($("#suggestId").val());
		});
		/*var ac = new BMap.Autocomplete(	//建立一个自动完成的对象
			{"input" : "suggestId"
			,"location" : baiduMap
		});
		ac.show();
		var local = new BMap.LocalSearch(baiduMap, { //智能搜索
			onSearchComplete: function(){
				if( pp = local.getResults().getPoi(0) ){
					var pp = local.getResults().getPoi(0).point;	//获取第一个智能搜索的结果
					baiduMap.centerAndZoom(pp, 14);
					baiduMap.addOverlay(new BMap.Marker(pp));	//添加标注
				}else{
					ac.setInputValue("");
					$("#suggestId").attr('placeholder','未搜索到您所填的位置');
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition(function(r){
						if(this.getStatus() == BMAP_STATUS_SUCCESS){
							var mk = new BMap.Marker(r.point);
							baiduMap.addOverlay(mk);
							baiduMap.centerAndZoom(r.point, 14);
						}else {
							local.search("光谷");
						}        
					},{enableHighAccuracy: true})
				}
			}
		});
		
		ac.setInputValue(_localAdress);
		local.search(_localAdress);
		baiduMap.enableScrollWheelZoom();
		ac.addEventListener("onconfirm", function(e) {	//鼠标点击下拉列表后的事件
			var _value = e.item.value;
			var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			baiduMap.clearOverlays();	//清除地图上所有覆盖物
			function myFun(){
				var pp = local.getResults().getPoi(0).point;	//获取第一个智能搜索的结果
				$.fn.yunyeStorage.setHead("address",myValue);
				baiduMap.centerAndZoom(pp, 14);
				baiduMap.addOverlay(new BMap.Marker(pp));	//添加标注
			}
			var local = new BMap.LocalSearch(baiduMap, { //智能搜索
				onSearchComplete: myFun
			});
			local.search(myValue);
		});*/
	}
});