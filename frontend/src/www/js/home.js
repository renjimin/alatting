app.controller( 'homeCtl',function($scope,$timeout){

    $scope.showTypeSel = function(){
        var model = document.querySelector('#type-model');
        model.classList.toggle("open");
        
    }




})
