// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])
app.config(function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('login', {
          url: "/login",
          templateUrl: "templates/account/login.html"
    })	
	.state('regist', {
          url: "/regist",
          templateUrl: "templates/account/regist.html"
    })
	.state('forget', {
          url: "/forget",
          templateUrl: "templates/account/forget.html"
    })	
	.state('home',{
		url:"/home",
		templateUrl:"templates/account/home.html"
	})
	.state('basicinfo',{
		url:"/basicinfo",
		templateUrl:"templates/account/basic-info.html"
	})
	.state('templateselect',{
		url:"/templateselect",
		templateUrl:"templates/account/template-select.html"
	})
	.state('api',{
		url:"/api",		
		templateUrl:"templates/api.html"
			
	})
	$urlRouterProvider.otherwise("/api");
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
	
})
