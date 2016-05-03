/**
 * 登陆 
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.loading [description]
 * @return {[type]}        [description]
 */
app.controller('loadCtrl', ['$scope', '$http', '$ionicPopup', '$state', 
	function($scope,$http,$ionicPopup, $state,$cookies) {
		$scope.isSelected = true;
		$scope.username = localStorage.getItem("username");	
		$scope.password = localStorage.getItem("password");
		$scope.login = function(){
			var username = $scope.username;
			var password = $scope.password;
			if (!username) {
				 $ionicPopup.alert({
			       title: '用户名为空',
			       template: ''
				   });
				 return false;
			}
			if (!password) {
				$ionicPopup.alert({
			    	title: '密码为空',
			       	template: ''
				});
					return false;				
			}
			if ($scope.isSelected) {
				if (username!=null && password !=null) {
					localStorage.setItem("username",username);
					localStorage.setItem("password",password);
				}				
			}else{
				localStorage.clear();
			}		
			$http.post(API_CONFIG.root + '/api/v1/account/login', {
				"username": username,
				"password": password
			}
			).success(function(data){
				$state.go("homepages");
				
			}).error(function(data){
				$ionicPopup.alert({
				    title: '用户名或密码错误',
				    template: ''
				});
			});
		};
		$scope.btnrember = function(){
			if ($scope.isSelected) {
				localStorage.clear();
				var username = $scope.username;
				var password = $scope.password;
				if (username!=null && password !=null) {
					localStorage.setItem("username",username);
					localStorage.setItem("password",password);
				}
			}else{
				localStorage.clear();
			};
		}
		$scope.register = function(){
			$state.go("regist");
		}
		$scope.forgetpsd = function(){
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
app.controller('regist', function ($scope, $http, $ionicPopup, $state, $interval) {
    $scope.paracont = "获取验证码";
    $scope.paraclass = "but_null";
    $scope.paraevent = true;
    var EMAIL_REGEXP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var PHONE_REGEXP = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
    var passCode = true;
    var registCode = '';
    $scope.isShow = true;
    $scope.btncode = function () {
        var username = $scope.username;
        var passUser = '';
        if (!username) {
            $ionicPopup.alert({
                title: '用户名为空',
                template: ''
            });
            return false;
        }
        if (!PHONE_REGEXP.test(username) && !EMAIL_REGEXP.test(username)) {
            $ionicPopup.alert({
                title: '手机号码或邮箱号格式不对',
                template: ''
            });
            return false;
        }
        if (passCode) {
        	$scope.isclick = true;	
            passCode = false;
            $scope.isShow = false;
            $scope.ishide = true;
            $http.post(API_CONFIG.root + "/api/v1/account/send_message", {"username": username}).success(function (data) {
                if (PHONE_REGEXP.test(username)) {
                    $ionicPopup.alert({
                        title: data.message,
                        template: ''
                    });
                }
            }).error(function (data) {
                console.log(data);
            });

            var second = 60;
            var timePromise = $interval(function () {
                if (second <= 0) {
                    $interval.cancel(timePromise);
                    timePromise = null;
                    $scope.paracont = "重发验证码";
                    $scope.paraclass = "but_null";
                    $scope.paraevent = true;

                    passCode = true;
                    $scope.isShow = true;
                    $scope.ishide = false;
                    $interval.cancel(timePromise);
                } else {
                    second--;
                    $scope.paracont = "获取验证码" + "(" + second + ")";
                    $scope.paraclass = "not but_null";

                }
            }, 1000, 100);
        }
    };
    $scope.regist = function () {
        var username = $scope.username;
        var password = $scope.firstpassword;
        var againpassword = $scope.secondpassword;
        var code = $scope.savecode;
        if (!username) {
            $ionicPopup.alert({
                title: '请输入用户名',
                template: ''
            });
            return false;
        }
        if (!code) {
            $ionicPopup.alert({
                title: '请输入验证码',
                template: ''
            });
            return false;
        }
        if (!password) {
            $ionicPopup.alert({
                title: '请输入密码',
                template: ''
            });
            return false;
        }
        if (!againpassword) {
            $ionicPopup.alert({
                title: '请再次输入密码',
                template: ''
            });
            return false;
        }
        if (password != againpassword) {
            $ionicPopup.alert({
                title: '两次输入的密码不一致',
                template: ''
            });
            return false;
        }
        $http.post(API_CONFIG.root + "/api/v1/account/register", {
            "username": username,
            "password1": password,
            "password2": againpassword,
            "message": code
            }
        ).success(function (data) {
            console.log(data);
            $ionicPopup.alert({
                title: data.detail,
                template: ''
            });
        $state.go("login");
        }).error(function (data) {
            console.log(data);
            var alertPopup = $ionicPopup.alert({
                title: data.detail,
                template: ''
            });
        });
    };
});
/**
 * 忘记密码填写验证码
 * @param  {[type]} $scope [description]
 * @param  {[type]} $http) {	$scope.btnsendsure [description]
 * @return {[type]}        [description]
 */
app.controller('forgetpassword', function($scope,$http,$ionicPopup,$state,$interval) {
	var username = '';
	$scope.isshow= true;
    var EMAIL_REGEXP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var PHONE_REGEXP = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;	
	$scope.paracont = "获取验证码";
    $scope.paraclass = "but_null";
    $scope.paraevent = true;	
    var passCode = true;
    $scope.isShow = true;
	$scope.btncode = function(){
		username = $scope.usernameforget;
		if (!username) {
			$ionicPopup.alert({
			    title: '用户名为空',
			});
			   return false;	
		};
        if (!PHONE_REGEXP.test(username) && !EMAIL_REGEXP.test(username)) {
            $ionicPopup.alert({
                title: '手机号码或邮箱号格式不对',
                template: ''
            });
            return false;
        }		
		if (passCode) {
			passCode = false;
			$scope.isclick = true;	
			$scope.isShow = false;
			$scope.ishide = true;
			$http.post(API_CONFIG.root +"/api/v1/account/send_message",{"username":username}).success(function(data){
                if (PHONE_REGEXP.test(username)) {
                    $ionicPopup.alert({
                        title: data.message,
                        template: ''
                    });
                }
			}).error(function(data){
				console.log(data);
			})

	       	var second = 60;
			var timePromise = $interval(function(){
			  	if(second<=0){
				    $interval.cancel(timePromise);
				    timePromise = null;
				    $scope.paracont = "重发验证码";
				    $scope.paraclass = "but_null";
				    $scope.paraevent = true;

				    passCode = true;
				    $scope.isShow = true;
					$scope.ishide = false;
					$interval.cancel(timePromise);
			  	}else{
			  		second--;
				    $scope.paracont = "获取验证码"+"("+second+")";
				    $scope.paraclass = "not but_null";
				    
			  	}
			},1000,100);	


		};			
	}
	$scope.btnpsure = function(){
		username = $scope.usernameforget;
		var writecode = $scope.code;
		if (!username) {
			$ionicPopup.alert({
			       title: '用户名为空',
			       template: ''
			});
			   return false;				
		}
		if (!writecode) {
			$ionicPopup.alert({
			       title: '请输入验证码',
			       template: ''
			});
			   return false;	
		};
		$http.post(API_CONFIG.root + "/api/v1/account/auth_message",{
			"username":username,
			"message":writecode}
			).success(function(){
				/*验证成功跳转*/
				$state.go("forgetpwd",{data: username});
			}).error(function(){
				/*验证失败*/
			 $ionicPopup.alert({
			       title: '账号与验证码不匹配',
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
		if (!password&&!secondpassword ) {
			$ionicPopup.alert({
		       title: '输入密码为空',
		       template: ''
			   });
			 return false;			
		};
		if (password !=secondpassword) {
			 $ionicPopup.alert({
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
			 $ionicPopup.alert({
		       title: '重置密码成功',
		       template: ''
		   }).then(function(){
				$state.go("login");	
		   });
		
		}).error(function(data){
			 $ionicPopup.alert({
		       title: data.detail,
		       template: ''
		   });	
		})			
	}
});
