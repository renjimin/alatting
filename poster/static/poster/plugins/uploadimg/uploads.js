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
		fileNumLimit: 8,
		fileSingleSizeLimit: 5 * 1024 * 1024,
		accept: 'image/jpg,image/jpeg,image/png,image/gif',
		threads: 1,
		auto:true

	}

	$.fn.uploads = function(){
		var self = this;
		this.success = null;
		this.init = function(){
			var option = $.extend(opps,{pick: '#test',
										url: '/api/v1/poster/upload/logo',
										});
			if( option.url ) {
				option.server = option.url;
				delete option.url;
			}
			var webUploader = WebUploader.create(option);
			webUploader.on('uploadSuccess',function( file, response ){
				console.log(123123)
				if(self.success)self.success();

			});

			webUploader.on('uploadError',function( file, reason ){
				if ( self.error ) {
					self.error( reason );

				}
			});



		};
		this.showDialog = function(succ,error){
			self.success = succ;
			self.error = error;
			$('#test input').trigger('click');
		}
		return{
			"init":self.init,
			"showDialog":self.showDialog
		}
	}();

	/*$.fn.uploads = function(options){

		return this.each(function(){

			var option = $.extend(opps,options);

			//组装参数;
			if( option.url ) {
				option.server = option.url;
				delete option.url;
			}

			var webUploader = WebUploader.create( option );

			//绑定文件加入队列事件;
			webUploader.on('fileQueued', function( file ) {
				if ( option.fileQueued ) {
					option.fileQueued( file );
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

			//上传成功后触发事件;
			webUploader.on('uploadSuccess',function( file, response ){
				if ( option.success ) {
					option.success( response );
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

			//webUploader.upload();

		})


	}*/

})(jQuery)

$(function(){
	$.fn.uploads.init();
});