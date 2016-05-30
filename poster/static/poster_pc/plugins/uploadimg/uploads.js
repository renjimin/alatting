(function($){
	var opps = {
		url: '/api/v1/poster/upload',
		success:null,
		error:null,
		fileQueued:null,
		complete:null,
		uploadfinish:null,
		progress:null,
		buttonText: '选择图片上传',
		chunked: false,
		fileNumLimit: 1,
		fileSingleSizeLimit: 5 * 1024 * 1024,
		accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,png',
				mimeTypes: 'image/*'
		},
		threads: 1,
		auto:true
	}
	$.fn.uploads = function(){
		var self = this;
		this.success = null;
		this.init = function(){
			var option = $.extend(opps,{pick: {'id':'#test','multiple':false},url: '/api/v1/poster/upload/logo'});
			if( option.url ) {
				option.server = option.url;
				delete option.url;
			}

			var webUploader = WebUploader.create(option);
			webUploader.on('uploadSuccess',function( file, response ){
				if(self.success)self.success(response);
				webUploader.removeFile(file.id);

			});

			webUploader.on('uploadError',function( file, reason ){
				if ( self.error ) {
					self.error( reason );

				}
			});
			//绑定文件加入队列事件;
			webUploader.on('fileQueued', function( file ) {
				if(!/\.(gif|jpg|jpeg|bmp|png)$/.test(file.name)){
				    yyAlert("上传图片格式错误");
					webUploader.removeFile(file.id);
				    return false;
				}
			});

			webUploader.on( 'uploadProgress', function( file, percentage ) {
				$.fn.yyTools.mask(1);

			})

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
            	yyAlert( text );
				return;
        	});
		};
		this.showDialog = function(succ,error,fileQueued){
			self.success = succ;
			self.error = error;
			self.fileQueued = fileQueued;
			$('#test input').trigger('click');
		}
		return{
			"init":self.init,
			"showDialog":self.showDialog
		}
	}();


	var optvideo = {
		url: '/api/v1/poster/upload',
		success:null,
		error:null,
		fileQueued:null,
		complete:null,
		uploadfinish:null,
		progress:null,
		chunked: false,
		fileNumLimit: 1,
		fileSingleSizeLimit: 5 * 1024 * 1024,
		accept: {
				title: 'video',
				extensions: 'mp4,ogg,webm',
				mimeTypes: 'video/*'
		},
		threads: 1,
		auto:true
	}
	$.fn.uploadsvideo = function(){
		var self = this;
		this.success = null;

		this.init = function(){

			$('body').append('<div id="uploadsvideo"></div>');
			var option = $.extend(optvideo,{pick: {'id':'#uploadsvideo','multiple':false},url: '/api/v1/poster/upload/logo'});
			if( option.url ) {
				option.server = option.url;
				delete option.url;
			}

			var webUploadervideo = WebUploader.create(option);
			webUploadervideo.on('uploadSuccess',function( file, response ){
				if(self.success)self.success(response);
				webUploadervideo.removeFile(file.id);

			});


			webUploadervideo.on('uploadError',function( file, reason ){
				if ( self.error ) {
					self.error( reason );

				}
			});

			//绑定文件加入队列事件;
			webUploadervideo.on('fileQueued', function(file ) {
				if(!/\.(mp4|ogg|webm)$/.test(file.name)){
					yyAlert("上传视频格式错误");
					webUploader.removeFile(file.id);
					return false;
				}

			});

			webUploadervideo.on( 'uploadProgress', function( file, percentage ) {
				$.fn.yyTools.mask(1);

			})

		};
		this.showDialog = function(succ,error,fileQueued){
			self.success = succ;
			self.error = error;
			self.fileQueued = fileQueued;
			$('#uploadsvideo input').trigger('click');
		}
		return{
			"init":self.init,
			"showDialog":self.showDialog
		}
	}();


		var optaudio = {
		url: '/api/v1/poster/upload',
		success:null,
		error:null,
		fileQueued:null,
		complete:null,
		uploadfinish:null,
		progress:null,
		chunked: false,
		fileNumLimit: 1,
		fileSingleSizeLimit: 5 * 1024 * 1024,
		accept: {
				title: 'audio',
				extensions: 'mp3,ogg,wav',
				mimeTypes: 'audio/*'
		},
		threads: 1,
		auto:true
	}
	$.fn.uploadsaudio = function(){
		var self = this;
		this.success = null;

		this.init = function(){

			$('body').append('<div id="uploadsaudio"></div>');
			var option = $.extend(optvideo,{pick: {'id':'#uploadsaudio','multiple':false},url: '/api/v1/poster/upload/logo'});
			if( option.url ) {
				option.server = option.url;
				delete option.url;
			}

			var webUploaderaudio = WebUploader.create(option);
			webUploaderaudio.on('uploadSuccess',function( file, response ){
				if(self.success)self.success(response);
				webUploaderaudio.removeFile(file.id);

			});


			webUploaderaudio.on('uploadError',function( file, reason ){
				if ( self.error ) {
					self.error( reason );

				}
			});

			//绑定文件加入队列事件;
			webUploaderaudio.on('fileQueued', function(file ) {
				if(!/\.(mp4|ogg|webm)$/.test(file.name)){
					yyAlert("上传视频格式错误");
					webUploader.removeFile(file.id);
					return false;
				}

			});

			webUploaderaudio.on( 'uploadProgress', function( file, percentage ) {
				$.fn.yyTools.mask(1);

			})


			//选择文件错误触发事件;
			webUploaderaudio.on('error', function( code ) {
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
            	yyAlert( text );
				return;
        	});

		};
		this.showDialog = function(succ,error,fileQueued){
			self.success = succ;
			self.error = error;
			self.fileQueued = fileQueued;
			$('#uploadsaudio input').trigger('click');
		}
		return{
			"init":self.init,
			"showDialog":self.showDialog
		}
	}();


})(jQuery)

$(function(){
	$.fn.uploads.init();
	$.fn.uploadsvideo.init();
	$.fn.uploadsaudio.init();
});
