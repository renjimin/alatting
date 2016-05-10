$(function(){
	// 注册toggle
	$(".dropdown-toggle").registerDropDown();
	$(".abutton-contact .ico-phone").registerDropDown({
			id:'dpw_phone',
			offsetYPercent:50,
			offsetY:30,
			arrowOffset:79
		});
	$(".abutton-contact .ico-email").registerDropDown({
			id:'dpw_email',
			offsetYPercent:50,
			offsetY:30,
			arrowOffset:86
		});
	$(".abutton-contact .ico-address").registerDropDown({
			id:'dpw_address',
			offsetYPercent:50,
			offsetY:30,
			arrowOffset:94
		});
	$(".abutton-contact .ico-clock").registerDropDown({
			id:'dpw_clock',
			offsetYPercent:50,
			offsetY:30,
			arrowOffset:86,
			dynamicClass:'clock'
		});
	$('.bar-header .title').registerDropDown({
			id:'dpw_title',
			offsetXPercent:5,
			offsetYPercent:100,
			offsetY:17,
			arrowOffset:50,
			dynamicClass:'title'
		});

	$('body').on('click',function(event){
		var dpw = $('#dp');
		var list = window.clickItmList;
		for(var i in list){
			if($(event.target).closest(list[i]).length!=0)return;
		}
		dpw.removeClass('open');
	});

	//绑定数据
});