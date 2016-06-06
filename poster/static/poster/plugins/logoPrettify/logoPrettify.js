$(
	$.fn.logoPrettify = function(){
		var self = this;
		var canvas,ctx,currentPannel;

		this.init = function(){
			canvas = document.getElementById("editCanvas");
			ctx = canvas.getContext('2d');
			$("#logoPrettify").show();
			self.bindEvents();
		};
		this.destory = function(){
			$(".closeLogoPrettify").off("click");
			$(".editMenuGroup button").off("click");
			$("#logoPrettify").hide();
		};
		this.bindEvents = function(){
			$("#logoPrettify .closeLogoPrettify").on("click",function(){
				self.destory();
			});
			$(".editMenuGroup button").on("click",function(e){
				self.switchPannel($(e.target).data("pannel"));
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
		this.switchPannel = function(pannelID){
			if(currentPannel == pannelID)return;
			$("#"+currentPannel).hide();
			if(pannelID && $("#"+pannelID))$("#"+pannelID).show();
			currentPannel = pannelID;
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
		};
		this.uploadImage = function(){
			
		};

		return {
			init : this.init ,
			destory : this.destory
		};
	}()
);