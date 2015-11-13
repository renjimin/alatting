/**
 * Created by tianhuyang on 9/29/15.
 */
var app = angular.module('PosterApp', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui"
]);

/*app.config(function($routeProvider, $locationProvider) {
 $routeProvider.when('/', {
 templateUrl: "signIn.html"
 });
 });*/

app.controller('commentsController', ['$scope', '$http', function ($scope, $http) {
    var next = null
    $scope.comments = []

    $scope.init = function(url){
        next = url
        $scope.loadMore()
    }

    $scope.loadMore = function () {
        if (!next) return
        $http.get(next).then(function (response) {
            next = response.data.next
            $.merge($scope.comments, response.data.results)
        }, function (response) {
            if (response.status === 404) {
                next = null
            }
        });
    }


}]);