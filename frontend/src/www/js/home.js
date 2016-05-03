app.controller( 'homeCtl',function($scope,$http,$ionicPopup,$state,$stateParams,$ionicLoading,$timeout){
    /**调用图片列表*/
    $scope.posters = {};
    $scope.isPostersEmpty = false;
    var typemodel = document.querySelector('#type-model');
    typemodel.classList.remove("open");

    $http.get(API_CONFIG.root + '/api/v1/poster/posters/simple').success(function(data){
        $scope.posters = data;
    }).error(function(data){
        console.log(data);
        $scope.isPostersEmpty = true;
    });
    /**下拉刷新*/
    $scope.doRefresh = function(){
        $scope.isPostersEmpty = false;
        $http.get(API_CONFIG.root + '/api/v1/poster/posters/simple').success(function(data){
            $scope.posters = data;
        }).error(function(data){
            console.log(data);
            $scope.isPostersEmpty = true;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    }



    /**创建海报类型选择*/
    $scope.showTypeSel = function(){
        var typemodel = document.querySelector('#type-model');
        typemodel.classList.toggle("open");
        if(!typemodel.classList.contains('open')){
            return;
        }
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.types = {};
        $scope.cateIsEmpty = false;

        $http.get(API_CONFIG.root + '/api/v1/poster/categorys?parent=0').success(function(data){
            $ionicLoading.hide();
            $scope.types = data;
            $scope.cateIsEmpty = false;
        }).error(function(data){
            console.log(data);
            $ionicLoading.hide();
            $scope.cateIsEmpty = true;
        });
        if($scope.types.legnth > 0){
            $ionicLoading.hide();
            $scope.cateIsEmpty = false;
        }

    }
    /**隐藏海报类型选择*/
    $scope.hideTypeModel = function(){
        var typemodel = document.querySelector('#type-model');
        typemodel.classList.remove("open");

    }
    /**二级菜单选择*/
    $scope.showSubType = function(event,parentId){
        $scope.subtypes = {};
        var showBox  = angular.element(event.currentTarget.parentNode);
        showBox.find('dl').css('height','0px');
        var lists = event.currentTarget.parentNode.parentNode.children;
        for(i=0;i<lists.length;i++){
            if(lists[i]!=event.currentTarget.parentNode){
                lists[i].classList.remove('open');
            }
        }


        event.currentTarget.parentNode.classList.toggle('open');
        if(!event.currentTarget.parentNode.classList.contains('open')){
            return;
        }

        $http.get(API_CONFIG.root + '/api/v1/poster/categorys?parent='+parentId).success(function(data){
            $scope.subtypes = data;

            showBox.find('dl').css('height',data.length * 43+'px');
            $timeout(function(){showBox.find('dl').css('height','auto');},300);
        }).error(function(data){
            console.log(data);
        });
    }

    $scope.keywords='';
    $scope.showKeywords = function(event,parentId){
        $scope.keywordolds = {};
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
            if(data != null && data.length != 0){
                $scope.keywordolds = data;
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
        for(i=0;i<lists.length;i++){
            if(lists[i]!=event.currentTarget.parentNode){
                lists[i].classList.remove('open');
            }
        }
        event.currentTarget.parentNode.classList.add('open');

    }
    /**
    * 添加关键词
    * keywordadds为添加的关键词列表
    */
    $scope.pkeyword = {'verb':'','noun':''}
    $scope.keywordadds = [];
    $scope.addKeywords = function(pkeyword,subCatId){
        if(pkeyword==undefined || pkeyword.length <= 0 || pkeyword.verb==''|| pkeyword.noun==''){
            $ionicPopup.alert({
               title: '',
               template: '请输入关键词',
               okType:'button-light'
            })
            console.log(pkeyword);
            return;
        }

        $http.post(API_CONFIG.root + '/api/v1/poster/category/'+subCatId+'/keywords',pkeyword).success(function(data){
            $scope.keywordadds.push(data);
            $scope.pkeyword = {'verb':'','noun':''};
        }).error(function(data){
            console.log(data);
            $ionicPopup.alert({
               title: '',
               template: '关键词保存失败，请稍后重试',
               okType:'button-light'
           });
        });
    }
    /**
    * 选择关键词
    *
    */
    $scope.selKeywords = function(event,keywordId){
        var kys = document.querySelectorAll('.key-item');
        for(i=0;i<kys.length;i++){
            angular.element(kys[i]).find('i').removeClass('ion-android-checkbox-outline').addClass('ion-android-checkbox-outline-blank');
        }
        angular.element(event.currentTarget).find('i').removeClass('ion-android-checkbox-outline-blank').addClass('ion-android-checkbox-outline');
        $scope.keywords=keywordId;


    }
    /**创建海报关键词保存*/
    $scope.saveKeywords = function(catId,subCatId){

        if($scope.keywords == undefined || $scope.keywords == null || $scope.keywords == ''){
            $ionicPopup.alert({
               title: '',
               template: '请选择关键词',
               okType:'button-light'
            })
            console.log(pkeyword);
            return;
        }
        document.querySelector('#type-model').classList.remove("open");
        $state.go('basicinfo',{data:{'keywordId':$scope.keywords,'catId':catId,'subCatId':subCatId}});
        console.log({'keywordId':$scope.keywords,'catId':catId,'subCatId':subCatId});

    }


    $scope.selectHot = function(){
        $scope.posters = {};
        $http.get(API_CONFIG.root + '/api/v1/poster/posters/simple',{'sort':'hot'}).success(function(data){
            $scope.posters = data;
            $scope.isPostersEmpty = false;
        }).error(function(data){
            console.log(data);
            $scope.isPostersEmpty = true;
        });

    }
    $scope.selectNew = function(){
        $scope.posters = {};
        $http.get(API_CONFIG.root + '/api/v1/poster/posters/simple',{'sort':'new'}).success(function(data){
            $scope.posters = data;
            $scope.isPostersEmpty = false;
        }).error(function(data){
            console.log(data);
            $scope.isPostersEmpty = true;
        });

    }



})
