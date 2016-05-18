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
		this.showDialog = function(options){
			var option = $.extend(opps,options);
			if( option.url ) {
				option.server = option.url;
				delete option.url;
			}
			console.log(option.pick);
			var webUploader = WebUploader.create(option);
			webUploader.on('uploadSuccess',function( file, response ){
				if(option.success)option.success(response);
			});
			webUploader.on('uploadError',function( file, reason ){
				if ( option.error ) option.error( reason );
			});
		}
		return{
			"showDialog":self.showDialog
		}
	}();
})(jQuery)