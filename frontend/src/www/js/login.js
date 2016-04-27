/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.loading [description]
 * @return {[type]}        [description]
 */
var username = "111";
app.controller('loadCtrl', ['$scope', '$http', '$ionicPopup', '$state', 
	function($scope,$http,$ionicPopup, $state) {
		$scope.login = function(){
			var username = $scope.name;
			var password = $scope.password;
			$http.post(API_CONFIG.root + '/api/v1/account/login', {
				"username": username,
				"password": password}
			).success(function(data){
				console.log(data);
				 var alertPopup = $ionicPopup.alert({
				       title: '登陆成功',
				       template: ''
				   });
				$state.go("home");
			}).error(function(data){
				 var alertPopup = $ionicPopup.alert({
				       title: '登陆失败',
				       template: ''
				   });
			});
		};
		$scope.register = function(){
			window.location.href="#/regist";
		}
		$scope.forget = function(){
			window.location.href="#/forget-password";
		}
	}
]);
/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.btncode [description]
 * @return {[type]}        [description]
 */
app.controller('regist', function($scope,$http,$ionicPopup) {
	$scope.btncode = function(){
		var username = $scope.username;
		$http.post(API_CONFIG.root +"/api/v1/account/send_message",{
			"phonenumber":username}
		).success(function(data){
			 var alertPopup = $ionicPopup.alert({
			       title: data.message,
			       template: ''
			   });
		}).error(function(data){
			console.log(data);
		})	
	};	
	$scope.regist = function(){
		//window.location.href="login.html";
		var username = $scope.username;
		var password = $scope.firstpassword;
		var againpassword = $scope.secondpassword;
		var code = $scope.writecode;
		if (password != againpassword) {
			 var alertPopup = $ionicPopup.alert({
			       title: '两次输入的密码不一致',
			       template: ''
			   });
		}
		/*$http.post(API_CONFIG.root + "/api/v1/account/send_message",{
			"phonenumber":username}
		).success(function(data){
			if (code != data.message) {
			 var alertPopup = $ionicPopup.alert({
			       title: '验证码输入错误',
			       template: ''
			   });
			 return false;
			}
		}).error(function(data){
			//console.log(data);
		})*/		
		$http.post(API_CONFIG.root +"/api/v1/account/register",{
			"username": username,
			"password": password}
		).success(function(data){
			console.log(data);
			 var alertPopup = $ionicPopup.alert({
			       title: '恭喜您,注册成功',
			       template: ''
			   });
			window.location.href="#/login";
		}).error(function(data){
			console.log(data);
			/**失败处理*/
		})
	}
});
/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.btnfsure [description]
 * @return {[type]}        [description]
 */
app.controller('forget', function($scope,$http) {
	$scope.btnsendsure = function(){
		var username ="13215641456";
		$http.post(API_CONFIG.root + "/api/v1/account/send_message",{
			"phonenumber":username}
		).success(function(data){
			console.log(data);
		}).error(function(data){
			console.log(data);
		})			
		window.location.href="#/forget-password"
	}
});
/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.btnsendsure [description]
 * @return {[type]}        [description]
 */
app.controller('forgetpassword', function($scope,$http) {
	$scope.btnsendsure = function(){
		window.location.href="#/sendcode"
	}
});
app.controller('testcode', function($scope,$http) {
	$scope.btnsendsure = function(){
		var code = $scope.sendcode-code;
		$http.post(API_CONFIG.root + "/api/v1/account/send_message",{
			"phonenumber":username}
		).success(function(data){
			
		}).error(function(data){
			console.log(data);
		})			
		window.location.href="#/sendcode"
	}
});