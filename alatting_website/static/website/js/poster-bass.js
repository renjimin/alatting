function showHeaderTools(){
	if($('#abutton').hasClass('open')){
		$('#abutton').removeClass('open');
	}else{
		$('#abutton').addClass('open');
	}
}
function showDetails(e) {
	$('.abutton-group li a').removeClass('open');
	$(e).addClass('activate');
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