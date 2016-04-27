app.controller( 'homeCtl',function($scope,$http,$ionicPopup,$state){
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
        var typemodel = document.querySelector('#type-model');
        typemodel.classList.toggle("open");

        $scope.types = {};

        $http.get(API_CONFIG.root + '/api/v1/poster/categorys?parent=0').success(function(data){
            $scope.types = data;
        }).error(function(data){
            console.log(data);
        });

    }
    /**创建海报二级类型选择*/
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

    $scope.showKeywords = function(event,parentId){
        $scope.keywords = {};
        var lists = event.currentTarget.parentNode.parentNode.children;
        //alert(lists.length+'    ' +event.currentTarget.parentNode.className+'    ' +event.currentTarget.parentNode.parentNode.className)
        for(i=0;i<lists.length;i++){
            if(lists[i]!=event.currentTarget.parentNode){
                lists[i].classList.remove('open');
            }
        }
        event.currentTarget.parentNode.classList.toggle('open');
        $scope.keywordsls = false;
        $http.get(API_CONFIG.root + '/api/v1/poster/category/'+parentId+'/keywords').success(function(data){
            console.log(data);
            if(data != null && data.length != 0){
                $scope.keywords = data;
            }else{
                $scope.keywordsls = true;
            }
        }).error(function(data){
            $ionicPopup.alert({
               title: '',
               template: '关键词获取失败，请稍后重试',
               okType:'button-light'
           });
        });
    }
    $scope.showKeySel = function(event){
        var lists = event.currentTarget.parentNode.parentNode.children;
        //alert(lists.length+'    ' +event.currentTarget.parentNode.className+'    ' +event.currentTarget.parentNode.parentNode.className)
        for(i=0;i<lists.length;i++){
            if(lists[i]!=event.currentTarget.parentNode){
                lists[i].classList.remove('open');
            }
        }
        event.currentTarget.parentNode.classList.add('open');

    }
    /**创建海报关键词保存*/
    $scope.saveKeywords = function(pkeyword,catId,subCatId){
        $scope.pkeyword = pkeyword;
        $http.post(API_CONFIG.root + '/api/v1/poster/category/'+subCatId+'/keywords',pkeyword).success(function(data){
            console.log(data);
            $ionicPopup.alert({
               title: '',
               template: '关键词保存成功',
               okType:'button-light'
           }).then(function(res) {
               $state.go('basicinfo',{data:{'keywordId':data.id,'catId':catId,'subCatId':subCatId}});
           });;


        }).error(function(data){
            console.log(data);
            $ionicPopup.alert({
               title: '',
               template: '关键词保存失败，请稍后重试',
               okType:'button-light'
           });
        });
    }
    /**创建海报关键词提交*/
    $scope.confirmKeywords = function(event,keywordId,catId,subCatId){

        $state.go('basicinfo',{data:{'keywordId':keywordId,'catId':catId,'subCatId':subCatId}});

    }

    $scope.selectHot = function(){
        $scope.posters = {};
        $http.get(API_CONFIG.root + '/api/v1/poster/posters/simple',{'sort':'hot'}).success(function(data){
            console.log(data);
            $scope.posters = data;
            document.querySelector('#main-empty').style.display="none";
            /*$window.location.href = 'regist.html'	*/
        }).error(function(data){
            console.log(data);
            document.querySelector('#main-empty').style.display="block";
        });

    }
    $scope.selectNew = function(){
        $scope.posters = {};
        $http.get(API_CONFIG.root + '/api/v1/poster/posters/simple',{'sort':'new'}).success(function(data){
            console.log(data);
            $scope.posters = data;
            document.querySelector('#main-empty').style.display="none";
            /*$window.location.href = 'regist.html'	*/
        }).error(function(data){
            console.log(data);
            document.querySelector('#main-empty').style.display="block";
        });

    }



})
