var app = angular.module('smartPosterApp', ['ionic']);

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

app.config(function($stateProvider, $urlRouterProvider) {
  //$stateProvider
  //  .state('poster', {
  //  url: '/poster',
  //  abstract: true,
  //  templateUrl: 'apps/poster/index.html'
  //});

  //.state('poster.keyword', {
  //  url: '/keyword',
  //  views: {
  //    'poster-keyword': {
  //      templateUrl: 'apps/poster/keyword/keyword.html'
  //    }
  //  }
  //});

  //$urlRouterProvider.otherwise('/tab/dash');

});
