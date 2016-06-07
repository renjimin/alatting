$(function(){
	$.fn.logoPrettify = function(){
		var api = {};
		var canvas,selectCanvas,ctx,currentPannel,hasImage;

		api.init = function(url){
			canvas = document.getElementById("editCanvas");
			selectCanvas = document.getElementById("selectCanvas");
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
				var file = this.files[0];
				var reader = new FileReader();
				reader.onload = function(){
					var url = reader.result;
					api.setImage(url);
				};
				reader.readAsDataURL(file);
			});
			$("#logoPrettify .uploadCanvas").on("click",function(){
				var image = new Image();
				image.src = canvas.toDataURL("image/png");
				return image;
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
			selectCanvas.width = canvas.width = width;
			selectCanvas.height = canvas.height = height;
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
			$("#selectCanvas").width($("#editCanvas").width());
			$("#selectCanvas").height($("#editCanvas").height());
			$("#selectCanvas").css("top",$("#editCanvas").offset().top);
			$("#selectCanvas").css("left",$("#editCanvas").offset().left);
		};
		api.uploadImage = function(){
			
		};
		api.editPannel_1 = function(){
			var module = {};
			module.init = function(){
				$("#editPannel_1 .magicWand").on("click",function(){
					if(!hasImage)return;
					$("#selectCanvas").show();
					$.fn.magicWand.active();
				});
				$("#editPannel_1 .deleteSelection").on("click",function(){
					if(!hasImage)return;
					$("#selectCanvas").hide();
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
			$("#selectCanvas").on("click",function(e){
				api.buildSelection(e);
			});
			$(".editCanvasContainer").on("click",function(e){
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
			var point = api.windowToCanvas(e.clientX, e.clientY, canvas);
			var src = canvasContext.getImageData(0, 0, canvas.width, canvas.height);

			marchingAnts.deselect();
			selectionContext.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
			var builder = new SelectionBuilder(src, point, api.tolerance, api.contiguous);
			builder.mask(function(selectedPixels) {
				selectionCanvas.selectedPixels = selectedPixels;
				var pixels = api.scaleImageData(selectedPixels, selectionCanvas.width, selectionCanvas.height);
				marchingAnts.ants(selectionCanvas, pixels);
			});
		};
		api.destorySelection = function(e){
			var selectionCanvas = document.getElementById("selectCanvas");
			var selectionContext = selectionCanvas.getContext('2d');
			marchingAnts.deselect();
			selectionContext.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
			selectionCanvas.selectedPixels = null;
		};
		api.windowToCanvas = function(x,y,canvas){
			var bbox = canvas.getBoundingClientRect();
			return { x: Math.round((x - bbox.left) * (canvas.width  / bbox.width)),
					y: Math.round((y - bbox.top)  * (canvas.height / bbox.height))
				};
		};
		api.scaleImageData = function(data, w, h) {
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
