$(document).ready(function(){
	var current = 1;
	var length = $(".step").length;
	setProgress(current,length);

	//init
	$(".step").not(':eq(0)').addClass("hidden");

	// Next button click action
	$(".next").click(function(){
		if(current < length){
			$(".step").addClass("hidden");
			current = current+1;
			$(".step:eq("+(current-1)+")").removeClass("hidden")
			setProgress(current, length);
		}
	});

	// Back button click action
	$(".back").click(function(){
		if(current > 1){
			$(".step").addClass("hidden");
			current = current-1;
			$(".step:eq("+(current-1)+")").removeClass("hidden")
			setProgress(current, length);
		}
	});
})

// Change progress bar action
function setProgress(currstep, totalstep){
	var percent = parseFloat((currstep) / totalstep) * 100;
	percent = percent.toFixed();
	$(".progress-bar").css("width",percent+"%");		
}