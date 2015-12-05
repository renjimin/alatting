/**
 * Created by ubuntu on 11/3/15.
 */

app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
    $scope.templates = []
    $scope.listTemplates = function () {
        $http.get(templatesURL).then(function (response) {
            $scope.templates = response.data
        }, function (response) {
        });
    }
    $scope.listTemplates()
}]);
