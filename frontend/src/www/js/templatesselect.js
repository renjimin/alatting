app.controller( 'templateCtl',function($scope,$timeout,$ionicPopup){
    $timeout(function(){document.querySelector('.templates-view').classList.add('active')},50);

    $scope.saveTemplate=function(){
        $ionicPopup.alert({
            'title':'',
            'template':'保存成功',
            'okType':'light'
        });
    }

})
