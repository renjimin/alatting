/**
 * 登陆
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.loading [description]
 * @return {[type]}        [description]
 */
app.controller('loadCtrl', ['$scope', '$http', '$ionicPopup', '$state', 
	function($scope,$http,$ionicPopup, $state,$cookies) {
		$scope.username = localStorage.getItem("username");
		$scope.password = localStorage.getItem("password");
		if ($scope.username ==undefined) {
			$scope.isSelected = false;
		}else{
			$scope.isSelected = true;
		}
		$scope.login = function(){
			var username = $scope.username;
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
			if ($scope.isSelected == true) {
				localStorage.clear();
				var username = $scope.username;
				var password = $scope.password;
				localStorage.setItem("username",username);
				localStorage.setItem("password",password);
			}else{
				localStorage.clear();
			};
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
 * 注册
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
		var username = $scope.username;
		var password = $scope.firstpassword;
		var againpassword = $scope.secondpassword;
		var savecode = $scope.savecode;
		var code = $scope.savecode;
		alert(username+""+password+""+againpassword+""+savecode);
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
			"password1": password,
			"password2":againpassword,
			"message":code}
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
 * 忘记密码填写验证码
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.btnsendsure [description]
 * @return {[type]}        [description]
 */
app.controller('forgetpassword', function($scope,$http,$ionicPopup,$state) {
	var code = '';
	var username = '';
	$scope.btncode = function(){
		username = $scope.usernameforget;
		$http.post(API_CONFIG.root +"/api/v1/account/send_message",{
			"username":username}
		).success(function(data){
			 var alertPopup = $ionicPopup.alert({
			       title: data.message,
			       template: ''
			   });
			 code = data.message;
			 console.log(data);
		}).error(function(data){
			console.log(data);
		})		
	}
	$scope.btnpsure = function(){
		username = $scope.usernameforget;
		var writecode = $scope.code;
		if (username == undefined) {
			 var alertPopup = $ionicPopup.alert({
			       title: '用户名为空',
			       template: ''
			   });
			   return false;				
		};
		if (writecode!=code) {
			 var alertPopup = $ionicPopup.alert({
			       title: '验证码填写错误.请重新填写验证码',
			       template: ''
			   });
			   return false;				
		}
		$http.post(API_CONFIG.root + "/api/v1/account/auth_message",{
			"username":username,
			"message":code}
			).success(function(){
				/*验证成功跳转*/
				$state.go("forgetpwd",{data: username});
			}).error(function(){
				/*验证失败*/
			 var alertPopup = $ionicPopup.alert({
			       title: '验证码填写错误.请重新填写验证码',
			       template: ''
			   });	
			})
	} 
});
/**
 * 重置密码
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $http        [description]
 * @param  {[type]} $ionicPopup) {	$scope.btnresetpwd [description]
 * @return {[type]}              [description]
 */
app.controller('sendcode', function($scope,$http,$ionicPopup,$state,$stateParams) {
	$scope.btnresetpwd = function(){
		var username = $stateParams.data;
		var password = $scope.newpsw;
		var secondpassword = $scope.secondpsw;
		//var username  =$scope.username;
		if (password !=secondpassword) {
			 var alertPopup = $ionicPopup.alert({
			       title: '两次输入的密码不一致',
			       template: ''
			   });
			 return false;
		}
		$http.post(API_CONFIG.root + "/api/v1/account/reset_password",{
			"username":username,
			"password1":password,
			"password2":secondpassword}
		).success(function(data){
			 var alertPopup = $ionicPopup.alert({
			       title: '重置密码成功',
			       template: ''
			   });
			$state.go("login");			
		}).error(function(data){
			 var alertPopup = $ionicPopup.alert({
			       title: '重置密码失败',
			       template: ''
			   });	
		})			
	}
});