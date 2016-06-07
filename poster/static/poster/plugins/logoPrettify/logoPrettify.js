$(
	$.fn.logoPrettify = function(){
		var api = {};
		var canvas,ctx,currentPannel,hasImage;

		api.init = function(url){
			canvas = document.getElementById("editCanvas");
			ctx = canvas.getContext('2d');
			$("#logoPrettify").show();
			api.bindEvents();
			if(url){
				api.setImage(url);
				hasImage = true;
			}
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
				$("#editCanvas").width(    ($(".body-container").width()) * 0.8    ) ;
				$("#editCanvas").height(    $("#editCanvas").width() / scale    ) ;
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
				$("#editPannel_1 .magicWand").on("click",function(){
					if(!hasImage)return;

				});
			};
			module.destory = function(){
				$("#editPannel_1 .fa.fa-fa-magic").off("click");
			};
			return module;
		};
		api.editPannel_4 = function(){
			var module = {};
			module.init = function(){
				if(!hasImage)return;
				$(canvas).imagecrop();
			};
			module.destory = function(){
				
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

$(
	$.fn.imagecrop = function(){
		var s = this;
		var defaults = {
			img: null,
			sx: 0,
			sy: 0,
			swidth: 100,
			sheight: 100,
			x: 0,
			y: 0,
			width: 400,
			height: 400,
			imgwidth: 0,
			imgheight: 0
		}
		var imgCrop = {
			pic:null,
			addEvent: function(selector, eventType, func){
				var proName = "";
				switch(true){
					case /^\./.test(selector) :
						proName = "className";
						selector = selector.replace(".", "");
						break;
					case /^\#/.test(selector) :
						proName = "id";
						selector = selector.replace("#", "");
						break;
					default: 
						proName = "tagName";
				}
				document.body.addEventListener(eventType,function(e){
						function check(node){
							if(! node.parentNode) return;

							if(node[proName] == selector){
								func.call(node, e);
							};
							check(node.parentNode);
						}
						check(e.target);
				}, false);
			},
			eventAtt:function(){
			},
			init:function(canvasObj){
				var _this = this;
				window.onload=function(){
					_this.initView();
					_this.eventAtt();
				}
				
			},
			initView:function(){
				var _this = this;
				
				function cropInit(){
					var crop = document.createElement('canvas');
					var cropcover = document.getElementById('imgCropCover');
					console.log(s.width)
					cropcover.width = s.width + 'px';
					cropcover.height = s.height + 'px';
					cropcover.style.top = s.style.top;
					cropcover.style.left = s.style.left;
					document.getElementById('imgCrop-con').appendChild(crop);
					
					crop.width = defaults.swidth;
					crop.height = defaults.sheight;
					crop.style.left = '0';
					crop.style.top = '0';
					
					var imageClone = new Image();
								
					imageClone.onload = function(){				
						var cropCtx = crop.getContext('2d');
						cropCtx.drawImage(imageClone, 0, 0, defaults.swidth, defaults.swidth, 0, 0, defaults.swidth, defaults.sheight);
						
						_this.dropCrop(crop,cropCtx);
					}
					imageClone.src = imageObj.src;
					defaults.img = imageClone;
					
				}
				cropInit();
			},
			dropCrop:function(crop,cropCtx){
				var clickFlag = 0, dx, dy, left, top;
				var moveele = document.getElementById('imgCrop-con');
				
				this.addEvent("#imgCrop-cover", "mousedown", function(e){			
					
					dx = e.clientX;
					dy = e.clientY;
					
					left = parseInt(moveele.style.left == '' ? 0 : moveele.style.left);
					top = parseInt(moveele.style.top == '' ? 0 : moveele.style.top);
					clickFlag = 1;
				});
				this.addEvent("#imgCrop-cover", "mouseup", function(e){
					clickFlag = 0;
				});

				document.getElementById("imgCrop-cover").onmousemove = function(e){
					
					var x = e.clientX;
					var y = e.clientY;

					if(clickFlag){
					
						if(e.target.tagName.toLowerCase() == "canvas"){
							var pic = moveele;
							var x = e.clientX;
							var y = e.clientY;

							var rLeft = left + (x - dx);
							var rTop = top + (y - dy);
							if(rLeft < 0) rLeft = 0;
							if(rTop < 0) rTop = 0;

							pic.style.left = rLeft + "px";
							pic.style.top = rTop + "px";
							
							var nleft = rLeft*defaults.imgwidth/defaults.width,
								ntop = rTop*defaults.imgheight/defaults.height;
							
							cropCtx.drawImage(defaults.img, rLeft , rTop, defaults.swidth, defaults.sheight, 0, 0, defaults.swidth, defaults.sheight);
						}else{
							var currentClass = e.target.className;
							
						}
						
						
					}
				};

			}
		}
		s.init = function(canvasObj){
			imgCrop.init(canvasObj);
		}
		return s;
	}()
);
