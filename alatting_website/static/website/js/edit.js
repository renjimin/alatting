app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
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
}]);
