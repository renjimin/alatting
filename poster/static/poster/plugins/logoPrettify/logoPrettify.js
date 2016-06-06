$(
	$.fn.logoPrettify = function(){
		var api = {};
		var canvas,ctx,currentPannel,hasImage;

		api.init = function(){
			canvas = document.getElementById("editCanvas");
			ctx = canvas.getContext('2d');
			$("#logoPrettify").show();
			api.bindEvents();
		};
		api.destory = function(){
			$(".closeLogoPrettify").off("click");
			$(".editMenuGroup button").off("click");
			$("#logoPrettify").hide();
			if(api[currentPannel] && api[currentPannel].destory)api[pannelID].destory();
		};
		api.bindEvents = function(){
			$("#logoPrettify .closeLogoPrettify").on("click",function(){
				api.destory();
			});
			$(".editMenuGroup button").on("click",function(e){
				api.switchPannel($(e.target).data("pannel"));
			});
			$("#logoPrettify .uploadImage").on("change",function(){
				var file=this.files[0];
				var reader=new FileReader();
				reader.onload=function(){
					var url=reader.result;
					api.setImage(url);
				};
				reader.readAsDataURL(file);
			});
		};
		api.switchPannel = function(pannelID){
			if(currentPannel == pannelID)return;
			$("#"+currentPannel).hide();
			if(api[currentPannel] && api[currentPannel].destory)api[currentPannel].destory();
			if(pannelID && $("#"+pannelID))$("#"+pannelID).show();
			if(api[pannelID] && api[pannelID].init)api[pannelID].init();
			currentPannel = pannelID;
		};
		api.setImage = function(url){
			var image = new Image();
			image.src = url;
			var width = image.naturalWidth,
				height = image.naturalHeight;
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(image,0,0,width,height,0,0,width,height);
			hasImage = true;
			var 	scale = width/height;
			if(scale>1){
				$("#editCanvas").height(    ($(".body-container").width()) * 0.8    ) ;
				$("#editCanvas").width(    $("#editCanvas").width() / scale    ) ;
			}else{
				$("#editCanvas").height(    ($(".body-container").height() - 220) * 0.8    ) ;
				$("#editCanvas").width(    $("#editCanvas").height() * scale    ) ;
			}
		};
		api.uploadImage = function(){
			
		};
		api.editPannel_1 = function(){
			var module = {};
			module.init = function(){
				$("#editPannel_1 .fa.fa-fa-magic").on("click",function(){
					if(!hasImage)return;
					
				});
			};
			module.destory = function(){
				$("#editPannel_1 .fa.fa-fa-magic").off("click");
			};
			return module;
		}();

		return api;
	}()
);

$(
	$.fn.magicWand = function(){
		
	}()
);