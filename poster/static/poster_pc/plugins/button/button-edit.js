var currentElebox = null,isEdit = false,fullcontainer=$('.yunye-template').eq(0);
var curentOpts={};
setTimeout(function(){
		fullcontainer=$('.yunye-template').eq(0);var templateScale = $('.edit-body').width()/$('.yunye-template').width();
		addDefaultButtons();/**/
},100);

		var addButton = function(ele,options){
				
				var defaults = {
						'buttonAction':'0',
						'href':'javascript:void(0)',
						'text':'请输入文字',
						'color':'000',
						'fontSize':14,
						'fontFamily':'Microsoft YaHei',
						'background':'ffffff',
						'backgroundOpacity':'1',
						'opacity':'1',
						'boxShadow':'0',
						'borderRadius':'3',
						'rotate':'0',
						'borderColor':'ffffff',
						'borderStyle':'solid',
						'borderWidth':'1',
						'height':'34'/*默认高度*/
				}

				var opts = $.extend(defaults,options),s = this;
				s.reset = function(){
						var imgactive = $('.button-element.actived');
						s.upload(imgactive.find('.btn'));
				}
				s.add = function(){
						isEdit = false;
						$('.cnd-element').removeClass('actived');
						var newbtn = $('<a class="element btn btn-default">请输入文字</a>');
						var cnd = $('<div class="cnd-element button-element actived" data-type="button">'
								+'<div class="element-box">'
								+'    <div class="element-box-contents">'
								+'        '
								+'    </div>'
								+'</div>'
								+'<div class="nbar nbar-rotate nbar-radius"></div>'
								+'<div class="nbar nbar-line"></div>'
								+'<div class="nbar nbar-n"><div class="nbar-radius"></div></div>'
								+'<div class="nbar nbar-s"><div class="nbar-radius"></div></div>'
								+'<div class="nbar nbar-e"><div class="nbar-radius"></div></div>'
								+'<div class="nbar nbar-w"><div class="nbar-radius"></div></div>'
								+'<div class="nbar nbar-nw nbar-radius"></div>'
								+'<div class="nbar nbar-se nbar-radius"></div>'
								+'<div class="nbar nbar-sw nbar-radius"></div>'
								+'<div class="nbar nbar-ne nbar-radius"></div>'
						+'</div>');
						cnd.find('.element-box-contents').append(newbtn);
						cnd.css('opacity','0');
						
						fullcontainer.append(cnd);
						cnd.css({'z-index':scaleIndex++,'top':fullcontainer.innerHeight()/2-cnd.innerHeight()/2+'px','left':fullcontainer.innerWidth()/2-cnd.innerWidth()/2+'px'}).css('opacity','1');
						cnd.scaleable();

						s.controlInit(newbtn);
						s.upload(newbtn);
						s.addControlListen(newbtn);

				}
				s.edit = function(element){
						isEdit = true;
						var editbtn = null;
						editbtn = element.clone(false);
						defaults.container.find('.btn-container').empty().append(editbtn);
						currentElebox = element.parent();
						s.controlInit(editbtn);
						s.upload(editbtn);

				}
				$('#buttonConfirm').unbind();
				$('#buttonConfirm').on('click',function(){
						var newbtn = $("#button-model").find('.element').eq(0);
						//console.log(newbtn);
						buttonConfirm(newbtn);
				});
				s.upload = function(o){

						o.html(opts.text);
						o.attr({
								'href':opts.href.replace(/^http:\/\//i, ''),
								'data-action':opts.buttonAction
						})
						var rgb = colorRgb(opts.background);
						var back = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+opts.backgroundOpacity+')';
						o.css({
								'color':'#'+opts.color,
								'font-size':opts.fontSize/templateScale+'px',
								'font-family':opts.fontFamily,
								'background':back,
								'opacity':opts.opacity,
								'box-shadow':'0 0 '+opts.boxShadow+' #000',
								'border-radius':opts.borderRadius+'px',
								'transform':'rotate('+opts.rotate+'deg)',
								'border-color':'#'+opts.borderColor,
								'border-style':opts.borderStyle,
								'border-width':opts.borderWidth+'px',
						});
				}
				s.controlInit = function(b){
						if(typeof(b)!='undefined'){
								var reg = /(rotate\([\-\+]?((\d+)))/i;
								var wt = b.css('transform');
								if(wt==null){
										wt = '';
								}
								var wts = wt.match (reg);
								var $2 = RegExp.$2;
								if($2==null || $2 == ''){
										$2 = 0;
								}
								eleopts = {
										'buttonAction':$(b).attr('data-action'),
										'href': $(b).attr('href'),
										'text': $(b).text(),
										'color': $(b).css('color')==null?'000000':$(b).css('color'),
										'fontSize': parseInt($(b).css('font-size')),
										'fontFamily': $(b).css('font-family').replace(/'/g,""),
										'background': $(b).attr('data-background'),
										'backgroundOpacity': $(b).attr('data-backgroundOpacity'),
										'opacity': $(b).css('opacity'),
										'boxShadow':$(b).css('box-shadow-spread'),
										'borderRadius':$(b).css('border-radius'),
										'rotate':$2,
										'borderColor':$(b).css('border-color'),
										'borderStyle':$(b).css('border-style'),
										'borderWidth':$(b).css('border-width'),
										'height':$(b).innerHeight()
								}
								opts = $.extend(opts,eleopts);
						}

						if(opts.buttonAction != '0'){
								$('.button-href').attr("disabled","disabled");
								$('.button-href').parent().parent().hide();
						}else{
								$('.button-href').removeAttr("disabled");
								$('.button-href').parent().parent().show();
						}

						var href = opts.href=="javascript:void(0)"?'':opts.href;
						$('.button-action').val(opts.buttonAction);
						$('.button-href').val(href);
						$('.button-text').val(opts.text);
						$('.button-color').css('background','#'+opts.color);
						for(i=12;i<30;i++){
								$('.button-fontSize').append('<option value="'+i+'">'+i+'px</option>')
						}
						$('.button-fontSize').val(opts.fontSize);
						$('.button-fontFamily').val(opts.fontFamily);
						$('.button-background').css('background','#'+opts.background).attr('data-backgorund',opts.background);
						$('.button-opacity').val(opts.opacity*100);
						$('.button-background-opacity').val(opts.backgroundOpacity*100);
						$('.button-boxShadow').val(opts.boxShadow);
						$('.button-borderRadius').val(opts.borderRadius).attr('max','100');
						$('.button-borderColor').val(opts.borderColor);
						$('.button-borderStyle').val(opts.borderStyle);
						for(i=0;i<20;i++){
								$('.button-borderWidth').append('<option value="'+i+'">'+i+'px</option>')
						}
						$('.button-borderWidth').val(parseInt(opts.borderWidth));

				}
				s.addControlListen = function(elebtn){
						//var elebtn = $("#button-model").find('.element').eq(0);

						$('.button-href').off('input propertychange').on('input propertychange',function(){
								opts.href = $(this).val();
								elebtn.attr({'href':opts.href})
						});
						$('.button-text').off('input propertychange').on('input propertychange',function(){
								opts.text = $(this).val();
								elebtn.html(opts.text);
						});
						$('.button-action').off('change').on('change',function(){
								opts.buttonAction = $(this).val();
								elebtn.attr('data-action',opts.buttonAction);
						});
						$('.button-fontSize').off('change').on('change',function(){
								opts.fontSize = $(this).val();
								elebtn.css('font-size',opts.fontSize/templateScale+'px');
						});
						$('.button-fontFamily').off('change').on('change',function(){
								opts.fontFamily = $(this).val();
								elebtn.css('font-family',opts.fontFamily);
						});
						$('.button-borderStyle').off('change').on('change',function(){
								opts.borderStyle = $(this).val();
								elebtn.css('border-style',opts.borderStyle);
						});
						$('.button-borderWidth').off('change').on('change',function(){
								opts.borderWidth = $(this).val();
								elebtn.css('border-width',opts.borderWidth);
						});
						$('.button-borderColor').off('change').on('change',function(){
								opts.borderColor = $(this).val();
								elebtn.css('border-color','#'+opts.borderColor);
								$(this).css('background','#'+opts.borderColor);
						});
						$('.button-color').off('change').on('change',function(){
								opts.color = $(this).val();
								elebtn.css('color','#'+opts.color);
								$(this).css('background','#'+opts.color);
						});
						$('.button-background').off('change').on('change',function(){
								opts.background = $(this).val();
								var rgb = colorRgb(opts.background);
								var back = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+opts.backgroundOpacity+')';

								elebtn.css('background',back).attr('data-background',$(this).val());
								$(this).css('background','#'+opts.background);
						});

						s.touches = {
								startX: 0,
								startY: 0,
								currentX: 0,
								currentY: 0,
								diff: 0,
								value:0,
								max:100
						};
						$('.button-opacity').dragable({
								'moveable':false,
								'start':function(e){
										s.touches.startX = e.pageX;
										s.touches.value = e.target.value;
										s.touches.max = parseInt($(e.target).attr('max'));
								},
								'move':function(e){
										var _this = e.target;
										s.touches.currentX = e.pageX;
										var val = (s.touches.currentX - s.touches.startX) + parseInt(s.touches.value);
										val > s.touches.max ? val = s.touches.max : false;
										val < 0 ? val = 0 : false;
										e.target.value = val;
										$('.button-opacity').val(val);
										elebtn.css('opacity',val/100);
										opts.opacity = val;
								}
						});
						$('.button-background-opacity').dragable({
								'moveable':false,
								'start':function(e){
										s.touches.startX = e.pageX;
										s.touches.value = e.target.value;
										s.touches.max = parseInt($(e.target).attr('max'));
								},
								'move':function(e){
										var _this = e.target;
										s.touches.currentX =  e.pageX;
										_this.value = (s.touches.currentX - s.touches.startX) + parseInt(s.touches.value);
										_this.value >s.touches.max ? _this.value = s.touches.max : false;
										_this.value < 0 ? _this.value = 0 : false;
										$('.button-background-opacity').val(_this.value);
										var rgb = colorRgb(opts.background);
										var back = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+$(_this).val()/100+')';
										elebtn.css('background',back);

										opts.backgroundOpacity = $(_this).val()/100;
										elebtn.attr('data-backgroundOpacity',$(_this).val()/100);
								}
						});
						$('.button-boxShadow').dragable({
								'moveable':false,
								'start':function(e){
										s.touches.startX = e.pageX;
										s.touches.value = e.target.value;
										s.touches.max = parseInt($(e.target).attr('max'));
								},
								'move':function(e){
										var _this = e.target;
										s.touches.currentX =  e.pageX;
										_this.value = (s.touches.currentX - s.touches.startX) + parseInt(s.touches.value);
										_this.value >s.touches.max ? _this.value = s.touches.max : false;
										_this.value < 0 ? 0 : false;
										$('.button-boxShadow').val(_this.value);
										elebtn.css('box-shadow','0 0 '+$(_this).val()+'px #000');

										opts.boxShadow = $(_this).val();
								}
						});
						$('.button-borderRadius').dragable({
								'moveable':false,
								'start':function(e){
										s.touches.startX = e.pageX;
										s.touches.value = e.target.value;
										s.touches.max = parseInt($(e.target).attr('max'));
								},
								'move':function(e){
										var _this = e.target;
										s.touches.currentX =  e.pageX;
										var val = (s.touches.currentX - s.touches.startX)*s.touches.max/$(_this).width() + parseInt(s.touches.value);
										_this.value = val;
										_this.value >s.touches.max ? _this.value = s.touches.max : false;
										_this.value < 0 ? _this.value = 0 : false;
										$('.button-borderRadius').val(_this.value);
										elebtn.css('border-radius',$(_this).val()+'px');

										opts.borderRadius = _this.value;
								}
						});
						$('.button-rotate').dragable({
								'moveable':false,
								'start':function(e){
										s.touches.startX = e.pageX;
										s.touches.value = e.target.value;
										s.touches.max = parseInt($(e.target).attr('max'));
								},
								'move':function(e){
										var _this = e.target;
										s.touches.currentX =  e.pageX;
										_this.value = (s.touches.currentX - s.touches.startX) + parseInt(s.touches.value);
										_this.value >s.touches.max ? _this.value = s.touches.max : false;
										_this.value < 0 ? _this.value = 0 : false;
										$('.button-rotate').val(_this.value);
										elebtn.parents('.cnd-element').css('transform','rotate('+$(_this).val()+'deg)');

										opts.rotate = $(_this).val();
										elebtn.attr('data-rotate',$(_this).val());
								}
						});
						

				}
				if(typeof(ele)=='undefined' || ele == null){
						this.add();
				}else if(ele == 'reset'){
						this.reset();
				}else{
						this.edit(ele);
				}

				//s.addControlListen();
		}
		function posterDetail(){
				return false;
		}
		function posterOrder(){
				return false;
		}
		function addDefaultButtons(){
				if($('.sys-button').length > 0){
						$('.sys-button').each(function(){
								if($(this).find('.btn').attr('onclick') == undefined||$(this).find('.btn').attr('onclick') == ''){
										if($(this).find('.btn').attr('data-action') == '1'){
												$(this).find('.btn').attr('onclick','return posterDetail()');
										}else if($(this).find('.btn').attr('data-action') == '2'){
												$(this).find('.btn').attr('onclick','return posterOrder()');
										}else{
												 $(this).find('.btn').attr('onclick','return false');
										}
								}
						});
						return;
				}
				var g = yunyeEditorGlobal;
				var detailBtn = $('<a class="element btn btn-default" href="'+g.globalButton.detail+'" data-action="1" style="fons-size:20px">详情</a>'),
							orderBtn = $('<a class="element btn btn-default" href="'+g.globalButton.order+'" data-action="2" style="fons-size:20px">预约</a>');
				var cnd = '<div class="cnd-element button-element sys-button">'
								+'<div class="element-box">'
								+'    <div class="element-box-contents">'
								+'        '
								+'    </div>'
								+'</div>'
								+'<div class="nbar nbar-rotate nbar-radius"></div>'
								+'<div class="nbar nbar-line"></div>'
								+'<div class="nbar nbar-n"><div class="nbar-radius"></div></div>'
								+'<div class="nbar nbar-s"><div class="nbar-radius"></div></div>'
								+'<div class="nbar nbar-e"><div class="nbar-radius"></div></div>'
								+'<div class="nbar nbar-w"><div class="nbar-radius"></div></div>'
								+'<div class="nbar nbar-nw nbar-radius nbar-edit"><i class="glyphicon glyphicon-pencil"></i> </div>'
								+'<div class="nbar nbar-se nbar-radius"></div>'
								+'<div class="nbar nbar-sw nbar-radius"></div>'
								+'<div class="nbar nbar-ne nbar-radius"></div>'
						+'</div>';
				var detailBox = $(cnd),orderBox = $(cnd).clone();
				detailBox.find('.element-box-contents').append(detailBtn);
				orderBox.find('.element-box-contents').append(orderBtn);
				detailBox.css('opacity','0');orderBox.css('opacity','0');
				
				fullcontainer.append(detailBox);
				fullcontainer.append(orderBox);
				detailBox.css({'z-index':scaleIndex++,'top':fullcontainer.innerHeight()-detailBox.innerHeight() - 10+'px','left':fullcontainer.innerWidth()/2-detailBox.innerWidth() - 10+'px'}).css('opacity','1');
				detailBox.scaleable();
				orderBox.css({'z-index':scaleIndex++,'top':fullcontainer.innerHeight()-orderBox.innerHeight() -10+'px','left':fullcontainer.innerWidth()/2+10+'px'}).css('opacity','1');
				orderBox.scaleable();

		}
		
function copyButton(){
		if($('.button-element.actived').hasClass('sys-button')){
				return;
		}
		var imgclone = $('.button-element.actived').clone();
		$('.button-element').removeClass('actived');
		imgclone.stop(true,false).animate({'top':parseInt(imgclone.css('top'))+30+'px','left':parseInt(imgclone.css('left'))+30+'px'},200);
		fullcontainer.append(imgclone);
		imgclone.scaleable();
}
function deleteButton(){
		if($('.button-element.actived').hasClass('sys-button')){
				return;
		}
		var imgactive = $('.button-element.actived');

		imgactive.stop(true,false).animate({'width':'0','height':'0','top':parseInt(imgactive.css('top'))+imgactive.height()/2+'px','left':parseInt(imgactive.css('left'))+imgactive.width()/2+'px'},200,function(){
				imgactive.remove();
		});

}
function resetButton(){
		if($('.button-element.actived').hasClass('sys-button')){
				return;
		}
		var imgactive = $('.button-element.actived');

		addButton('reset');

}


function deleteElement(){
	var imgactive = null;
	$.each($('.cnd-element'),function(){
		if($(this).hasClass('active')){
			imgactive = $(this);
		}
	});
	if(imgactive == null) return;
	imgactive.stop(true,false).animate({'width':'0','height':'0','top':parseInt(imgactive.css('top'))+imgactive.height()/2+'px','left':parseInt(imgactive.css('left'))+imgactive.width()/2+'px'},200,function(){
			imgactive.remove();
	});
}
$(function(){
	document.onkeyup = function (event) {
		var e = event || window.event;
		var keyCode = e.keyCode || e.which;
		switch (keyCode) {
				case 8: /* 回退键 */
						deleteElement();
						break;
				case 46: /* 删除键 */
						deleteElement();
						break;
				default:
						break;
		}
	}
})
//十六进制颜色值的正则表达式
var reg = /^([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*16进制颜色转为RGB格式*/
function colorRgb(str){
	var sColor = str.toLowerCase();
	if(sColor && reg.test(sColor)){
		if(sColor.length === 4){
			var sColorNew = "#";
			for(var i=0; i<6; i+=2){
				sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for(var i=0; i<6; i+=2){
			sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
		}

		return {'r':sColorChange[0],'g':sColorChange[1],'b':sColorChange[2]};
	}else{
		return sColor;
	}
}
