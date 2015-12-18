app.directive('postInit', [ '$timeout', function($timeout) {
    var def = {
        restrict : 'A',
        link : function(scope, element, attrs) {
            $timeout(function(){
                scope.$eval(attrs.postInit)
            }, 0);
        }
    };
    return def;
}])


app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
    $scope.videojs = videojs
    $scope.object = null
    $scope.getData = function (object) {
        $http.get(object.data).then(function (response) {
            object.root = response.data
            PosterRender.process(object)
            $scope.object = object
        }, function (response) {
        });
    }
    $scope.retrievePoster = function () {
        $http.get(posterURL).then(function (response) {
            $scope.getData(response.data)
        }, function (response) {
        });
    }
    $scope.retrievePoster()
    //templates
    $scope.listTemplates = function(){
        $http.get(templateListURL).then(function (response) {
            $scope.templates = response.data
        }, function (response) {
        });
    }
    $scope.listTemplates()

    $scope.retrieveTemplate = function(id, callback){
        $http.get(templateListURL + id).then(function (response) {
            if(callback){
                callback(true, response.data)
            }
        }, function (response) {
            if(callback){
                callback(false, response.data)
            }
        });
    }

    $scope.selectedTemplate = {id: ''}
    $scope.onSelectedTemplate = function(){
        if($scope.selectedTemplate.id){
            $scope.retrieveTemplate($scope.selectedTemplate.id, function(success, template){
                if(success) {
                    $scope.object.poster_pages[0].template = template
                    PosterRender.process($scope.object)
                }
            })
        }
    }
}]);

$(document).ready(function () {
    $('.editable-text').on('focus', function () {
        before = $(this).html();
    }).on('blur', function () {
        if (before != $(this).html()) {
            $(this).trigger('change');
        }
    });

    $('.editable-text').on('change', function () {
        alert($(this).attr('target') + ' changed! ');
    });
});
