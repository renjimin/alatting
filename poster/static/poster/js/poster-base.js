$(function(){
	// 注册toggle
	$(".dropdown-toggle").registerDropDown();
	$(".abutton-contact .ico-phone").registerDropDown({
			id:'dpw_phone',
			offsetYPercent:50,
			offsetY:30,
		});
	$(".abutton-contact .ico-email").registerDropDown({
			id:'dpw_email',
			offsetYPercent:50,
			offsetY:30,
		});
	$(".abutton-contact .ico-address").registerDropDown({
			id:'dpw_address',
			offsetYPercent:50,
			offsetY:30,
		});
	$(".abutton-contact .ico-clock").registerDropDown({
			id:'dpw_clock',
			offsetYPercent:50,
			offsetY:30,
			dynamicClass:'clock'
		});
	$('.bar-header .title').registerDropDown({
			id:'dpw_title',
			offsetYPercent:50,
			offsetY:18,
			dynamicClass:'title'
		});
	$('.header-info').registerDropDown({
			id:'dpw_desc',
			eval:'$("#dp").height($(document.body).height() - _this.offset().top - $("bar-footer bar").height()-40)',
			dynamicClass:'info'
		});

	$('.header-logo').registerPopUp({
			id:'dpw_menu',
			offsetYPercent:50,
			offsetY:30,
			list:[{icon:"ico-email",text:"打字",callback:function(){console.log(1);}},
				{icon:"ico-phone",text:" 上传图片"},
				{icon:"ico-address",text:"照相"},
				{icon:"ico-clock",text:"图片链接"}],
		});
	$('.mask').registerPopUp({
			id:'dpw_header',
			offsetXPercent:80,
			offsetYPercent:90,
			offsetY:30,
			arrowOffset:80,
			list:[{icon:"ico-email",text:"系统图案",callback:function(){
				console.log(1);
				$('.header').bgselect({}, function (ths,img) {
					console.log(img);
					ths.css('background-image', 'url(' + img + ')');
					ths.css('background-size', 'cover');

				})
				console.log(2)
			}},
				{icon:"ico-phone",text:" 上传图片"},
				{icon:"ico-address",text:"照相"},
				{icon:"ico-clock",text:"图片链接"}],
		});

	$('body').on('click',function(event){
		var dpw = $('#dp');
		var list = window.clickItmList;
		for(var i in list){
			if($(event.target).closest(list[i]).length!=0)return;
		}
		dpw.removeClass('open');
	});

	//数据
	$('#dpw_title input').on('change',function(event){
		$('.edit-bar-header .title p').html(event.currentTarget.value);
	});
	$('#dpw_desc input').on('change',function(event){
		$('.desc span').html(event.currentTarget.value);
	});
});