$(function(){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=C5LOoqZmix3NyQn11w5z8IEzh1M57Rry&callback=init";
	document.body.appendChild(script);

	window.init = function() {
		window.baiduMap = new BMap.Map("allmap");		// 创建Map实例

		var _localAdress = yunyeEditorGlobal.address;
		var ac = new BMap.Autocomplete(	//建立一个自动完成的对象
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
		});
	} 
});
