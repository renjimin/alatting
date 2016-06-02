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
			//console.log(target);
			data.imgid = file.id;
			$(target).imgslider({
				"data": data
			});
			$(target).imgoperation();
			getImage();
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
	getImage();

	function getImage() {
		$.ajax({
			url: "/api/v1/account/images",
			type: "get",
			datatype: "json",
			success: function(data) {
				$(".imgul").empty();
				$.each(data, function() {
					var li = $(' <li data-id="' + this.id + '"><img src="' + this.file + '"/><a href="#" class="img-close"></a></li>')
					$(".imgul").append(li);
					li.find('img').click(function() {
						var target = Editor.require("hightClick").getCurrentTarget();
						var img = $(this).clone();
						target.empty().append(img);
						target.imgoperation();
					})
					li.find('.img-close').click(function(e) {
						deleteImg(li);
					});
				});
			}
		});
	}

	function deleteImg(obj) {
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