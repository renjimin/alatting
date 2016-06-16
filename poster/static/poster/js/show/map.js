$(function(){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=C5LOoqZmix3NyQn11w5z8IEzh1M57Rry&callback=init";
	document.body.appendChild(script);

	window.init = function() {
		window.baiduMap = new BMap.Map("allmap");		// 创建Map实例
		baiduMap.addControl(new BMap.NavigationControl());
		baiduMap.addControl(new BMap.OverviewMapControl());
		baiduMap.addControl(new BMap.ScaleControl());
		var _localAdress = yunyeEditorGlobal.address;

		var local = new BMap.LocalSearch(baiduMap, { //智能搜索
			onSearchComplete: function(){
				if( !local.getResults() )return;
				if( local.getResults().getPoi(0) ){
					var pp = local.getResults().getPoi(0).point;	//获取第一个智能搜索的结果
					window.zoomMap = function(){
						baiduMap.centerAndZoom(pp, 14);
					};
					baiduMap.centerAndZoom(pp, 14);
					baiduMap.addOverlay(new BMap.Marker(pp));	//添加标注
					window.addressCorrect = true;
				}else{
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition(function(r){
						if(this.getStatus() == BMAP_STATUS_SUCCESS){
							var mk = new BMap.Marker(r.point);
							baiduMap.addOverlay(mk);
							baiduMap.centerAndZoom(r.point, 14);
							window.zoomMap = function(){
								baiduMap.centerAndZoom(r.point, 14);
							};
						}else {
							local.search("光谷");
						}
					},{enableHighAccuracy: true});
				}
			}
		});
		local.search(_localAdress);
		baiduMap.enableScrollWheelZoom();
	} ;
});
