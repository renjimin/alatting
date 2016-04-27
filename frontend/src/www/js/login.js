/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.loading [description]
 * @return {[type]}        [description]
 */
app.controller('loadCtrl', ['$scope', '$http', '$ionicPopup', '$state', 
	function($scope,$http,$ionicPopup, $state,$cookieStore) {
		var username ="1232";
		$scope.login = function(){
			var username = $scope.name;
			var password = $scope.password;
			if (username==undefined) {
				 var alertPopup = $ionicPopup.alert({
				       title: '用户名为空',
				       template: ''
				   });
				 return false;
			}
			if (password==undefined) {
				 var alertPopup = $ionicPopup.alert({
				       title: '密码为空',
				       template: ''
				   });
				 return false;				
			}			
			$http.post(API_CONFIG.root + '/api/v1/account/login', {
				"username": username,
				"password": password}
			).success(function(data){
				console.log(data);
				 var alertPopup = $ionicPopup.alert({
				       title: '登陆成功',
				       template: ''
				   });
				$state.go("homepages");
			}).error(function(data){
				 var alertPopup = $ionicPopup.alert({
				       title: '用户名或密码错误',
				       template: ''
				   });
			});
		};
		$scope.btnrember = function(){
			var username = $scope.name;
			var password = $scope.password;			
		    /*$cookieStore.put("username", "password");
		    var xx = $cookieStore.get("username");
		    console.info(xx);
		    alert(xx);*/
		    showStorage(username,password);			
		}
		$scope.register = function(){
			$state.go("regist");
		}
		$scope.forget = function(){
			$state.go("forget");
		}
	}

]);
/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.btncode [description]
 * @return {[type]}        [description]
 */
app.controller('regist', function($scope,$http,$ionicPopup,$state) {
	$scope.btncode = function(){
		var username = $scope.username;
		if (username==undefined) {
			var alertPopup = $ionicPopup.alert({
				title: '用户名为空',
				template: ''
			});
				return false;
		}
		//checkEmail(username);		
		$http.post(API_CONFIG.root +"/api/v1/account/send_message",{
			"username":username}
		).success(function(data){
			 var alertPopup = $ionicPopup.alert({
			       title: data.message,
			       template: ''
			   });
			 $savecode = data.message;
		}).error(function(data){
			console.log(data);
		})	
		alert(data.message);
	};	
	$scope.regist = function(){
		//window.location.href="login.html";
		var username = $scope.username;
		var password = $scope.firstpassword;
		var againpassword = $scope.secondpassword;
		var savecode = $scope.savecode;
		var code = $scope.writecode;
		if (username==undefined) {
			var alertPopup = $ionicPopup.alert({
				title: '用户名为空',
				template: ''
			});
				return false;
		}		
				if(savecode == undefined){
			var alertPopup = $ionicPopup.alert({
				title: '验证码为空',
				template: ''
			});
				return false;
		}				
		if (password==undefined) {
			var alertPopup = $ionicPopup.alert({
				title: '密码为空',
				template: ''
				});
				return false;				
			}			
		if (password != againpassword) {
			 var alertPopup = $ionicPopup.alert({
			       title: '两次输入的密码不一致',
			       template: ''
			   });
			 return false;
		}		
		$http.post(API_CONFIG.root +"/api/v1/account/register",{
			"username": username,
			"password": password}
		).success(function(data){
			console.log(data);
			 var alertPopup = $ionicPopup.alert({
			       title: '恭喜您,注册成功',
			       template: ''
			   });
			$state.go("login");
		}).error(function(data){
			console.log(data);
			 var alertPopup = $ionicPopup.alert({
			       title: '注册失败,请重新注册',
			       template: ''
			   });
		})
	}
		function checkEmail(str){
		    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		    var pre = /^1\d{10}$/;
		    if(!re.test(str) && pre.test(str)){
			var alertPopup = $ionicPopup.alert({
				title: '用户名格式错误,必须是手机号或邮箱号',
				template: ''
			});
				return false;
		    }
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
		$state.go("forget-password");
	}
});
/**
 * [description]
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.btnsendsure [description]
 * @return {[type]}        [description]
 */
app.controller('forgetpassword', function($scope,$http,$ionicPopup,$state) {

	$scope.btnpsure = function(){
		/*验证验证码是否填写正确*/
		$http.post("",data).success(function(data){
			/*验证通过处理*/
			$state.go("forgetpwd");			
		}).error(function(data){
			/*验证失败处理*/
			 var alertPopup = $ionicPopup.alert({
			       title: '验证码填写错误.请重新填写验证码',
			       template: ''
			   });			
		})
	};
	$scope.btncode = function(){
		var username = $scope.usernameforget;
		$http.post(API_CONFIG.root +"/api/v1/account/send_message",{
			"username":username}
		).success(function(data){
			 var alertPopup = $ionicPopup.alert({
			       title: data.message,
			       template: ''
			   });
			 $savecode = data.message;
		}).error(function(data){
			console.log(data);
		})		
	} 
});
app.controller('testcode', function($scope,$http) {
	$scope.btnsendsure = function(){
		//var code = $scope.sendcode-code;
		$http.post(API_CONFIG.root + "/api/v1/account/send_message",{
			"username":username}
		).success(function(data){
			
		}).error(function(data){
			console.log(data);
		})			
		$state.go("sendcode");
	}
});