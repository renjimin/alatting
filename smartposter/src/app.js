var app = angular.module('smartPosterApp', ['ionic']);

/* common */
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: "/home",
        templateUrl: "apps/common/home.html"
    })
    .state('home.homepage', {
        url: "/homepage",
        views:{
            'home-page':{
                templateUrl: "apps/common/homepage.html"
            }
        }
        
    })
    .state('home.create', {
        url: "/category",
        views:{
            'create-page':{
                templateUrl: "apps/poster/category/category.html"
            }
        }
        
    })
    .state('home.account', {
        url: "/account",
        views:{
            'account-page':{
                templateUrl: "apps/account/usercenter.html"
            }
        }
        
    })
    .state('list', {
        url: "/list",
        templateUrl: "apps/common/list.html"
    })
});
/* poster */
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('keywords', {
        url: "/poster/keywords",
        templateUrl: "apps/poster/keywords/keywords.html"
    })
    .state('basicinfo', {
        url: "/poster/basicinfo",
        templateUrl: "apps/poster/basicinfo/basicinfo.html"
    })
    .state('posteredit', {
        url: "/poster/edit",
        templateUrl: "apps/poster/edit/edit.html"
    })
    .state('postershow', {
        url: "/poster/show",
        templateUrl: "apps/poster/show/show.html"
    })


});
/* account */
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('usercenter', {
        url: "/account/usercenter",
        templateUrl: "apps/account/ucenter/ucenter.html"
    })
    .state('userInfo', {
        url: "/account/usercenter/userInfo",
        templateUrl: "apps/account/ucenter/userInfo.html"
    })
    .state('server', {
        url: "/account/usercenter/server",
        templateUrl: "apps/account/ucenter/server.html"
    })
    .state('consumer', {
        url: "/account/usercenter/consumer",
        templateUrl: "apps/account/ucenter/consumer.html"
    })
    .state('myFavorite',{
        url: "/account/usercenter/myFavorite",
        templateUrl: "apps/account/ucenter/myFavorite.html"
    })
    .state('feedback',{
        url: "/account/usercenter/feedback",
        templateUrl: "apps/account/ucenter/feedback.html"
    })
    .state('editName',{
        url: "/account/usercenter/editName",
        templateUrl: "apps/account/ucenter/editName.html"
    })
    .state('userSet',{
        url: "/account/usercenter/userSet",
        templateUrl: "apps/account/ucenter/userSet.html"
    })
    .state('helpCenter',{
        url: "/account/usercenter/helpCenter",
        templateUrl: "apps/account/ucenter/helpCenter.html"
    })
    .state('aboutUs',{
        url: "/account/usercenter/aboutUs",
        templateUrl: "apps/account/ucenter/aboutUs.html"
    })
    .state('login',{
        url: "/login",
        templateUrl: "apps/account/login/login.html"
    })
    .state('regist',{
        url: "/regist",
        templateUrl: "apps/account/regist.html"
    });
    $urlRouterProvider.otherwise("/api");
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('api', {
        url: "/api",
        templateUrl: "apps/api.html"
    })
    $urlRouterProvider.otherwise("/api");
});

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});


