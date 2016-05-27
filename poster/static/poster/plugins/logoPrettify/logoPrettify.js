$(
	$.fn.logoPrettify = function(){
		var self = this;
		var canvas,ctx;

		this.init = function(){
			canvas = document.getElementById("editCanvas");
			ctx = canvas.getContext('2d');
			$("#logoPrettify").show();
			self.bindEvents();
		};
		this.destory = function(){
			$(".closeLogoPrettify").off("click");
			$("#logoPrettify").hide();
		};
		this.bindEvents = function(){
			$("#logoPrettify .closeLogoPrettify").on("click",function(){
				self.destory();
			});
			$("#logoPrettify .uploadImage").on("change",function(){
				var file=this.files[0];
				var reader=new FileReader();
				reader.onload=function(){
					var url=reader.result;
					self.setImage(url);
				};
				reader.readAsDataURL(file);
			});
		};
		this.setImage = function(url){
			var image = new Image();
			image.src = url;
			var width = image.naturalWidth,
				height = image.naturalHeight;
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(image,0,0,width,height,0,0,width,height);
			var 	scale = width/height;
			if(scale>1){
				$("#editCanvas").height(    ($(".body-container").width()) * 0.8    ) ;
				$("#editCanvas").width(    $("#editCanvas").width() / scale    ) ;
			}else{
				$("#editCanvas").height(    ($(".body-container").height() - 220) * 0.8    ) ;
				$("#editCanvas").width(    $("#editCanvas").height() * scale    ) ;
			}
			
			// var 	scale = width/height,
			// 	canvasScale = canvasW/canvasH;
			// if(scale>canvasScale){
			// 	ctx.drawImage(image,0,0,width,height,0,(canvasH - canvasW/scale)/2,canvasW,canvasW/scale);
			// }else{
			// 	ctx.drawImage(image,0,0,width,height,(canvasW - canvasH*scale)/2,0,canvasH*scale,canvasH);
			// }
		};
		this.uploadImage = function(){

			
		};

		return {
			init : this.init ,
			destory : this.destory
		};
	}()
);