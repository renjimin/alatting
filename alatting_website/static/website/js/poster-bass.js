function showHeaderTools(){
	if($('#abutton').hasClass('open')){
		$('#abutton').removeClass('open');
	}else{
		$('#abutton').addClass('open');
	}
}
function showDetails(e) {
	var topOffset=$(e).children('i').offset().top;
	var leftOffset=$(e).children('i').offset().left;
	console.log(topOffset);
	$('.abutton-info').css('top',topOffset);
	if(!$(e).hasClass('activate')){
		$(e).addClass('activate');
	}else{
		$('.abutton-group li a').removeClass('activate');
	}
}
/*music
$(function(){
	$('#music').click(function(){
		if($(this).hasClass('rotate')){
			$(this).removeClass('rotate');
		}else{
			$(this).addClass('rotate');
		}
	});
})


$(function () { 
　　$(".dropdown-toggle").dropdown(); 　
});
*/