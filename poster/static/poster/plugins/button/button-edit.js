var currentElebox = null,
	isEdit = false,
	fullcontainer = $('.yunye-template').eq(0);
var curentOpts = {};
setTimeout(function() { 
	fullcontainer = $('.yunye-template').eq(0);
	addDefaultButtons(); /**/ }, 100);

var addButton = function(ele, options) {
	var templateScale = $('body').width() / $('.yunye-template').width();

	var defaults = {
		'container': $("#button-model"),
		'buttonAction': '0',
		'href': 'javascript:void(0)',
		'text': '请输入文字',
		'color': '000',
		'fontSize': 14,
		'fontFamily': 'Microsoft YaHei',
		'background': 'ffffff',
		'backgroundOpacity': '1',
		'opacity': '1',
		'boxShadow': '0',
		'borderRadius': '3',
		'rotate': '0',
		'borderColor': 'ffffff',
		'borderStyle': 'solid',
		'borderWidth': '1',
		'height': '34' /*默认高度*/
	}

	defaults.container.addClass('open');
	var opts = $.extend(defaults, options),
		s = this;

	s.add = function() {
		isEdit = false;
		var newbtn = null;
		newbtn = $('<a class="element btn btn-default">请输入文字</a>');
		defaults.container.find('.btn-container').empty().append(newbtn);
		s.controlInit();
		s.upload(newbtn);

	}
	s.edit = function(element) {
		isEdit = true;
		var editbtn = null;
		editbtn = element.clone(false);
		defaults.container.find('.btn-container').empty().append(editbtn);
		currentElebox = element.parent();
		s.controlInit(editbtn);
		s.upload(editbtn);
	}
	$('#buttonConfirm').unbind();
	$('#buttonConfirm').on('click', function() {
		var newbtn = $("#button-model").find('.element').eq(0);
		//console.log(newbtn);
		buttonConfirm(newbtn);
	});
	s.upload = function(o) {

		o.html(opts.text);
		o.attr({
			'href': opts.href.replace(/^http:\/\//i, ''),
			'data-action': opts.buttonAction
		})
		var rgb = colorRgb(opts.background);
		var back = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opts.backgroundOpacity + ')';
		o.css({
			'color': '#' + opts.color,
			'font-size': opts.fontSize + 'px',
			'font-family': opts.fontFamily,
			'background': back,
			'opacity': opts.opacity,
			'box-shadow': '0 0 ' + opts.boxShadow + ' #000',
			'border-radius': opts.borderRadius + 'px',
			'transform': 'rotate(' + opts.rotate + 'deg)',
			'border-color': '#' + opts.borderColor,
			'border-style': opts.borderStyle,
			'border-width': opts.borderWidth + 'px',
		});
	}
	s.controlInit = function(b) {
		if (typeof(b) != 'undefined') {
			var reg = /(rotate\([\-\+]?((\d+)))/i;
			var wt = b.css('transform');
			if (wt == null) {
				wt = '';
			}
			var wts = wt.match(reg);
			var $2 = RegExp.$2;
			if ($2 == null || $2 == '') {
				$2 = 0;
			}

			eleopts = {
				'buttonAction': $(b).attr('data-action'),
				'href': $(b).attr('href'),
				'text': $(b).text(),
				'color': $(b).css('color') == null ? '000000' : $(b).css('color'),
				'fontSize': parseInt(parseInt($(b).css('font-size')) * templateScale),
				'fontFamily': $(b).css('font-family').replace(/'/g, "").split(',')[0],
				'background': $(b).attr('data-background'),
				'backgroundOpacity': $(b).attr('data-backgroundOpacity'),
				'opacity': $(b).css('opacity'),
				'boxShadow': $(b).css('box-shadow-spread'),
				'borderRadius': parseInt($(b).css('border-radius')),
				'rotate': $2,
				'borderColor': $(b).css('border-color'),
				'borderStyle': $(b).css('border-style'),
				'borderWidth': $(b).css('border-width'),
				'height': $(b).innerHeight()
			}
			opts = $.extend(opts, eleopts);
		}

		if (opts.buttonAction != '0') {
			$('.button-href').attr("disabled", "disabled");
			$('.button-href').parent().parent().hide();
		} else {
			$('.button-href').removeAttr("disabled");
			$('.button-href').parent().parent().show();
		}

		var href = opts.href == "javascript:void(0)" ? '' : opts.href;
		$('.button-action').val(opts.buttonAction);
		$('.button-href').val(href);
		$('.button-text').val(opts.text);
		$('.button-color').css('background', opts.color);
		for (i = 12; i < 30; i++) {
			$('.button-fontSize').append('<option value="' + i + '">' + i + 'px</option>')
		}
		$('.button-fontSize').val(opts.fontSize);
		$('.button-fontFamily').val(opts.fontFamily);
		$('.button-background').css('background', '#' + opts.background).attr('data-backgorund', opts.background);
		$('.button-opacity').val(opts.opacity * 100);
		$('.button-background-opacity').val(opts.backgroundOpacity * 100);
		$('.button-boxShadow').val(opts.boxShadow);
		$('.button-borderRadius').val(opts.borderRadius).attr('max', opts.height / 2);
		$('.button-borderColor').val(opts.borderColor);
		$('.button-borderStyle').val(opts.borderStyle);
		for (i = 0; i < 20; i++) {
			$('.button-borderWidth').append('<option value="' + i + '">' + i + 'px</option>')
		}
		$('.button-borderWidth').val(parseInt(opts.borderWidth));

	}
	s.addControlListen = function() {
		var elebtn = $("#button-model").find('.element').eq(0);

		$('.button-href').off('input propertychange').on('input propertychange', function() {
			opts.href = $(this).val();
			elebtn.attr({ 'href': opts.href })
		});
		$('.button-text').off('input propertychange').on('input propertychange', function() {
			opts.text = $(this).val();
			elebtn.html(opts.text);
		});
		$('.button-action').off('change').on('change', function() {
			opts.buttonAction = $(this).val();
			elebtn.attr('data-action', opts.buttonAction);
		});
		$('.button-fontSize').off('change').on('change', function() {
			opts.fontSize = $(this).val();
			elebtn.css('font-size', opts.fontSize + 'px');
		});
		$('.button-fontFamily').off('change').on('change', function() {
			opts.fontFamily = $(this).val();
			elebtn.css('font-family', opts.fontFamily);
		});
		$('.button-fontFamily,.button-fontSize').off('click').on('click', function() {
			setTimeout(function() {
				var st = $('body').scrollTop();
				$('body').animate({ scrollTop: 0 }, 0);
			}, 50);
		});
		$('.button-borderStyle').off('change').on('change', function() {
			opts.borderStyle = $(this).val();
			elebtn.css('border-style', opts.borderStyle);
		});
		$('.button-borderWidth').off('change').on('change', function() {
			opts.borderWidth = $(this).val();
			elebtn.css('border-width', opts.borderWidth);
		});
		$('.button-borderColor').off('change').on('change', function() {
			opts.borderColor = $(this).val();
			elebtn.css('border-color', '#' + opts.borderColor);
			$(this).css('background', '#' + opts.borderColor);
		});
		$('.button-color').off('change').on('change', function() {
			opts.color = $(this).val();
			elebtn.css('color', '#' + opts.color);
			$(this).css('background', '#' + opts.color);
		});
		$('.button-background').off('change').on('change', function() {
			opts.background = $(this).val();
			var rgb = colorRgb(opts.background);
			var back = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opts.backgroundOpacity + ')';

			elebtn.css('background', back).attr('data-background', $(this).val());
			$(this).css('background', '#' + opts.background);
		});

		s.touches = {
			startX: 0,
			startY: 0,
			currentX: 0,
			currentY: 0,
			diff: 0
		};
		$('.button-opacity').on({
			'touchstart': function(e) {
				if (e.originalEvent) e = e.originalEvent;
				var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
				var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			},
			'touchmove': function(e) {
				if (e.originalEvent) e = e.originalEvent;

				s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
				s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

				e.currentTarget.style.left = s.touches.currentX - s.touches.startX;
				$('.button-opacity').val($(this).val());
				elebtn.css('opacity', $(this).val() / 100)
			},
			'touchend': function(event) {
				opts.opacity = $(this).val();
			}
		});
		$('.button-background-opacity').on({
			'touchstart': function(e) {
				if (e.originalEvent) e = e.originalEvent;
				var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
				var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			},
			'touchmove': function(e) {
				if (e.originalEvent) e = e.originalEvent;

				s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
				s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

				e.currentTarget.style.left = s.touches.currentX - s.touches.startX;
				$('.button-background-opacity').val($(this).val());

				var rgb = colorRgb(opts.background);
				var back = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + $(this).val() / 100 + ')';
				elebtn.css('background', back);
			},
			'touchend': function(event) {
				opts.backgroundOpacity = $(this).val() / 100;
				elebtn.attr('data-backgroundOpacity', $(this).val() / 100);
			}
		});
		$('.button-boxShadow').on({
			'touchstart': function(e) {
				if (e.originalEvent) e = e.originalEvent;
				var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
				var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			},
			'touchmove': function(e) {
				if (e.originalEvent) e = e.originalEvent;

				s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
				s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

				e.currentTarget.style.left = s.touches.currentX - s.touches.startX;

				$('.button-boxShadow').val($(this).val());
				elebtn.css('box-shadow', '0 0 ' + $(this).val() + 'px #000');
			},
			'touchend': function(event) {
				opts.boxShadow = $(this).val();
			}
		});
		$('.button-borderRadius').on({
			'touchstart': function(e) {
				if (e.originalEvent) e = e.originalEvent;
				var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
				var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			},
			'touchmove': function(e) {
				if (e.originalEvent) e = e.originalEvent;

				s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
				s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

				e.currentTarget.style.left = s.touches.currentX - s.touches.startX;

				$('.button-borderRadius').val($(this).val());
				elebtn.css('border-radius', $(this).val() + 'px');
			},
			'touchend': function(event) {
				opts.borderRadius = $(this).val();
			}
		});
		$('.button-rotate').on({
			'touchstart': function(e) {
				if (e.originalEvent) e = e.originalEvent;
				var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
				var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			},
			'touchmove': function(e) {
				if (e.originalEvent) e = e.originalEvent;

				s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
				s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

				e.currentTarget.style.left = s.touches.currentX - s.touches.startX;

				$('.button-rotate').val($(this).val());
				elebtn.css('transform', 'rotate(' + $(this).val() + 'deg)');
			},
			'touchend': function(event) {
				opts.rotate = $(this).val();
				elebtn.attr('data-rotate', $(this).val());
			}
		});


	}
	if (typeof(ele) == 'undefined' || ele == null) {
		this.add();
	} else {
		this.edit(ele);
	}

	s.addControlListen();
}

function posterDetail() {
	return false;
}

function posterOrder() {
	return false;
}

function addDefaultButtons() {
	if ($('.sys-button').length > 0) {
		$('.sys-button').each(function() {
			if ($(this).find('.btn').attr('onclick') == undefined || $(this).find('.btn').attr('onclick') == '') {
				if ($(this).find('.btn').attr('data-action') == '1') {
					$(this).find('.btn').attr('onclick', 'return posterDetail()');
				} else if ($(this).find('.btn').attr('data-action') == '2') {
					$(this).find('.btn').attr('onclick', 'return posterOrder()');
				} else {
					$(this).find('.btn').attr('onclick', 'return false');
				}
			}
		});
		return;
	}

	var g = yunyeEditorGlobal;
	var detailBtn = $('<a class="element btn btn-default" href="' + g.globalButton.detail + '" data-action="1" onclick="return posterDetail()">详情</a>'),
		orderBtn = $('<a class="element btn btn-default" href="' + g.globalButton.order + '" data-action="2" onclick="return posterOrder()">预约</a>');
	var cnd = '<div class="cnd-element button-element sys-button">' + '<div class="element-box">' + '    <div class="element-box-contents">' + '        ' + '    </div>' + '</div>' + '<div class="nbar nbar-rotate nbar-radius"></div>' + '<div class="nbar nbar-line"></div>' + '<div class="nbar nbar-n"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-s"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-e"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-w"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-nw nbar-radius nbar-edit"><i class="glyphicon glyphicon-pencil"></i> </div>' + '<div class="nbar nbar-se nbar-radius"></div>' + '<div class="nbar nbar-sw nbar-radius"></div>' + '<div class="nbar nbar-ne nbar-radius"></div>' + '</div>';
	var detailBox = $(cnd),
		orderBox = $(cnd).clone();
	detailBox.find('.element-box-contents').append(detailBtn);
	orderBox.find('.element-box-contents').append(orderBtn);
	detailBox.hide();
	orderBox.hide();

	fullcontainer.append(detailBox);
	fullcontainer.append(orderBox);
	detailBox.css({ 'z-index': scaleIndex++, 'top': (fullcontainer.innerHeight() - detailBox.innerHeight()-10)*remScale + 'rem', 'left': (fullcontainer.innerWidth() / 2 - detailBox.innerWidth() - 10 )*remScale + 'px' }).show();
	scale(detailBox);
	orderBox.css({ 'z-index': scaleIndex++, 'top': (fullcontainer.innerHeight() - orderBox.innerHeight() - 10)*remScale + 'rem', 'left': (fullcontainer.innerWidth() / 2 + 10 )*remScale + 'rem' }).show();
	scale(orderBox);

	detailBtn.unbind();
	orderBtn.unbind();
	detailBtn.on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	});
	orderBtn.on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	});

}

function buttonConfirm(ele) {
	var cnd = $('<div class="cnd-element button-element">' + '<div class="element-box">' + '    <div class="element-box-contents">' + '        ' + '    </div>' + '</div>' + '<div class="nbar nbar-rotate nbar-radius"></div>' + '<div class="nbar nbar-line"></div>' + '<div class="nbar nbar-n"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-s"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-e"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-w"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-nw nbar-radius nbar-edit"><i class="glyphicon glyphicon-pencil"></i> </div>' + '<div class="nbar nbar-se nbar-radius"></div>' + '<div class="nbar nbar-sw nbar-radius"></div>' + '<div class="nbar nbar-ne nbar-radius"></div>' + '</div>');
	if (!isEdit) {
		cnd.find('.element-box-contents').append(ele);
		cnd.hide();
		if (ele.data('rotate') != null) {
			ele.css('transform', 'rotate(0)');
			cnd.css('transform', 'rotate(' + ele.data('rotate') + 'deg)').attr('data-rotate', ele.data('rotate'));
		}
		fullcontainer.append(cnd);
		cnd.css({ 'z-index': scaleIndex++, 'top': (fullcontainer.innerHeight() / 2 - cnd.innerHeight() / 2)*remScale + 'rem', 'left': (fullcontainer.innerWidth() / 2 - cnd.innerWidth() / 2)*remScale + 'rem' }).show();
		scale(cnd);
	} else {
		if (ele.data('rotate') != null) {
			ele.css('transform', 'rotate(0)');
			currentElebox.parent().parent().css('transform', 'rotate(' + ele.data('rotate') + 'deg)').attr('data-rotate', ele.data('rotate'));
		}
		
		currentElebox.empty().append(ele);
	}
	$('#button-model').removeClass('open');
}
var editButtonBasic = function() {
	var e = window.event || event;
	e.stopPropagation();
	if (e.originalEvent) e = e.originalEvent;
	var ele = $(e.target);
	if ($(ele).hasClass('icon')) {
		ele = ele.parent();
	}

	$("#button-basic").show();
	$("#button-border").hide();
	if (!$('#button-model').hasClass('open')) {
		$('#button-model').css('max-height', $(window).height()*remScale - 3.32 + 'rem').addClass('open');
		addButton();
	}
	ele.addClass('open').siblings().removeClass('open');
	if (!$('.bar-footer').hasClass('footer-hide')) {
		$('.bar-footer').addClass('footer-hide');
	}

}
var editButtonBorder = function() {
	var e = window.event || event;
	e.stopPropagation();
	if (e.originalEvent) e = e.originalEvent;
	var ele = $(e.target);
	if ($(ele).hasClass('icon')) {
		ele = ele.parent();
	}

	$("#button-basic").hide();
	$("#button-border").show();
	if (!$('#button-model').hasClass('open')) {
		$('#button-model').css('max-height', $(window).height()*remScale - 3.32 + 'rem').addClass('open');
		addButton();
	}
	ele.addClass('open').siblings().removeClass('open');
	if (!$('.bar-footer').hasClass('footer-hide')) {
		$('.bar-footer').addClass('footer-hide');
	}
}
var copyButton = function() {
	if ($('.button-element.active').hasClass('sys-button')) {
		return;
	}
	var imgclone = $('.button-element.active').clone();
	$('.button-element').removeClass('active');
	imgclone.animate({ 'top': (parseFloat(imgclone.css('top')) + 1) + 'rem', 'left': (parseFloat(imgclone.css('left'))+ 1)  + 'rem' }, 200);
	fullcontainer.append(imgclone);
	scale(imgclone);
}
var deleteButton = function() {
	if ($('.button-element.active').hasClass('sys-button')) {
		return;
	}
	var imgactive = $('.button-element.active');

	imgactive.animate({ 'width': '0', 'height': '0', 'top': (parseInt(imgactive.css('top')) + imgactive.height() / 2)*remScale + 'rem', 'left': (parseInt(imgactive.css('left')) + imgactive.width() / 2)*remScale + 'rem' }, 200, function() {
		imgactive.remove();
	});

}
function colseButtonPannel(){
	$('#button-model').removeClass('open');
	//$('.bar-footer').removeClass('footer-hide');
}
function colseSysimg(){
	$('#systemimg-model').removeClass('open');
	$('.bar-footer').removeClass('footer-hide');
}


$(function() {
	/*$('#systemimg-model ul').click(function(event){
			event.stopPropagation();
			var _this = $(this);
			$('#systemimg-model').removeClass('open');
			var eleobj = $('<div class="element systemimg"></div>');
			var current = $(event.target);
			console.log(current.tagName);
			eleobj.css({'width':current.width(),'height':current.height()});
			eleobj.append(current);
			addSystemimg(eleobj);
	});*/
	/*页面第一次加载就开始加载系统图案*/
	$.ajax({
		type: 'GET',
		url: '/api/v1/poster/system/images',
		success: function(data) {
			var con = $('#systemimg-model .systemimg-list ul');
			con.empty();
			for (i = 0; i < data.length; i++) {
				var li = '<li onclick="selectSysImg(this)">' + data[i].text + '</li>';
				con.append(li);
			}

		},
	});
	/* button */

})
var selectSysImg = function(obj) {
	$('#systemimg-model').removeClass('open');
	var eleobj = $('<div class="element systemimg"></div>');
	eleobj.css({ 'width': $(obj).find('svg').width()*remScale+'rem', 'height': $(obj).find('svg').height()*remScale+'rem' });
	eleobj.append($(obj).find('svg').clone());
	addSystemimg(eleobj);
}

var openSystemimg = function() {
	var e = window.event || event;
	e.stopPropagation();
	if (e.originalEvent) e = e.originalEvent;
	var ele = $(e.target);
	if ($(ele).hasClass('icon')) {
		ele = ele.parent();
	}

	if ($('#systemimg-model').hasClass('open')) {
		$('#systemimg-model').removeClass('open');
		ele.removeClass('open');
		$('.bar-footer').removeClass('footer-hide');
	} else {
		if ($('#systemimg-model .systemimg-list ul li').length <= 0) {
			$.ajax({
				type: 'GET',
				url: '/api/v1/poster/system/images',
				success: function(data) {
					var con = $('#systemimg-model .systemimg-list ul');
					con.empty();
					for (i = 0; i < data.length; i++) {
						var li = '<li onclick="selectSysImg(this)">' + data[i].text + '</li>';
						con.append(li);
					}

				},
			});
		}
		$('#systemimg-model').css('max-height', $(window).height()*remScale - 3.32 + 'rem').addClass('open');
		ele.addClass('open');
		$('.bar-footer').addClass('footer-hide');
	}

}

var addSystemimg = function(eleobj) {
	var cnd = $('<div class="cnd-element systemimg-element">' + '<div class="element-box">' + '	<div class="element-box-contents">' + '		' + '	</div>' + '</div>' + '<div class="nbar nbar-rotate nbar-radius"></div>' + '<div class="nbar nbar-line"></div>' + '<div class="nbar nbar-n"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-s"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-e"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-w"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-nw nbar-radius nbar-edit"><i class="glyphicon glyphicon-pencil"></i> </div>' + '<div class="nbar nbar-se nbar-radius"></div>' + '<div class="nbar nbar-sw nbar-radius"></div>' + '<div class="nbar nbar-ne nbar-radius"></div>' + '</div>');

	cnd.find('.element-box-contents').append(eleobj);
	cnd.css('opacity','0');
	fullcontainer.append(cnd);
	cnd.css({ 'z-index': scaleIndex++, 'top': (fullcontainer.innerHeight() / 2 - eleobj.height() / 2)*remScale + 'rem', 'left': (fullcontainer.innerWidth() / 2 - eleobj.width() / 2)*remScale + 'rem' }).css('opacity','1');
	scale(cnd);
}

var copySystemimg = function() {
	var imgclone = $('.systemimg-element.active').clone(false);
	$('.systemimg-element').removeClass('active');
	imgclone.animate({ 'top': (parseInt(imgclone.css('top')) + 1) + 'rem', 'left': (parseInt(imgclone.css('left')) + 1) + 'rem' }, 200);
	fullcontainer.append(imgclone);
	scale(imgclone);
}
var deleteSystemimg = function() {
	var imgactive = $('.systemimg-element.active');
	imgactive.animate({ 'width': '0', 'height': '0', 'top': (parseInt(imgactive.css('top')) + imgactive.height() / 2)*remScale + 'rem', 'left': (parseInt(imgactive.css('left')) + imgactive.width() / 2)*remScale + 'rem' }, 200, function() {
		imgactive.remove();
	});

}

var uploadSystemimg = function(eleobj) {
	$.fn.uploads.showDialog(function(data) {
		var imgW = data.width,imgH = data.height;
		if (imgW > $(window).width()) {
			imgW = $(window).width() * .6;
			imgH = $(window).width() * .6 * data.height / data.width;
		}
		var img = $('<div class="element"><img src="' + data.file + '" style="width:'+data.width*remScale+'rem;height:'+data.height*remScale+'rem" /></div>');

		addSystemimg(img);
	}, function(data) {
		yyAlert('上传失败，请稍后重试！');
		console.log(data);
	});

}

function deleteElement() {
	var imgactive = $('.cnd-element.active');
	if(imgactive.hasClass('sys-button')) return;

	imgactive.animate({ 'width': '0', 'height': '0', 'top': parseInt(imgactive.css('top')) + imgactive.height() / 2 + 'px', 'left': parseInt(imgactive.css('left')) + imgactive.width() / 2 + 'px' }, 200, function() {
		imgactive.remove();
		if(imgactive.hasClass('text-element-act')){
			$('.ele-rotate-ctrl').css({left:'-200px',top:'-200px'});
			$('.ele-rotate-ctrl').remove();
		}
	});

}
$(function() {
		document.onkeyup = function(event) {
			var e = event || window.event;
			var keyCode = e.keyCode || e.which;
			switch (keyCode) {
				case 46:
					/* delete键 */
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
function colorRgb(str) {
	var sColor = str.toLowerCase();
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			var sColorNew = "#";
			for (var i = 0; i < 6; i += 2) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for (var i = 0; i < 6; i += 2) {
			sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
		}

		return { 'r': sColorChange[0], 'g': sColorChange[1], 'b': sColorChange[2] };
	} else {
		return sColor;
	}
}
$(function() {
	$('#share-panel .share-text').on('click', function(e) {
		textEditor('add');
	});
	$('#share-panel .share-copy').on('click', function(e) {
		textEditor('copy');
	});
	$('#share-panel .share-delete').on('click', function(e) {
		textEditor('delete');
	});

})


function textEditor(type) {
	var s = this;
	if (type == undefined || type == null) {
		alert('功能未定义');
		return;
	}
	initFun();


	function addText() {
		var eleobj = $('<div  type="text" class="element text-editor-content" value="">请输入文字</div>')
		var cnd = $('<div class="cnd-element text-element active" data-type="text">' + '<div class="element-box">' + '  <div class="element-box-contents">' + '      ' + '  </div>' + '</div>' + '<div class="nbar nbar-rotate nbar-radius"></div>' + '<div class="nbar nbar-line"></div>' + '<div class="nbar nbar-n"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-s"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-e"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-w"><div class="nbar-radius"></div></div>' + '<div class="nbar nbar-nw nbar-radius nbar-edit"><i class="glyphicon glyphicon-pencil"></i></div>' + '<div class="nbar nbar-se nbar-radius"></div>' + '<div class="nbar nbar-sw nbar-radius"></div>' + '<div class="nbar nbar-ne nbar-radius"></div>' + '</div>');

		cnd.find('.element-box-contents').append(eleobj);
		cnd.css('opacity', '0');
		fullcontainer.append(cnd);
		cnd.css({ 'z-index': scaleIndex++, 'top': fullcontainer.innerHeight() / 2 - eleobj.height() / 2 + 'px', 'left': fullcontainer.innerWidth() / 2 - eleobj.width() / 2 + 'px' }).css('opacity', '1');
		scale(cnd);	
		editor('open',eleobj);
		$('#ted-edit').click();
	}

	function copyText() {
		if ($('.text-element.actived').hasClass('sys-text')) {
			return;
		}
		var imgclone = $('.text-element.active').clone();
		$('.text-element').removeClass('active');
		imgclone.trigger('click')
		imgclone.stop(true, false).animate({ 'top': parseInt(imgclone.css('top')) + 30 + 'px', 'left': parseInt(imgclone.css('left')) + 30 + 'px' }, 200);
		fullcontainer.append(imgclone);
		scale(imgclone);
	}

	function deleteText() {
		if ($('.text-element.actived').hasClass('sys-text')) {
			return;
		}
		var imgactive = $('.text-element.active');

		imgactive.stop(true, false).animate({ 'width': '0', 'height': '0', 'top': parseInt(imgactive.css('top')) + imgactive.height() / 2 + 'px', 'left': parseInt(imgactive.css('left')) + imgactive.width() / 2 + 'px' }, 200, function() {
			imgactive.remove();
			$('.ele-rotate-ctrl').remove();
		});

	}


	function initFun() {
		switch (type) {
			case 'add':
				addText();
				break;
			case 'copy':
				copyText();
				break;
			case 'delete':
				deleteText();
				break;
			default:
				break;
		}
	}

}
