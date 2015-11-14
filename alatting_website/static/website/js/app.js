/**
 * Created by tianhuyang on 9/29/15.
 */

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            var csrftoken = Cookies.get('csrftoken')
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

//app
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

app.controller('ratingsController', ['$scope', '$http', function ($scope, $http) {
    $scope.ratingRate = function () {
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