app.controller('basicinfoCtl',function($scope,$ionicPopup,$stateParams){
	
	$scope.submitform = function(){

		var postname = $scope.postname;
		var postdesc = $scope.postdesc;
	    var postemail = $scope.postemail;
	    var posttelephone = $scope.posttelephone;
	    var postphone = $scope.postphone;
	    var postaddress = $scope.postaddress;
	    alert($scope.postname);
		if (postname==undefined) {
				 	var alertPopup = $ionicPopup.alert({
						title: '提示',
						template: '海报名称不能为空',
						buttons: [{ 
						text: '确定',
   						type: 'button-positive'
							}]    
							    
							});
				 return false;
			}
		
		if (postdesc==undefined) {
				 	var alertPopup = $ionicPopup.alert({
						title: '提示',
						template: '海报简述不能为空',
						buttons: [{ 
						text: '确定',
   						type: 'button-positive'
							}]    
							    
							});
				 return false;
			}
		
		if (postemail==undefined) {
				 	var alertPopup = $ionicPopup.alert({
						title: '提示',
						template: 'email不能为空',
						buttons: [{ 
						text: '确定',
   						type: 'button-positive'
							}]    
							    
							});
				 return false;
			}
		
		if (posttelephone==undefined) {
				 	var alertPopup = $ionicPopup.alert({
						title: '提示',
						template: '电话不能为空',
						buttons: [{ 
						text: '确定',
   						type: 'button-positive'
							}]    
							    
							});
				 return false;
			}
		
		
		if (postphone==undefined) {
				 	var alertPopup = $ionicPopup.alert({
						title: '提示',
						template: '手机不能为空',
						buttons: [{ 
						text: '确定',
   						type: 'button-positive'
							}]    
							    
							});
				 return false;
			}
		
		
		
		if (postaddress==undefined) {
				 	var alertPopup = $ionicPopup.alert({
						title: '提示',
						template: '地址不能为空',
						buttons: [{ 
						text: '确定',
   						type: 'button-positive'
							}]    
							    
							});
				 return false;
			}
		
		
	}


})