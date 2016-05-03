/**
 * Created by zhanjie on 2016/4/27.
 */
app.controller('accountCtrl',['$scope','$http','$ionicPopup','$state',
    function($scope,$http,$ionicPopup,$state){
        /*---------页面数据初始化-----------*/
        /*获取用户信息*/
        $scope.userinfo = {}
        $scope.tarr = []

        $http.get(API_CONFIG.root+'/api/v1/account/profile')
            .success(function(reps){
                if(reps.length>0) {
                    /*userinfo*/
                    $scope.userinfo = reps[0];
                    if(reps[0].person==null) {
                        $scope.userinfo.avatar = '../www/img/headicon.jpeg';
                    } else {
                        $scope.userinfo.avatar = reps[0].person.avatar;
                    }
                    $scope.userinfo.money = 340;
                    /*poster*/
                    if(reps[0].poster_creator.length>0) {
                        $scope.tarr = reps[0].poster_creator;
                    }
                    
                }
            })
            .error(function(){
                $ionicPopup.alert({
                 title: '错误提示',
                 template: '获取个人信息失败'
                });

            });
        
        /*初始化用户信息
        $scope.userinfo = {
            name:"小白",
            tnum:3,
            dnum:0,
            shnum:12,
            money:340,
            userhead:'../../img/headicon.jpeg'
        };
        $scope.tarr= [
            {
                id:1,
                imgurl:'../www/img/hb001.png'
            },
            {
                id:2,
                imgurl:'../www/img/hb001.png'
            },
            {
                id:3,
                imgurl:'../www/img/hb001.png'
            }
        ];*/
//        var currentStart = $scope.tarr.length;
        /*初始化所有模板隐藏菜单*/
        for(var i=0;i<$scope.tarr.length;i++){
            $scope["itemshow"+i]=false;
        }

        /*---------事件处理-----------*/
        /*用户长按模板缩微图效果*/
        $scope.onHold = function(num){
            $scope["itemshow"+num]=!$scope["itemshow"+num];
        }
        /*用户删除模板效果*/
        $scope.deletTemp = function(id){
             $ionicPopup.confirm({
                 title: '删除警告',
                 template: '确定要删除吗？',
                 buttons:[
                     {text:'取消',type: 'button-positive',},{text:'确定'}
                 ]
             }).then(function(res) {
                 //确认删除模板操作
                if(res)console.log(id);
                else console.log('You are not sure');
             });
        }
        /*用户点击编辑模板效果*/
        $scope.editTemp = function(id){
            //angular.element(event.currentTarget).addClass('new');
            alert(id);
        }
        /*用户添加新的模板*/
        $scope.addTemp=function(){
            alert('begin add tamplate');
        }
        /*
        $scope.addmoreTemp =function(){
            $http.post(API_CONFIG.root+'/api/v1/account/profile',{})
                .success(function(resp){
                    for(var i = currentStart; i < currentStart+resp.length; i++) {
                        $scope.tarr.push({
                            id:2,
                            imgurl:'../../img/hb001.png'
                        });
                    }
                    currentStart = currentStart+resp.length;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function(){
                    $ionicPopup.alert({
                     title: '错误提示',
                     template: '获取模板数据失败'
                    });
                });

        }*/


}]);