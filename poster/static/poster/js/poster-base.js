var currentAbtn;

function showHeaderTools(){
	if($('#abutton').hasClass('open')){
		$('#abutton').removeClass('open');
	}else{
		$('#abutton').addClass('open');
	}

	$('.abutton-info').removeClass('activate');
	currentAbtn = null;
}

function showDetails(e) {
	var icon = $(e).children('i');
	var btnType = icon.attr("class").split(' ')[1].split('-')[1];
	var topOffset = icon.offset().top-5;
	var leftOffset = icon.offset().left-$('body').offset().left-2;
	
	$('.abutton-info').css('top',topOffset);
	$('.abutton-info .arrow').css('left',leftOffset);
	if(currentAbtn == btnType){
		$('.abutton-info').removeClass('activate');
		currentAbtn = null;
	}else{
		$('.abutton-info').addClass('activate');
		$('.abutton-info section').hide();
		var ele = '.abutton-info section.' + btnType;
		$(ele).show();
		currentAbtn = btnType;
	}
}

$(function(){
	/* music */
	$('#music').click(function(){
		if($(this).hasClass('rotate')){
			$(this).removeClass('rotate');
		}else{
			$(this).addClass('rotate');
		}
	});
	/* dropdown */
	$(".dropdown-toggle").dropdown(); 　
})