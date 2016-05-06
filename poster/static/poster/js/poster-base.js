var currentAbtn;

function showHeaderTools(){
	if($('#abutton').hasClass('open')){
		$('#abutton').removeClass('open');
	}else{
		$('#abutton').addClass('open');
	}

	$('.abutton-info').removeClass('open');
	currentAbtn = null;
}

function showDetails(e) {
	var icon = $(e).children('i');
	var btnType = icon.attr("class").split(' ')[1].split('-')[1];
	var topOffset = icon.offset().top+icon.height() - 30;
	var leftOffset = icon.offset().left+icon.width()/2 - 12;

	if(icon.height() >= icon.width()){
		topOffset = icon.offset().top+icon.height()/2 + 15 - 30;
	}

	$('.abutton-info').css('top',topOffset);
	$('.abutton-info .arrow').css('left',leftOffset);
	if(currentAbtn == btnType){
		$('.abutton-info').removeClass('open');
		currentAbtn = null;
	}else{
		$('.abutton-info').addClass('open');
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

	$('body').click(function(){
		$('.abutton-info').removeClass('open');
		currentAbtn = null;
	});
	$('.abutton-info,#abutton').click(function(event){
		event.stopPropagation();
	});
})