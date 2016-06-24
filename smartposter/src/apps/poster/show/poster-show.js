app.controller( 'posterShowCtrl',function($scope,$http,$ionicPopup,$state,$stateParams,$ionicLoading,$timeout){
	var con = document.querySelector('#poster-show-iframe');
	con.src = "http://192.168.118.130:8000/mobile/posters/30/";
	// $http.get("http://192.168.118.130:8000/mobile/posters/30/")
 //    .success(function(response) {
 //    	con.innerHTML = response;
 //    });
})