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

//csrf for angular
app.config(function ($httpProvider) {
    $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
    $httpProvider.defaults.xsrfCookieName = "csrftoken";
});

/*app.config(function($routeProvider, $locationProvider) {
 $routeProvider.when('/', {
 templateUrl: "signIn.html"
 });
 });*/

app.controller('commentsController', ['$scope', '$http', function ($scope, $http) {
    var next = null
    var baseURL = null
    $scope.createDisabled = false
    $scope.comments = []

    $scope.init = function(url){
        baseURL = next = url
        $scope.loadMore()
    }

    $scope.initComment = function(comment){
        if(comment.creator.id == auth_user_id) {
            comment._edit = 'editable'
        }
        else{
            comment._edit = 'none'
        }
    }

    $scope.loadMore = function () {
        if (!next) return
        $http.get(next).then(function (response) {
            next = response.data.next
            $.each(response.data.results, function(i, comment) {
                $scope.initComment(comment)
            })
            $.merge($scope.comments, response.data.results)
        }, function (response) {
            if (response.status === 404) {
                next = null
            }
        });
    }

    $scope.create = function(){
        $scope.createDisabled = true
        $http.post(baseURL, data={title: $scope.title, content: $scope.content})
            .then(function(response){
                $scope.initComment(response.data)
                $scope.comments.splice(0, 0, response.data)
                $scope.title = $scope.content = ''
                $scope.createDisabled = false
            }, function(response){
                if (response.status === 401 || response.status === 403) {
                    window.location.href = loginURL
                }
                $scope.createDisabled = false
            });
    }

    $scope.startEdit = function(comment){
        comment._edit = 'editing'
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