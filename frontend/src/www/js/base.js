app.controller('basicinfo',function($scope,$ionicPopup){
	$scope.basicinfo.postname="sasdasdads";
	
	$scope.submitform = function(){

		var postname = $scope.basicinfo.postname;
		var postdesc = $scope.basicinfo.postdesc;
	    var postemail = $scope.basicinfo.postemail;
	    var posttelephone = $scope.basicinfo.posttelephone;
	    var postphone = $scope.basicinfo.postphone;
	    var postaddress = $scope.basicinfo.postaddress;
	    alert($scope.basicinfo.postname);
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