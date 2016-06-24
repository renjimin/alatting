app.controller('basicinfoCtl',function($scope, $ionicPopup,$stateParams,$http,$state) {

	$scope.submitform = function(){

		var postname = $scope.postname;
		var postslug = $scope.postslug;
		var postdesc = $scope.postdesc;
		var posttel = $scope.posttel;
		var postphone = $scope.postphone;

		if (!postname) {
			$ionicPopup.alert({
				title: '提示',
				template: '海报名称不能为空！',
				buttons: [{
					text: '确定',
					type: 'button-positive'
				}]
			});
			return false;
		}	


		if (!postslug) {
			$ionicPopup.alert({
				title: '提示',
				template: '链接名称不能为空！',
				buttons: [{
					text: '确定',
					type: 'button-positive'
				}]
			});
			return false;
		}	


        if(!postslug.match(/^([a-zA-Z0-9_-])*$/)){
            $ionicPopup.alert({
				title: '提示',
				template: '链接名称应由字母、数字、下划线或横线组成!',
				buttons: [{
					text: '确定',
					type: 'button-positive'
				}]
			});
            return false;
        }

		if (!postdesc) {
			$ionicPopup.alert({
				title: '提示',
				template: '海报简述不能为空',
				buttons: [{
					text: '确定',
					type: 'button-positive'
				}]
			});
			return false;
		}	


   //var reg2 = /^0\d{2,3}|^[4]00\-?\d{7}$/;
   var reg2 = /^0\d{2,3}|^[4]00\-?\d{7}$/;
	if(!reg2.test(posttel)){
		 $ionicPopup.alert({
				title: '提示',
				template: '固定电话格式不正确',
				buttons: [{
					text: '确定',
					type: 'button-positive'
				}]
			});
	        return false;
	}


	var reg=/^1[3|4|5|8][0-9]\d{4,8}$/;	
	if(!reg.test(postphone)){
		$ionicPopup.alert({
		title: '提示',
		template: '手机号格式不正确!',
		buttons: [{
		text: '确定',
		type: 'button-positive'
		}]
		
		});
		
		return false;
	}



	}




})