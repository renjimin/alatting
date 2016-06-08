$(function(){
	$.fn.logoPrettify = function(){
		var api = {};
		var canvas,selectCanvas,ctx,currentPannel,hasImage;

		api.init = function(url){
			canvas = document.getElementById("editCanvas");
			ctx = canvas.getContext('2d');
			selectCanvas = document.getElementById("selectCanvas");
			if( !canvas.originCanvas )canvas.originCanvas = document.createElement("canvas");
			
			$("#logoPrettify").show();
			api.bindEvents();
			if(url && !hasImage ){
				api.setImage(url);
				hasImage = true;
			}
		};
		api.destory = function(){
			$(".closeLogoPrettify").off("click");
			$(".editMenuGroup button").off("click");
			$("#logoPrettify").hide();
			
			if(api[currentPannel] && api[currentPannel].destory)api[currentPannel].destory();
			currentPannel = null;
			$("#logoPrettify .editMenuGroup section").hide();
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
			var 	scale = width/height;
			if(scale>1){
				$("#editCanvas").width(    ($(".body-container").width()) * 0.8    ) ;
				$("#editCanvas").height(    $("#editCanvas").width() / scale    ) ;
			}else{
				$("#editCanvas").height(    ($(".body-container").height() - 220) * 0.8    ) ;
				$("#editCanvas").width(    $("#editCanvas").height() * scale    ) ;
			}
			$("#selectCanvas").width($("#editCanvas").width());
			$("#selectCanvas").height($("#editCanvas").height());
			$("#selectCanvas").css("top",$("#editCanvas").offset().top);
			$("#selectCanvas").css("left",$("#editCanvas").offset().left);
			canvas.originCanvas.width = selectCanvas.width = canvas.width = $("#editCanvas").width();
			canvas.originCanvas.height = selectCanvas.height = canvas.height = $("#editCanvas").height();
			ctx.drawImage(image,0,0,width,height,0,0,$("#editCanvas").width(),$("#editCanvas").height());
			canvas.originCanvas.getContext("2d").putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0 , 0);
			hasImage = true;
		};
		api.uploadImage = function(){
			
		};
		api.editPannel_1 = function(){
			var module = {};
			module.init = function(){
				$("#editPannel_1 .magicWand").on("click",function(){
					if(!hasImage)return;
					$.fn.magicWand.active();
				});
				$("#editPannel_1 .deleteSelection").on("click",function(){
					if(!hasImage)return;
					$.fn.Selection.deleteSelectedPixels();
				});
			};
			module.destory = function(){
				$("#editPannel_1 .magicWand").off("click");
				$("#editPannel_1 .deleteSelection").off("click");
				$.fn.magicWand.deactive();
			};
			return module;
		}();
		api.editPannel_2 = function(){
			var module = {};
			module.init = function(){
				$.fn.imgFilter.init(canvas);
				/*$.fn.imgFilter.invertColor(canvas,document.getElementById('invertColor'));
				$.fn.imgFilter.grayColor(canvas,document.getElementById('grayColor'));
				$.fn.imgFilter.rilievo(canvas,document.getElementById('rilievo'));
				$.fn.imgFilter.mirror(canvas,document.getElementById('mirror'));
				$("#editPannel_2 canvas").on("click",function(e){
					switch(e.target.id){
						case "invertColor":
							$.fn.imgFilter.invertColor(canvas,canvas);
							break;
						case "grayColor":
							$.fn.imgFilter.grayColor(canvas,canvas);
							break;
						case "rilievo":
							$.fn.imgFilter.rilievo(canvas,canvas);
							break;
						case "mirror":
							$.fn.imgFilter.mirror(canvas,canvas);
							break;
					}
				});*/
			};
			module.destory = function(){
				$("#editPannel_2 canvas").off("click");
			};
			return module;
		}();
		api.editPannel_4 = function(){
			var module = {};
			module.init = function(){
				if(!hasImage)return;
				$.fn.imagecrop.init(canvas);
				$('#cropConfirm').on('click',function(){
					$.fn.imagecrop.cropSave();
				});
				$('#cropCancel').on('click',function(){
					$.fn.imagecrop.destory();
				});
			};
			module.destory = function(){
				$.fn.imagecrop.destory();
			};
			return module;
		}();
		api.editPannel_5 = function(){
			var module = {};
			var isClearing = false;

			module.init = function(){
				if(!hasImage)return;
				$.fn.imgFilter1.blur(canvas.originCanvas,canvas);
				$("#selectCanvas").on("mousedown touchstart",function(){
					isClearing = true;
				});
				$("#selectCanvas").on("mousemove touchmove",function(e){
					if( !isClearing )return;
					var x = e.clientX||e.originalEvent.touches[0].clientX,
						y = e.clientY||e.originalEvent.touches[0].clientY,
						pos = $.fn.canvasHelper.windowToCanvas(x, y, canvas);
					ctx.putImageData(canvas.originCanvas.getContext("2d").getImageData(pos.x-10, pos.y-10, 20, 20), pos.x-10,  pos.y-10);
				});
				$("#selectCanvas").on("mouseup touchend",function(){
					isClearing = false;
				});
			};
			module.destory = function(){
				isClearing = false;
				$("#selectCanvas").off("mousedown touchstart");
				$("#selectCanvas").off("mousemove touchmove");
				$("#selectCanvas").off("mouseup touchend");
			};
			return module;
		}();

		return api;
	}();
});

$(function(){
	$.fn.marchingAnts = function(){
		var api = {};
		api.antsInterval = null;
		api.selectedOutline = null;
		
		api.createContext = function(width, height) {
			var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");
			canvas.width = width;
			canvas.height = height;
			return context;
		};
		api.createOutlineMask = function(srcImageData, threshold) {
			var srcData = srcImageData.data;
			var width = srcImageData.width,
				height = srcImageData.height;

			function get(x, y) {
				if (x < 0 || x >= width || y < 0 || y >= height) return;
				var offset = ((y * width) + x) * 4;
				return srcData[offset + 3];
			}

			var context = this.createContext(width, height);
			var dstImageData = context.getImageData(0, 0, width, height);
			var dstData = dstImageData.data;

			function set(x, y, value) {
				var offset = ((y * width) + x) * 4;
				dstData[offset + 0] = value;
				dstData[offset + 1] = value;
				dstData[offset + 2] = value;
				dstData[offset + 3] = 0xFF;
			}
			function match(x, y) {
				var alpha = get(x, y);
				return alpha == null || alpha >= threshold;
			}
			function isEdge(x, y) {
				return !match(x - 1, y - 1) || !match(x + 0, y - 1) || !match(x + 1, y - 1) || !match(x - 1, y + 0) || false || !match(x + 1, y + 0) || !match(x - 1, y + 1) || !match(x + 0, y + 1) || !match(x + 1, y + 1);
			}
			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					if (match(x, y) && isEdge(x, y)) {
						set(x, y, 0x00);
					} else {
						set(x, y, 0xFF);
					}
				}
			}
			return dstImageData;
		};
		api.ant = function(x, y, offset) {
			return ((6 + y + offset % 12) + x) % 12 > 6 ? 0x00 : 0xFF;
		};
		api.renderMarchingAnts = function(imageData, outlineMask, antOffset) {
			var data = imageData.data;
			var width = imageData.width,
				height = imageData.height;
			var outline = outlineMask.data;
			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					var offset = ((y * width) + x) * 4;
					var isEdge = outline[offset] == 0x00;

					if (isEdge) {
						var value = this.ant(x, y, antOffset);
						data[offset + 0] = value;
						data[offset + 1] = value;
						data[offset + 2] = value;
						data[offset + 3] = 0xFF;
					} else {
						data[offset + 3] = 0x00;
					}
				}
			}
			return imageData;
		};
		api.ants = function(canvas, imageData){
			var self = this;
			var context = canvas.getContext("2d");
			var offset = 0;
			self.selectedOutline = self.createOutlineMask(imageData, 0xC0);

			clearInterval(this.antsInterval);
			self.antsInterval = setInterval(function() {
				context.putImageData(self.renderMarchingAnts(imageData, self.selectedOutline, offset -= 2), 0, 0);
			}, 167);
		};
		api.deselect = function(){
			clearInterval(this.antsInterval);
		};
		return api;
	}();
});

$(function(){
	$.fn.selectionBuilder = function(src, point, tolerance, contiguous){
		// count for debug
		// this.count = 0;
		this.contiguous = contiguous;

		this.srcData = src.data;
		this.width = src.width;
		this.height = src.height;
		this.pickedPoint = {
			x: point.x,
			y: point.y
		};
		this.visited = [];
		this.marked = [];
		this.visited.length = this.marked.length = this.width * this.height;
		//this._initializeVisited();

		// Assume 8-bit image for simplicity for now
		this.tolerance = 256 * tolerance;
		this.stack = [];
	};
	$.fn.selectionBuilder.prototype.mask = function(callback) {
		var self = this;
		var worker = new Worker(window.location.origin + "/static/poster/plugins/logoPrettify/selection_builder.worker.js");
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var imgData = context.createImageData(self.width, self.height);
		worker.onmessage = function(e) {
			callback(e.data);
		};
		worker.onerror = function(event) {
			throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
		};
		worker.postMessage({
			contiguous: self.contiguous,
			tolerance: self.tolerance,
			pickedPoint: self.pickedPoint,
			srcData: self.srcData,
			desData: imgData,
			width: self.width,
			height: self.height
		});
	};
});

$(function(){
	$.fn.magicWand = function(){
		var api = {};
		var marchingAnts = $.fn.marchingAnts;
		var SelectionBuilder = $.fn.selectionBuilder;
		api.tolerance = 32/255;
		api.contiguous = true;

		api.active = function(){
			$("#selectCanvas").off("click").on("click",function(e){
				api.buildSelection(e);
			});
			$(".editCanvasContainer").off("click").on("click",function(e){
				if(document.getElementById("selectCanvas").selectedPixels)api.destorySelection();
			});
		};
		api.deactive = function(){
			$("#selectCanvas").off("click");
			api.destorySelection();
		};
		api.buildSelection = function(e){
			var canvas = document.getElementById("editCanvas");
			var canvasContext = canvas.getContext('2d');
			var selectionCanvas = document.getElementById("selectCanvas");
			var selectionContext = selectionCanvas.getContext('2d');
			var point = $.fn.canvasHelper.windowToCanvas(e.clientX, e.clientY, canvas);
			var src = canvasContext.getImageData(0, 0, canvas.width, canvas.height);

			marchingAnts.deselect();
			selectionContext.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
			var builder = new SelectionBuilder(src, point, api.tolerance, api.contiguous);
			builder.mask(function(selectedPixels) {
				selectionCanvas.selectedPixels = selectedPixels;
				var pixels = $.fn.canvasHelper.scaleImageData(selectedPixels, selectionCanvas.width, selectionCanvas.height);
				marchingAnts.ants(selectionCanvas, pixels);
			});
		};
		api.destorySelection = function(){
			var selectionCanvas = document.getElementById("selectCanvas");
			var selectionContext = selectionCanvas.getContext('2d');
			marchingAnts.deselect();
			selectionContext.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
			selectionCanvas.selectedPixels = null;
		};
		return api;
	}();
});

$(function(){
	$.fn.Selection = function(){
		var api = {};

		api.deleteSelectedPixels = function() {
			var canvas = document.querySelector('#editCanvas');
			var ctx = canvas.getContext('2d');
			var selectionCanvas = document.querySelector('#selectCanvas');
			if(!selectionCanvas.selectedPixels) return;

			var w = canvas.width;
			var h = canvas.height;
			var displayW = selectionCanvas.width;
			var displayH = selectionCanvas.height;

			var tempCanvas = document.createElement('canvas');
			var tempContext = tempCanvas.getContext('2d');
			tempCanvas.width = w;
			tempCanvas.height = h;
			tempContext.putImageData(selectionCanvas.selectedPixels, 0, 0);

			ctx.save();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.drawImage(tempCanvas, 0, 0, w, h, 0, 0, displayW, displayH);
			ctx.restore();
		};
		return api;
	}();
});

$(
	$.fn.imagecrop = function(){
		var api = {},canvas,cropCanvas;
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
				canvas = canvasObj;
				var image = new Image();
				image.src = canvas.toDataURL("image/png");

				defaults.img = image

				_this.initView();
				_this.eventAtt();
				
			},
			initView:function(){
				var _this = this;
				
				function cropInit(){
					var cropcover = document.getElementById('imgCropCover'),
					cropCon = document.getElementById('imgCrop-con');
					
					if(cropCanvas == undefined){
						cropCanvas = document.createElement('canvas');
						cropCon.appendChild(cropCanvas);

					}
					
					cropcover.style.width = canvas.style.width;
					cropcover.style.height = canvas.style.height;
					cropcover.style.top = canvas.offsetTop == "" ? 0 :  canvas.offsetTop+ 'px';
					cropcover.style.left = canvas.offsetLeft == "" ? 0 :  canvas.offsetLeft + 'px';

					cropCanvas.width = defaults.swidth;
					cropCanvas.height = defaults.sheight;
					cropCanvas.style.left = cropCon.style.left = '0';
					cropCanvas.style.top = cropCon.style.top = '0';
					cropcover.style.display = "block";
					/* 画裁剪图 */
					var imageClone = defaults.img;
					var cropCtx = cropCanvas.getContext('2d');

					var bbox = canvas.getBoundingClientRect();
					var scale = bbox.width/canvas.width;
					cropCtx.drawImage(imageClone, 0, 0, defaults.swidth/scale, defaults.sheight/scale, 0, 0, defaults.swidth, defaults.sheight);
					
					_this.dropCrop(cropCanvas,cropCtx);

					
				}
				cropInit();
			},
			closeCrop:function(){
				var cropcover = document.getElementById('imgCropCover');
				cropcover.style.display = "none";
			},
			dropCrop:function(crop,cropCtx){
				var dx, dy, left, top;
				var moveele = $("#imgCrop-con")[0];
				var bbox = canvas.getBoundingClientRect();
				var scale = canvas.width/bbox.width;
				$("#imgCrop-con").find('canvas').on({
					 'touchstart':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];
						dx = touch.clientX;
						dy = touch.clientY;						
						left = parseInt(moveele.style.left == '' ? 0 : moveele.style.left);
						top = parseInt(moveele.style.top == '' ? 0 : moveele.style.top);
					},
					'touchmove':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];
						
						var pic = moveele;
						var x = touch.clientX;
						var y = touch.clientY;

						var rLeft = left + (x - dx);
						var rTop = top + (y - dy);
						if(rLeft < 0) rLeft = 0;
						if(rTop < 0) rTop = 0;
						if(rLeft > parseInt(canvas.style.width) - pic.offsetWidth) rLeft = parseInt(canvas.style.width) - pic.offsetWidth;
						if(rTop > parseInt(canvas.style.height) - pic.offsetHeight) rTop = parseInt(canvas.style.height) - pic.offsetHeight;

						pic.style.left = rLeft + "px";
						pic.style.top = rTop + "px";						

						defaults.x = rLeft*scale;
						defaults.y = rTop*scale;
						cropCtx.clearRect(0,0,defaults.swidth*scale,defaults.sheight*scale);
						cropCtx.drawImage(defaults.img, defaults.x , defaults.y, defaults.swidth*scale, defaults.sheight*scale, 0, 0, defaults.swidth, defaults.sheight);

					}
				});
				/* 1 */
				var width,height;
				$("#imgCrop-con").find('.imgCrop-bar-1').on({
					 'touchstart':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];
						dx = touch.clientX;
						dy = touch.clientY;
						left = parseInt(moveele.style.left == '' ? 0 : moveele.style.left);
						top = parseInt(moveele.style.top == '' ? 0 : moveele.style.top);
						width = defaults.swidth;height = defaults.sheight;
					},
					'touchmove':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];						
						var x = touch.clientX;
						var y = touch.clientY;						

						var rLeft = left + (x - dx);
						var rTop = top + (y - dy);
						if(rLeft < 0) rLeft = 0;
						if(rTop < 0) rTop = 0;
						if(rLeft > parseInt(canvas.style.width) - moveele.offsetWidth) rLeft = parseInt(canvas.style.width) - moveele.offsetWidth;
						if(rTop > parseInt(canvas.style.height) - moveele.offsetHeight) rTop = parseInt(canvas.style.height) - moveele.offsetHeight;
						defaults.swidth = width - (x - dx);
						defaults.sheight = height - (y - dy);
						if(defaults.swidth > parseInt(canvas.style.width)) defaults.swidth = parseInt(canvas.style.width);
						if(defaults.sheight > parseInt(canvas.style.height)) defaults.sheight = parseInt(canvas.style.height);

						crop.width = defaults.swidth;
						crop.height = defaults.sheight;
						moveele.style.left = rLeft + "px";
						moveele.style.top = rTop + "px";						

						defaults.x = rLeft*scale;
						defaults.y = rTop*scale;
						cropCtx.clearRect(0,0,defaults.swidth*scale,defaults.sheight*scale);
						cropCtx.drawImage(defaults.img, defaults.x , defaults.y, defaults.swidth*scale, defaults.sheight*scale, 0, 0, defaults.swidth, defaults.sheight);

					}
				});
				/* 2 */
				$("#imgCrop-con").find('.imgCrop-bar-2').on({
					 'touchstart':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];
						dx = touch.clientX;
						dy = touch.clientY;
						left = parseInt(moveele.style.left == '' ? 0 : moveele.style.left);
						top = parseInt(moveele.style.top == '' ? 0 : moveele.style.top);
						width = defaults.swidth;height = defaults.sheight;
					},
					'touchmove':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];						
						var x = touch.clientX;
						var y = touch.clientY;						

						var rLeft = left;
						var rTop = top + (y - dy);
						if(rLeft < 0) rLeft = 0;
						if(rTop < 0) rTop = 0;
						if(rLeft > parseInt(canvas.style.width) - moveele.offsetWidth) rLeft = parseInt(canvas.style.width) - moveele.offsetWidth;
						if(rTop > parseInt(canvas.style.height) - moveele.offsetHeight) rTop = parseInt(canvas.style.height) - moveele.offsetHeight;
						defaults.swidth = width + (x - dx);
						defaults.sheight = height - (y - dy);
						if(defaults.swidth > parseInt(canvas.style.width)) defaults.swidth = parseInt(canvas.style.width);
						if(defaults.sheight > parseInt(canvas.style.height)) defaults.sheight = parseInt(canvas.style.height);

						crop.width = defaults.swidth;
						crop.height = defaults.sheight;
						moveele.style.left = rLeft + "px";
						moveele.style.top = rTop + "px";						

						defaults.x = rLeft*scale;
						defaults.y = rTop*scale;
						cropCtx.clearRect(0,0,defaults.swidth*scale,defaults.sheight*scale);
						cropCtx.drawImage(defaults.img, defaults.x , defaults.y, defaults.swidth*scale, defaults.sheight*scale, 0, 0, defaults.swidth, defaults.sheight);

					}
				});
				/* 3 */
				$("#imgCrop-con").find('.imgCrop-bar-3').on({
					 'touchstart':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];
						dx = touch.clientX;
						dy = touch.clientY;
						left = parseInt(moveele.style.left == '' ? 0 : moveele.style.left);
						top = parseInt(moveele.style.top == '' ? 0 : moveele.style.top);
						width = defaults.swidth;height = defaults.sheight;
					},
					'touchmove':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];						
						var x = touch.clientX;
						var y = touch.clientY;						

						var rLeft = left;
						var rTop = top;
						if(rLeft < 0) rLeft = 0;
						if(rTop < 0) rTop = 0;
						if(rLeft > parseInt(canvas.style.width) - moveele.offsetWidth) rLeft = parseInt(canvas.style.width) - moveele.offsetWidth;
						if(rTop > parseInt(canvas.style.height) - moveele.offsetHeight) rTop = parseInt(canvas.style.height) - moveele.offsetHeight;
						defaults.swidth = width + (x - dx);
						defaults.sheight = height + (y - dy);
						if(defaults.swidth > parseInt(canvas.style.width)) defaults.swidth = parseInt(canvas.style.width);
						if(defaults.sheight > parseInt(canvas.style.height)) defaults.sheight = parseInt(canvas.style.height);

						crop.width = defaults.swidth;
						crop.height = defaults.sheight;
						moveele.style.left = rLeft + "px";
						moveele.style.top = rTop + "px";						

						defaults.x = rLeft*scale;
						defaults.y = rTop*scale;
						cropCtx.clearRect(0,0,defaults.swidth*scale,defaults.sheight*scale);
						cropCtx.drawImage(defaults.img, defaults.x , defaults.y, defaults.swidth*scale, defaults.sheight*scale, 0, 0, defaults.swidth, defaults.sheight);

					}
				});
				/* 4 */
				$("#imgCrop-con").find('.imgCrop-bar-4').on({
					 'touchstart':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];
						dx = touch.clientX;
						dy = touch.clientY;
						left = parseInt(moveele.style.left == '' ? 0 : moveele.style.left);
						top = parseInt(moveele.style.top == '' ? 0 : moveele.style.top);
						width = defaults.swidth;height = defaults.sheight;
					},
					'touchmove':function(e){
						if (e.originalEvent) e = e.originalEvent;
						e.preventDefault();
						var touch = e.touches[0];						
						var x = touch.clientX;
						var y = touch.clientY;						

						var rLeft = left + (x - dx);
						var rTop = top;
						if(rLeft < 0) rLeft = 0;
						if(rTop < 0) rTop = 0;
						if(rLeft > parseInt(canvas.style.width) - moveele.offsetWidth) rLeft = parseInt(canvas.style.width) - moveele.offsetWidth;
						if(rTop > parseInt(canvas.style.height) - moveele.offsetHeight) rTop = parseInt(canvas.style.height) - moveele.offsetHeight;
						defaults.swidth = width - (x - dx);
						defaults.sheight = height + (y - dy);
						if(defaults.swidth > parseInt(canvas.style.width)) defaults.swidth = parseInt(canvas.style.width);
						if(defaults.sheight > parseInt(canvas.style.height)) defaults.sheight = parseInt(canvas.style.height);

						crop.width = defaults.swidth;
						crop.height = defaults.sheight;
						moveele.style.left = rLeft + "px";
						moveele.style.top = rTop + "px";						

						defaults.x = rLeft*scale;
						defaults.y = rTop*scale;
						cropCtx.clearRect(0,0,defaults.swidth*scale,defaults.sheight*scale);
						cropCtx.drawImage(defaults.img, defaults.x , defaults.y, defaults.swidth*scale, defaults.sheight*scale, 0, 0, defaults.swidth, defaults.sheight);

					}
				});

			}
		}
		api.init = function(canvasObj){			
			imgCrop.init(canvasObj);
		}
		api.cropSave = function(){
			var src = cropCanvas.toDataURL("image/png");
			var canvasCtx = canvas.getContext('2d');
			var cropCanvasCtx = cropCanvas.getContext('2d');


			var imgData = cropCanvasCtx.getImageData(0,0,cropCanvas.width,cropCanvas.height);
			canvas.width = cropCanvas.width;
			canvas.height = cropCanvas.height;
			canvas.style.width = cropCanvas.width + 'px';
			canvas.style.height = cropCanvas.height + 'px';
			canvasCtx.putImageData(imgData,0,0);

			//convasCtx.drawImage(defaults.img, 0 , 0, defaults.swidth*scale, defaults.sheight*scale, 0, 0, defaults.swidth, defaults.sheight);
		}
		api.destory = function(){
			imgCrop.closeCrop();
		}
		
		return api;
	}()
);
$(function(){
	$.fn.imgFilter = function(){
		var api = {},canvas,pic,_img;
		api.init = function(canvasObj){
			canvas = canvasObj;
			_img = new Image();
			_img.onload = function(){
				pic = AlloyImage(this);
				api.initView();
			}
			_img.src = canvas.toDataURL("image/png");			
		}
		api.initView = function(){
			var filterBox = document.getElementById('fliterList').getElementsByTagName('ul')[0];
			var EasyReflection = {
				"美肤" : "softenFace",
				"素描" : "sketch",
				"自然增强" : "softEnhancement",
				"紫调" : "purpleStyle",
				"柔焦" : "soften",
				"复古" : "vintage",
				"黑白" : "gray",
				"仿lomo" : "lomo",
				"亮白增强" : "strongEnhancement",
				"灰白" : "strongGray",
				"灰色" : "lightGray",
				"暖秋" : "warmAutumn",
				"木雕" : "carveStyle",
				"粗糙" : "rough"
			};
			var effectModel = '<li class="e_item"><a class="imglink"><img src="{pic}" alt="" /><span>{effect}</span></a></li>';
			var html = '<li class="e_item"><a class="imglink"><img src="'+_img.src+'" alt="" /><span>原图</span></a></li>';
			for(var i in EasyReflection){
				var cloneImg = new Image(),
				PS = pic.clone();
				PS.ps(i).replace(cloneImg).complete(function(){
					var newSrc = cloneImg.src;
					html += effectModel.replace("{effect}",i.length < 3 ? i + "" : i).replace("{pic}", newSrc); 
				});
				
			}

			filterBox.innerHTML = html;
			var canvasCtx = canvas.getContext('2d');
			$('.e_item').on('click',function(){
				var img = $(this).find('img')[0];
				canvasCtx.drawImage(img,0,0);
			});
			

		}
		return api;
	}();
});
$(function(){
	$.fn.imgFilter1 = function(){
		var api = {};

		api.invertColor = function(source,target){
			helper(source,target,function(binaryData,len){
				for (var i = 0; i < len; i += 4) {  
					var r = binaryData[i];  
					var g = binaryData[i + 1];  
					var b = binaryData[i + 2];  
		
					binaryData[i] = 255-r;  
					binaryData[i + 1] = 255-g;  
					binaryData[i + 2] = 255-b;  
				}
			});
		};
		api.grayColor = function(source,target){  
			helper(source,target,function(binaryData,len){
				for (var i = 0; i < len; i += 4) {  
					var r = binaryData[i];  
					var g = binaryData[i + 1];  
					var b = binaryData[i + 2];  
		
					binaryData[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);
					binaryData[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
					binaryData[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);  
				}
			});
		};
		api.rilievo = function(source,target){
			helper(source,target,function(binaryData,len,w,h){
				for ( var x = 1; x < w-1; x++) { 
					for ( var y = 1; y < h-1; y++) { 
						var idx = (x + y * w) * 4; 
						var bidx = ((x-1) + y * w) * 4; 
						var aidx = ((x+1) + y * w) * 4; 
						var nr = binaryData[bidx + 0] - binaryData[aidx + 0] + 128; 
						var ng = binaryData[bidx + 1] - binaryData[aidx + 1] + 128; 
						var nb = binaryData[bidx + 2] - binaryData[aidx + 2] + 128; 
						nr = (nr < 0) ? 0 : ((nr >255) ? 255 : nr); 
						ng = (ng < 0) ? 0 : ((ng >255) ? 255 : ng); 
						nb = (nb < 0) ? 0 : ((nb >255) ? 255 : nb); 
						binaryData[idx + 0] = nr;
						binaryData[idx + 1] = ng;
						binaryData[idx + 2] = nb;
						binaryData[idx + 3] = 255;
					}
				}
			});
		};
		api.mirror = function(source,target){
			helper(source,target,function(binaryData,len,w,h){
				var tempCanvasData = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;  
				for ( var x = 0; x < w; x++){ 
					for ( var y = 0; y < h; y++){ 
						var idx = (x + y * w) * 4; 
						var midx = (((w -1) - x) + y * w) * 4; 
						binaryData[midx + 0] = tempCanvasData[idx + 0];
						binaryData[midx + 1] = tempCanvasData[idx + 1]; 
						binaryData[midx + 2] = tempCanvasData[idx + 2];
						binaryData[midx + 3] = 255;
					} 
				} 
			});
		};
		api.blur = function(source,target){
			helper(source,target,function(binaryData,len,w,h){
				var tempCanvasData = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;  
				var sumred = 0.0, sumgreen = 0.0, sumblue = 0.0;  
				for ( var x = 0; x < w; x++){
					for ( var y = 0; y < h; y++){ 
						var idx = (x + y * w) * 4;         
						for(var subCol=-3; subCol<=3; subCol++) {  
							var colOff = subCol + x;  
							if(colOff <0 || colOff >= w) {  
								colOff = 0;  
							}  
							for(var subRow=-3; subRow<=3; subRow++) {
								var rowOff = subRow + y;  
								if(rowOff < 0 || rowOff >= h) {  
									rowOff = 0;  
								}  
								var idx2 = (colOff + rowOff * w) * 4;      
								var r = tempCanvasData[idx2 + 0];      
								var g = tempCanvasData[idx2 + 1];      
								var b = tempCanvasData[idx2 + 2];  
								sumred += r;  
								sumgreen += g;  
								sumblue += b;  
							}  
						}  
						var nr = (sumred / 25.0);  
						var ng = (sumgreen / 25.0);  
						var nb = (sumblue / 25.0); 
						sumred = 0.0;  
						sumgreen = 0.0;  
						sumblue = 0.0;
						binaryData[idx + 0] = nr;
						binaryData[idx + 1] = ng;
						binaryData[idx + 2] = nb;
						binaryData[idx + 3] = 255;
					}
				}
			});
		};
		function helper(source,target,rgbHandler){
			var canvas = source; 
			var ctx = canvas.getContext("2d");
			var len = canvas.width * canvas.height * 4;  
			var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);  
			var binaryData = canvasData.data;
			rgbHandler(binaryData,len,canvas.width, canvas.height);
			canvasData = $.fn.canvasHelper.scaleImageData(canvasData,target.width,target.height);
			target.getContext("2d").putImageData(canvasData, 0, 0);  
		}
		function copyImageData(context, src) { 
			var dst = context.createImageData(src.width, src.height); 
			dst.data.set(src.data); 
			return dst; 
		}
		return api;
	}();
});

$(function(){
	$.fn.canvasHelper = function(){
		var api = {};

		api.scaleImageData = function(data, w, h){
			var dataW = data.width;
			var dataH = data.height;
			var dataCanvas = document.createElement('canvas');
			var dataContext = dataCanvas.getContext('2d');
			dataCanvas.width = dataW;
			dataCanvas.height = dataH;
			dataContext.putImageData(data, 0, 0);
			var tempCanvas = document.createElement('canvas');
			var tempContext = tempCanvas.getContext('2d');
			tempCanvas.width = w;
			tempCanvas.height = h;
			tempContext.drawImage(dataCanvas, 0, 0, dataW, dataH, 0, 0, w, h);
			return tempContext.getImageData(0, 0, w, h);
		};
		api.windowToCanvas = function(x,y,canvas){
			var bbox = canvas.getBoundingClientRect();
			return { x: Math.round((x - bbox.left) * (canvas.width  / bbox.width)),
					y: Math.round((y - bbox.top)  * (canvas.height / bbox.height))
				};
		};
		return api;
	}();
});
