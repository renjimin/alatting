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

	function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}

	$scope.submitform = function(){
        var flag = true;
        var postname = trimStr(document.querySelector('.post-name').value);
        var postname = trimStr(document.querySelector('.post-name').value);
        var postdesc = trimStr(document.querySelector('.post-desc').value);
        var postemail = trimStr(document.querySelector('.post-email').value);
        var posttelephone = trimStr(document.querySelector('.post-telephone').value);
        var postphone = trimStr(document.querySelector('.post-phone').value);
        var postaddress = trimStr(document.querySelector('.post-address').value);
        var uploadimg = $scope.uploadimg;
        /*var postdesc = $.trim($('.post-desc').val());
        var postemail = $.trim($('.post-email').val());
        var posttelephone = $.trim($('.post-telephone').val());
        var postphone = $.trim($('.post-phone').val());
        var postaddress = $.trim($('.post-address').val());*/

        if(flag){
            if(postname.length != 0){
                flag = true;
            }else{
                $ionicPopup.alert({
                    title: '提示',
                    template: '海报名称不能为空',
                    buttons: [{
                        text: '确定',
                        type: 'button-positive'
                    }]

                });
                flag = false;
                return false;
            }
        }

        if(flag){
            if (postdesc.length != 0) {
                flag = true;
            } else {

                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '海报简述不能为空',
                    buttons: [{
                        text: '确定',
                        type: 'button-positive'
                    }]

                });
                flag = false;
                return false;
            }

            if (postdesc.length <= 50) {
                flag = true;
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: '海报简述在50字以内',
                    buttons: [{
                        text: '确定',
                        type: 'button-positive'
                    }]

                });
                flag = false;
                return false;
            }
        }
        if (flag) {
            if (postemail.length != 0) {
                var reg = /^\w{3,}@\w+(\.\w+)+$/;
                if (!reg.test(postemail)) {

                    $ionicPopup.alert({
                        title: '提示',
                        template: 'email格式不正确!',
                        buttons: [{
                            text: '确定',
                            type: 'button-positive'
                        }]

                    });

                    flag = false;
                    return false;
                } else {
                    flag = true;
                }
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: 'email不能为空'
                });
                flag = false;
                return false;
            }
        }
        if (flag) {
            if (posttelephone.length != 0) {
                flag = true;
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: '电话不能为空!',
                    buttons: [{
                        text: '确定',
                        type: 'button-positive'
                    }]
                });
                flag = false;
                return false;
            }
        }
        if (flag) {
            if (postphone.length != 0) {
                flag = true;
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: 'phone不能为空!',
                    buttons: [{
                        text: '确定',
                        type: 'button-positive'
                    }]
                });
                flag = false;
                return false;
            }
        }
        if (flag) {
            if (postaddress.length != 0) {
                flag = true;
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: '地址不能为空!',
                    buttons: [{
                        text: '确定',
                        type: 'button-positive'
                    }]
                });
                flag = false;
                return false;
            }
        }
        if (flag) {
            var params = {};
            params.category_keyword_id = $stateParams.data.keywordId;
            params.main_category_id = $stateParams.data.catId;
            params.sub_category_id = $stateParams.data.subCatId;
            params.logo_image_id = uploadimg;
            params.unique_name = postname;
            params.logo_title = postname;
            params.short_description = postdesc;
            params.phone = posttelephone;
            params.mobile = postphone;
            params.email = postemail;
            params.address = postaddress;
            console.log(params);
            $http.post(API_CONFIG.root + '/api/v1/poster/posters', params).success(function (data) {
                console.log(data);
                $ionicPopup.alert({
                    title: '',
                    template: '提交成功',
                    okType: 'button-light'
                }).then(function () {
                    $state.go('templateselect', {'data': data});
                });
            }).error(function (data) {
                console.log(data);
                $ionicPopup.alert({
                    title: '',
                    template: '保存失败，请稍后重试',
                    okType: 'button-light'
                })
            });
        }
	};

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
	};

    var uploader = WebUploader.create({
	    // 选完文件后，是否自动上传。
	    auto: true,
	    // swf文件路径
	    //swf:  'http://fex.baidu.com/webuploader/js/Uploader.swf',
	    // 文件接收服务端。
	    server: API_CONFIG.root + '/api/v1/poster/upload/logo',
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: '#filePicker',
        // resize: false,
        // 解决android 4+ bug
        // sendAsBinary: true,
        fileNumLimit: 1
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
	});
});
