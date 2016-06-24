/**
 * Created by zhangjie on 2016/6/24.
 */

/* userInfo */
app.controller('UserInfoController',['$scope','$ionicActionSheet',function($scope,$ionicActionSheet){
    $scope.uinfo= {
        'username':'user',
        'avator':'http://www.runoob.com/try/demo_source/venkman.jpg',
        'regname':'user@ad.com',
    }
    $scope.updataHeadIcon = function(){
         $ionicActionSheet.show({
            buttons: [
              { text: '拍摄图片' },
              { text: '选择图片' }
            ],
            cancelText: '取消',
            buttonClicked: function(index) {
              return true;
            }
        });
    }
}]);

/* editName */
app.controller('EditNameController',function($scope){
    $scope.username = 'user';
    $scope.submitName = function(){
        var uname = $scope.username;
        alert(uname);

    }
    $scope.$clearName = function(){
        $scope.username = '';

    }


});
