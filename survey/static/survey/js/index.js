$(document).ready(function(){
	var current = 1;
	var length = $(".step").length;
	setProgress(current,length);

	//init
	$(".step").not(':eq(0)').addClass("hidden");

	// Next button click action
	$(".next").click(function(){
		if(current < length){
			//check validation
			if($(".form").valid()) {
				$(".step").addClass("hidden");
				current = current+1;
				$(".step:eq("+(current-1)+")").removeClass("hidden")
				setProgress(current, length);
			}
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

	//validation rules
	$(".form").validate({
		rules: {
			step1radio: {required: true},
			step2radio: {required: true},
			step3text: "required",
			'step3checkbox1[]': {required: true},
			'step3checkbox2[]': {required: true},
			step4radio1: {required: true},
			step4radio2: {required: true},
			step5text: "required"
		},
		messages: {
			step1radio: {required: "请选择其中一项"},
			step2radio: {required: "请选择其中一项"},
			step3text: {required: "请填写上课次数"},
			'step3checkbox1[]': {required: "请至少选择其中一项"},
			'step3checkbox2[]': {required: "请至少选择其中一项"},
			step4radio1: {required: "请选择其中一项"},
			step4radio2: {required: "请选择其中一项"},
			step5text: {required: "年龄"}
		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parents('.qs-list-section'));
		}
	});
})

// Change progress bar action
function setProgress(currstep, totalstep){
	var percent = parseFloat((currstep) / totalstep) * 100;
	percent = percent.toFixed();
	$(".progress-bar").css("width",percent+"%");		
}