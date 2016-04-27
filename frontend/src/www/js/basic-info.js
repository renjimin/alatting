app.controller('basicinfo',function($scope, $ionicPopup) {
	
	$scope.submitform = function(){
		
		
			var postname = $.trim($('.post-name').val());
				var flag = true;
//	    		var basiclogo = $.trim($('#logoval').val());
				var postname = $.trim($('.post-name').val());
				var postdesc = $.trim($('.post-desc').val());
	    		var postemail = $.trim($('.post-email').val());
	    		var posttelephone = $.trim($('.post-telephone').val());
	    		var postphone = $.trim($('.post-phone').val());
	    		var postaddress = $.trim($('.post-address').val());
//	    		if(flag){
//						if(basiclogo.length != 0){
//							flag = true;
//						}else{
//							alert("logo不能为空！")
//							flag = false;
//							return false;
//						}
//				}

				if(flag){
						if(postname.length != 0){
							flag = true;
						}else{
							
						var alertPopup = $ionicPopup.alert({
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
						if(postname.length != 0){
							flag = true;
						}else{
							
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
						
						if(postname.length>50){
							flag = true;
						}else{
							
						var alertPopup = $ionicPopup.alert({
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


	    		if(flag){
						if(postemail.length != 0){
							var reg=/^\w{3,}@\w+(\.\w+)+$/;   
        					if(!reg.test(postemail)){
        						/*alert("email格式不正确！")*/
        						
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
	    		if(flag){
						if(posttelephone.length != 0){
							flag = true;
						}else{
							
							var alertPopup = $ionicPopup.alert({
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
	    		if(flag){
						if(postphone.length != 0){
							flag = true;
						}else{
							
							var alertPopup = $ionicPopup.alert({
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
	    		if(flag){
						if(postaddress.length != 0){
							flag = true;
						}else{
							var alertPopup = $ionicPopup.alert({
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
	    		if(flag){
	    			$(".btnform").attr("action","后台地址");
	    			$(".btnform").attr("method",'post');
	    			$(".btnform").submit();
	    		}
		
		
	}
	
	
	var uploader = WebUploader.create({

	    // 选完文件后，是否自动上传。
	    auto: true,
	
	    // swf文件路径
	    swf:  'http://fex.baidu.com/webuploader/js/Uploader.swf',
	
	    // 文件接收服务端。
	    server: 'http://webuploader.duapp.com/server/fileupload.php',
	
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: '#filePicker',
	
	    // 只允许选择图片文件。
	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
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
	    }, 80, 80 );
	});
	
	
	
})

		