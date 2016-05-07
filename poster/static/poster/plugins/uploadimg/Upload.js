(function($){
	var opps = {
		url: '/api/v1/poster/upload',
		success:null,
		error:null,
		fileQueued:null,
		complete:null,
		uploadfinish:null,
		progress:null,
		uploadsuccess:null,
		buttonText: '选择图片上传',
		chunked: false,
		fileNumLimit: 8,
		fileSingleSizeLimit: 5 * 1024 * 1024,
		accept: 'image/jpg,image/jpeg,image/png,image/gif',
		threads: 1

	}


	$.fn.uploads = function(options){
		 return this.each(function(){
			console.log(2);
			 this.init = function () {
				 console.log(1);
			 }

			var option = $.extend(opps,options);

			//组装参数;
			if( option.url ) {
				option.server = option.url;
				delete option.url;
			}

			if( option.success ) {
				var successCallBack = option.success;
				delete option.success;
			}

			if( option.error ) {
				var errorCallBack = option.error;
				delete option.error;
			}

			var webUploader = new WebUploader.Uploader( option );

			//绑定文件加入队列事件;
			webUploader.on('fileQueued', function( file, webUploader) {
				if ( option.fileQueued ) {
					option.fileQueued( file,webUploader );
				}
			});


			//进度条事件
			webUploader.on('uploadProgress',function( file, percentage  ){
				if ( option.progress ) {
					option.progress( file );
				}

			});

			//上传完成时触发，不管成功与否;
			webUploader.on('uploadComplete', function(file ){
				if ( option.complete ) {
					option.complete( file );
				}
			});

			//全部上传结束后触发;
			webUploader.on('uploadFinished', function(){
				if ( option.uploadfinish ) {
					option.uploadfinish( file );
				}
			});


			//绑定发送至服务端返回后触发事件;
			webUploader.on('uploadAccept', function( object ,data ){
				if ( serverCallBack ) serverCallBack( data );
			});


			//上传成功后触发事件;
			webUploader.on('uploadSuccess',function( file, response ){
				if ( option.uploadsuccess ) {
					option.uploadsuccess( file );
				}
			});

			//上传失败后触发事件;
			webUploader.on('uploadError',function( file, reason ){
				if ( option.error ) {
					option.error( reason );
				}
			});


			//选择文件错误触发事件;
			webUploader.on('error', function( code ) {
				var text = '';
				switch( code ) {
					case  'F_DUPLICATE' : text = '该文件已经被选择了!' ;
					break;
					case  'Q_EXCEED_NUM_LIMIT' : text = '上传文件数量超过限制!' ;
					break;
					case  'F_EXCEED_SIZE' : text = '文件大小超过限制!';
					break;
					case  'Q_EXCEED_SIZE_LIMIT' : text = '所有文件总大小超过限制!';
					break;
					case 'Q_TYPE_DENIED' : text = '文件类型不正确或者是空文件!';
					break;
					default : text = '未知错误!';
 					break;
				}
            	alert( text );
        	});


			webUploader.upload();



		})


	}

})(jQuery)