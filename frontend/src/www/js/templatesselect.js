app.controller( 'templateCtl',function($scope,$ionicPopup,$http,$timeout,$state,$stateParams){
    /**获取模版列表*/
    $scope.templates = {};
    $scope.isTemplatesEmpty = false;
    $http.get(API_CONFIG.root + '/api/v1/poster/templates').success(function(data){
        $scope.templates = data;
        $timeout(function(){document.querySelector('.templates-view').classList.add('active')},50);
    }).error(function(data){
        console.log(data);
        $scope.isPostersEmpty = true;
    });


    $scope.poster={};
    $scope.saveTemplate=function(templateId){
        var poster = $stateParams.data;

        //  confirm 对话框
        $ionicPopup.confirm({
            'title': '',
            'template': '确定并创建海报吗?',
            'okType':'button-light',
            'cancelText':'取消',
            'okText':'确认'
        }).then(function(res) {
            if(res) {
                $http.post(API_CONFIG.root + '/api/v1/poster/posterpages',{'poster_id':poster.id,'template_id':templateId}).success(function(data){
                    $ionicPopup.alert({
                        'title':'',
                        'template':'信息提交成功',
                        'okType':'button-light'
                    }).then(function(){
                        $state.go('poster',{'data':$scope.poster});
                    });


                }).error(function(data){
                    console.log(data);
                    $ionicPopup.alert({
                        'title':'',
                        'template':'信息有误，请稍后重试',
                        'okType':'button-light'
                    });

                });
            } else {
                console.log('You are not sure');
            }
        });

    }

})
