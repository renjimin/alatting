app.controller( 'homeCtl',function($scope,$http){

    $http.get(API_CONFIG.root + '/api/v1/poster/posters/simple').success(function(data){
        console.log(data);
        $scope.posters = data;
        document.querySelector('.empty-info').style.display="none";
        /*$window.location.href = 'regist.html'	*/
    }).error(function(data){
        document.querySelector('.empty-info').style.display="block";
    });

    $scope.showTypeSel = function(){
        var model = document.querySelector('#type-model');
        model.classList.toggle("open");

    }




})
