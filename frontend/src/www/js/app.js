// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('starter', ['ionic']);
app.config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider){
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
	.state('forgetpwd', {
          url: "/forgetpwd",
          templateUrl: "templates/account/forget-password.html",
          params:{'data':null}
    })
	.state('sendcode', {
          url: "/sendcode",
          templateUrl: "templates/account/sendcode.html"
    })
	.state('homepages',{
		url:"/homepage",
		templateUrl:"templates/account/home-page.html"
	})
	.state('homepages.home',{
		url:"/home",
		views:{
			'home-page':{
				templateUrl:"templates/account/home.html"
			}
		}
	})
	.state('homepages.search',{
		url:"/search",
		views:{
			'search-page':{
				templateUrl:"templates/account/search.html"
			}
		}
	})
	.state('homepages.type',{
		url:"/type",
		views:{
			'type-page':{
				templateUrl:"templates/account/type-list.html"
			}
		}
	})
	.state('homepages.account',{
		url:"/account",
		views:{
			'account-page':{
				templateUrl:"templates/account/account.html"
			}
		}
	})
	.state('homepages.account.profile',{
		url:"/profile",
		views:{
			'account-page-profile':{
				templateUrl:"templates/account/account-profile.html"
			}
		}
	})
	.state('homepages.account.addfriends',{
		url:"/addfriends",
		views:{
			'account-page-addfriends':{
				templateUrl:"templates/account/account-addfriends.html"
			}
		}
	})
	.state('homepages.account.friendslist',{
		url:"/friendslist",
		views:{
			'account-page-friendslist':{
				templateUrl:"templates/account/account-friendslist.html"
			}
		}
	})

	.state('basicinfo',{
		url:"/basicinfo",
		templateUrl:"templates/account/basic-info.html",
		params:{'data':null}
	})
	.state('templateselect',{
		url:"/templateselect",
		templateUrl:"templates/account/template-select.html",
		params:{'data':null}
	})
	.state('poster',{
		url:"/poster",
		templateUrl:"templates/poster/poster.html",
		params:{'data':null}

	})
	.state('posteredit',{
		url:"/posteredit",
		templateUrl:"templates/poster/poster-edit.html",
		params:{'data':null}

	})
	.state('api',{
		url:"/api",
		templateUrl:"templates/api.html"

	})
	$urlRouterProvider.otherwise("/login");
	$ionicConfigProvider.platform.android.tabs.style('standard');
	$ionicConfigProvider.platform.android.tabs.position('bottom');
  	$ionicConfigProvider.platform.android.navBar.alignTitle('center');
	$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-ios-arrow-back');
	$ionicConfigProvider.platform.android.views.transition('ios');
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
