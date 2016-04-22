var app = angular.module('ionicApp', ['ionic']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('signin', {
		url: '/sign-in',
		templateUrl: 'templates/sign-in.html',
		controller: 'SignInCtrl'
	})
	.state('forgotpassword', {
		url: '/forgot-password',
		templateUrl: 'templates/forgot-password.html'
	});

	   $urlRouterProvider.otherwise('/sign-in');

})

.controller('SignInCtrl', function($scope, $state, $ionicPopup,$http) {

	$scope.signIn = function(user) {
		console.log('Sign-In', user);
		var params = {'username':user.username,'password':user.password};
		$http.post('http://192.168.1.114:8020/api/v1/account/login',params).success(function(datas){

				console.log(datas+"login success");
				alert('login success');
		}).error(function(){
			alert('login failed');
		});


		//$state.go('forgotpassword');

	};

})

