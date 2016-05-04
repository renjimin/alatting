	app.controller('basicinfoCtl',function($scope, $ionicPopup,$stateParams,$http,$state) {
	if($stateParams.data==null){
		$ionicPopup.alert({
		'title':'',
		'template':'请先选择模版关键词',
		'okType':'button-light'
		}).then(function(){
			$state.go('homepages.home');
			});
			return;
		}
	
	console.log($stateParams.data);
	
	
	$scope.submitform = function(){
	var reg=/^\w{1,}@\w+(\.\w+)+$/;
	$scope.flag = true;	
	var postname = $scope.postname;
	var postdesc = $scope.postdesc;
	var postemail = $scope.postemail;
	var posttelephone = $scope.posttelephone;
	var postphone = $scope.postphone;
	var postaddress = $scope.postaddress;
	var uploadimg = $scope.uploadimg;
	
	if (!postname) {
		$ionicPopup.alert({
		title: '提示',
	    template: '海报名称不能为空！'
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
	

	if(postdesc.length <= 50){
			$scope.flag = true;
		}else{
		
		$ionicPopup.alert({
		title: '提示',
		template: '海报简述在50字以内',
		buttons: [{
		text: '确定',
		type: 'button-positive'
			}]
	
		});
		$scope.flag = false;
		return false;
	
	}

	if (!uploadimg) {
	$ionicPopup.alert({
	title: '提示',
	template: '海报logo不能为空!',
		buttons: [{
		text: '确定',
		type: 'button-positive'
			}]
		});
		 return false;
	}	
	
//	if(!postemail){
//		
//	$ionicPopup.alert({
//	title: '提示',
//	template: 'email不能为空',
//	buttons: [{
//	text: '确定',
//	type: 'button-positive'
//	}]
//			});
//	return false;
//	}
//	
//	
//	if(!reg.test(postemail)){
//	 $ionicPopup.alert({
//	title: '提示',
//	template: 'email格式不正确!',
//	buttons: [{
//	text: '确定',
//	type: 'button-positive'
//	}]
//	
//	});
//	
//	return false;
//	 
//	}


if(flag){
			if(postemail.length != 0){
				var reg=/^\w{1,}@\w+(\.\w+)+$/;
	if(!reg.test(postemail)){
	
	var alertPopup = $ionicPopup.alert({
	title: '提示',
	template: 'email格式不正确!',
	buttons: [{
	text: '确定',
	type: 'button-positive'
		}]
	
		});
	
			flag = false;
			return false;
		}else{
			flag = true;
		}
	}else{
	//							alert("email不能为空！")
	var alertPopup = $ionicPopup.alert({
	    title: '提示',
	template: 'email不能为空'
				});
	
				flag = false;
				return false;
			}
	}







	
	if (!posttelephone) {
		$ionicPopup.alert({
		title: '提示',
		template: '电话不能为空!',
			buttons: [{
			text: '确定',
			type: 'button-positive'
			}]
		});
		 return false;
	}
	
	
	if (!postphone) {
		$ionicPopup.alert({
		title: '提示',
		template: 'phone不能为空!!',
			buttons: [{
			text: '确定',
			type: 'button-positive'
			}]
		});
		 return false;
	}
	
	
	if (!postaddress) {
		$ionicPopup.alert({
		title: '提示',
		template: '地址不能为空!',
			buttons: [{
			text: '确定',
			type: 'button-positive'
			}]
		});
		 return false;
	}	
	

	if(flag){
	   		var params = {};
	   		params.category_keyword_id=$stateParams.data.keywordId;
	        params.main_category_id=$stateParams.data.catId;
	        params.sub_category_id=$stateParams.data.subCatId;
	   		params.logo_image_id= uploadimg;
	        params.unique_name= postname;
	        params.logo_title= postname;
	        params.short_description= postdesc;
	        params.phone= posttelephone;
	        params.mobile= postphone;
	        params.email= postemail;
	        params.address= postaddress;
	        console.log(params);
	        $http.post(API_CONFIG.root + '/api/v1/poster/posters',params).success(function(data){
			console.log(data);
			$ionicPopup.alert({
		    title: '',
		    template: '提交成功',
		    okType:'button-light'
		   }).then(function(){
		   		$state.go('templateselect',{'data':data});
		   })
	
	}).error(function(data){
	    console.log(data);
	       $ionicPopup.alert({
	           title: '',
	   template: '保存失败，请稍后重试',
	   okType:'button-light'
					           })
				        });
	
	    		}
	
	}
	
	$scope.basicstep = function(){
	$ionicPopup.confirm({
	'title': '',
	'template': '确认返回上一页?',
	'okType':'button-light',
	'cancelText':'取消',
	'okText':'确认'
	}).then(function(res){
		if(res){
			$state.go('homepages.home');
	        	}else{
	        		
	        	}
			})
			
		}
	
	
	var uploader = WebUploader.create({
		    // 选完文件后，是否自动上传。
	auto: true,
	// swf文件路径
	swf:  'http://fex.baidu.com/webuploader/js/Uploader.swf',
	// 文件接收服务端。
	server: API_CONFIG.root + '/api/v1/poster/upload/logo',
	// 选择文件的按钮。可选。
	// 内部根据当前运行是创建，可能是input元素，也可能是flash.
	pick: '#filePicker',
	// 只允许选择图片文件。
	accept: {
	    title: 'Images',
	extensions: 'jpg,jpeg,png',
	mimeTypes: 'image/*'
	    }
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
	var $li = $(
	        '<div id="' + file.id + '" class="file-item thumbnail">' +
	'<img>' +
	'<div class="info">' + file.name + '</div>' +
	'</div>'
	    ),
	$img = $li.find('img');
	
	
	// $list为容器jQuery实例
	$('#fileList').append( $li );
	
	// 创建缩略图
	// 如果为非图片文件，可以不用调用此方法。
	// thumbnailWidth x thumbnailHeight 为 100 x 100
	uploader.makeThumb( file, function( error, src ) {
	    if ( error ) {
	        $img.replaceWith('<span>不能预览</span>');
	    return;
	}
	
	$img.attr( 'src', src );
	    }, 108, 108 );
	});
	
	uploader.on( 'uploadSuccess', function( file,data ) {
			console.log(data);
			$scope.uploadimg = data.id;
		})
	
	})
