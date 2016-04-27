app.controller( 'homeCtl',function($scope,$http){
    /**调用图片列表*/
    $scope.posters = {};


    $http.get(API_CONFIG.root + '/api/v1/poster/posters/simple').success(function(data){
        console.log(data);
        $scope.posters = data;
        document.querySelector('#main-empty').style.display="none";
        /*$window.location.href = 'regist.html'	*/
    }).error(function(data){
        console.log(data);
        document.querySelector('#main-empty').style.display="block";
    });




    /**创建海报类型选择*/
    $scope.showTypeSel = function(){
        var model = document.querySelector('#type-model');
        model.classList.toggle("open");

        $scope.types = {};

        $http.get(API_CONFIG.root + '/api/v1/poster/categorys?parent=0').success(function(data){
            console.log(data);
            $scope.types = data;

            //document.querySelector('.empty-info').style.display="none";
            /*$window.location.href = 'regist.html'	*/
        }).error(function(data){
            //document.querySelector('.empty-info').style.display="block";
        });

    }
    $scope.showSubType = function(event,parentId){
        $scope.subtypes = {};
        var lists = event.currentTarget.parentNode.parentNode.children;
        //alert(lists.length+'    ' +event.currentTarget.parentNode.className+'    ' +event.currentTarget.parentNode.parentNode.className)
        for(i=0;i<lists.length;i++){
            if(lists[i]!=event.currentTarget.parentNode){
                lists[i].classList.remove('open');
            }
        }
        event.currentTarget.parentNode.classList.toggle('open');
        $http.get(API_CONFIG.root + '/api/v1/poster/categorys?parent='+parentId).success(function(data){
            console.log(data);
            $scope.subtypes = data;

            //document.querySelector('.empty-info').style.display="none";
            /*$window.location.href = 'regist.html'	*/
        }).error(function(data){
            //document.querySelector('.empty-info').style.display="block";
        });
    }




})
