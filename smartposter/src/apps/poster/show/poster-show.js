app.controller( 'posterShowCtrl',function($scope,$http,$ionicPopup,$state,$stateParams,$ionicLoading,$timeout){
	var con = document.querySelector('.poster-show-container');
	$http.get("http://yunye123.com:8000/mobile/posters/270/")
    .success(function(response) {
    	con.innerHTML = response;
    });
})