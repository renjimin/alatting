/* image */

function imageEditor(typename,data){
	var defaults = {
		'sysImgBox':$(".imgul"),
		'uploadImgBtn':$("#uploaderContainer2")

	}
	switch(typename){
		case 'loadAllImages':loadAllImages();break;
		case 'addUploadImg':addUploadImg(data);break;
		default:break;
	}
	function addUploadImg(data){
		var target = Editor.require("hightClick").getCurrentTarget();
		console.log(data)
		$(target).imgslider({
			"data": data
		});
		var li = $(' <li data-id="' + data.id + '" style="width:0;"><img src="' + data.file + '" data-width="'+data.width+'" data-height="'+data.height+'" data-id="WU_FILE_'+(new Date()).getTime()+'" /><a href="javascript:void(0);" class="img-close"></a></li>');
		defaults['sysImgBox'].prepend(li);
		li.animate({'width':'67px'},200);
	}
	function loadAllImages(){
		$.ajax({
			url: "/api/v1/account/images",
			type: "get",
			datatype: "json",
			success: function(data) {
				defaults['sysImgBox'].empty();
				$.each(data, function() {
					var _this = this;
					var li = $(' <li data-id="' + this.id + '"><img src="' + this.file + '" data-width="'+this.width+'" data-height="'+this.height+'" data-id="WU_FILE_'+(new Date()).getTime()+'" /><a href="javascript:void(0);" class="img-close"></a></li>');
					defaults['sysImgBox'].append(li);
				});
				defaults['sysImgBox'].on('click',function(e){
					var img = $(e.target).closest('img'),
						closetarget = $(e.target).closest('.img-close'),
						target = Editor.require("hightClick").getCurrentTarget();
						defaults['sysImgBox'] = img.parent().parent();
					if(img.length > 0){
						selectSysImg(img,target);
					}
					if(closetarget.length > 0){
						deleteSysImg(closetarget.parent());
					}

				});

			}
		});
	}
	function selectSysImg(img,target){
		var imgclone = img.clone();console.log(defaults['sysImgBox'].attr('data-slider'))
		if(!defaults['sysImgBox'].attr('data-slider') || defaults['sysImgBox'].attr('data-slider')==undefined){
			target.empty().append(imgclone);
			target.imgoperation();
			return;
		}
		var imgdata={
			'file':imgclone.attr('src'),
			'width':imgclone.attr('data-width'),
			'height':imgclone.attr('data-height'),
			'imgid':img.attr('data-id')
		}		
		target.imgslider({'data':imgdata});
		/* add image to sliderbox */
		var file_id = img.attr('data-id');
		var fileitem = $('<div class="file-item" id="fileBox_'+file_id+'" style="width:0;">\
					        <div class="file-item-wraper">\
					            <div class="viewThumb">\
					            <img src="'+imgclone.attr('src')+'">\
					            </div>\
					            <div class="status">\
					            </div>\
					            <a href="javascript:void(0);" class="close"></a>\
					        </div>\
					    </div>');
		defaults['uploadImgBtn'].before(fileitem);
		fileitem.animate({'width':'33.3333333%'},200);
		//绑定取消事件;
		fileitem.find('.close').on('click',function(){
			fileitem.animate({'width':'0'},200,function(){
				fileitem.remove();
			});
			$("#slideImg"+file_id).remove();		
			target.imgslider();
		
		});


	}
	function deleteSysImg(obj){
		$.ajax({
			url: "/api/v1/account/images/" + obj.attr('data-id'),
			type: "DELETE",
			datatype: "json",
			success: function(data) {
				obj.animate({
					'width': '0'
				}, 200, function() {
					obj.remove();
				});
			}
		});
	}

}
$(function(){
	imageEditor('loadAllImages');
})



$(function(){

	var slideTarget;
	$('#uploaderContainer2').diyUpload({
		url: '/api/v1/poster/upload/logo',
		buttonText: '上传图片',
		chunked: false,
		fileNumLimit: 4,
		fileSingleSizeLimit: 5 * 1024 * 1024,
		accept: {
			title: 'Images',
			extensions: 'gif,jpg,jpeg,png',
			mimeTypes: 'image/*'
		},
		compress: false,
		threads: 1,
		auto: true,
		success: function(data, file) {
			var target = Editor.require("hightClick").getCurrentTarget();
			slideTarget = $(target);
			data.imgid = file.id;			
			imageEditor('addUploadImg',data);
		},
		error: function(err) {
			console.info(err);
		},
		sliderContainer: slideTarget
	});
	$("#uploadsvideo1").click(function() {
		$.fn.uploadsvideo.showDialog(function(data) {
			var target = Editor.require("hightClick").getCurrentTarget();
			console.log(data);
			var vediobtn = $('<a class="video-js">' +
				'<img src="/static/poster_pc/images/play.png" class="video-play"/>' +
				'</a>');
			$("#uploadsvideo1").before(vediobtn);
			target.empty().append(vediobtn);
			//var videoplay = $(".video-play");
			$("#video_1").find("video").attr("poster", data.preview);
			vediobtn.find('.video-play').on('click', function() {
				$("#video_1").find("video").attr("src", data.file);
				$(".introVideoDialog").show();
			});
		}, function(data) {
			yyAlert("上传失败");
		});
		getVideos();
	})

	getVideos();
	function getVideos() {
		$.ajax({
			url: "/api/v1/account/videos",
			type: "get",
			datatype: "json",
			success: function(data) {
				$(".parentImgUL").empty();
				$.each(data, function() {
					var li = $(' <li data-src="' + this.file + '" data-id="' + this.id + '"><img class="img-preview" src="' + this.preview + '"/><img src="/static/poster_pc/images/play.png" class="video-play"/><a href="#" class="img-close"></a></li>')
					$(".parentImgUL").append(li);
					li.find(".video-play").click(function() {
						$("#video_1").find("video").attr("src", $(this).parent().attr('data-src'));
						$(".introVideoDialog").show();
					})
					li.find(".img-close").click(function(e) {
						deleteVideos(li);
					})
				});
			}
		});
	}


	function deleteVideos(obj) {
		$.ajax({
			url: "/api/v1/account/videos/" + obj.attr('data-id'),
			type: "DELETE",
			datatype: "json",
			success: function(data) {
				obj.animate({
					'width': '0'
				}, 200, function() {
					obj.remove();
				});
			}
		});
	}




})