/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.loading [description]
 * @return {[type]}        [description]
 */
app.controller('loadCtrl', function($scope,$http) {
	$scope.login = function(){
		var username = $scope.name;
		var password = $scope.password;
		$http.post(API_CONFIG.root + '/api/v1/account/login', {
			"username": username,
			"password": password}
		).success(function(data){
			console.log(data);
			alert("登陆成功");
			/*$window.location.href = 'regist.html'	*/
		}).error(function(data){
			alert("登陆失败");	
		});
	};
	$scope.register = function(){
		window.location.href="#/regist";
	}
	$scope.forget = function(){
		window.location.href="#/forget-password";
	}
});
/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.btncode [description]
 * @return {[type]}        [description]
 */
app.controller('regist', function($scope,$http) {
	$scope.btncode = function(){
		alert(123)
		var username = $scope.username;
		alert(username);
		$http.post("http://192.168.14.128:8080/api/v1/account/send_message",{
			"username":username}
		).success(function(data){
			console.log(data);
		}).error(function(data){
			console.log(data);
		})	
	};	
	$scope.regist = function(){
		//window.location.href="login.html";
		var username = $scope.username;
		var password = $scope.firstpassword;
		var againpassword = $scope.secondpassword;
		var code = $scope.code;
		if (password != againpassword) {
			alert("两次输入的密码不一致");
		}
		$http.post("http://192.168.14.128:8080/api/v1/account/register",{
			"username": username,
			"password": password}
		).success(function(data){
			console.log(data);
			/**成功处理*/
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
	$scope.btnfsure = function(){
		var phonenumber = $scope.phonenumber;
		$http.post('http://192.168.14.128:8080/api/v1/account/send_message', {
			"phonenumber": phonenumber}
		).success(function(data){
			console.log(data);
			alert("发送成功");
			window.location.href="#/forget";
			/*$window.location.href = 'regist.html'	*/
		}).error(function(data){
			alert("发送失败");	
		});
	}
});