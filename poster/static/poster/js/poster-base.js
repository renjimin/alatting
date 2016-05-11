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
			dynamicClass:'info'
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