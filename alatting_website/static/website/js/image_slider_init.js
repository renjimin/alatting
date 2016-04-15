$('.carousel').carousel({
    interval: 5000 //changes the speed
});
$( ".carousel" ).each(function() {
    var id = $(this).attr("id");
    var class_name = id+"-item"
    $('.'+class_name).magnificPopup({
	    type: 'image',
	    gallery:{
	    	enabled:true
	    }
	});
});