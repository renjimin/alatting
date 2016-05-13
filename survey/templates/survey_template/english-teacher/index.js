$(document).ready(function(){
	//validation rules
	$(".form").validate({
		rules: {
			step1radio: {required: true},
			step2radio: {required: true},
			step2radio4Text: {required: '#step2radio4:checked'},
			step2radio5Text: {required: '#step2radio5:checked'},
			step3text: {required: true},
			'step3checkbox1[]': {required: true},
			'step3checkbox2[]': {required: true},
			step4radio1: {required: true},
			step4radio14Text: {required: '#step4radio14:checked'},
			step4radio2: {required: true},
			step5text: "required"
		},
		messages: {
			step1radio: {required: "请选择其中一项"},
			step2radio: {required: "请选择其中一项"},
			step2radio4Text: {required: "请填写选项中的内容"},
			step2radio5Text: {required: "请填写选项中的内容"},
			step3text: {required: "请填写上课次数"},
			'step3checkbox1[]': {required: "请至少选择其中一项"},
			'step3checkbox2[]': {required: "请至少选择其中一项"},
			step4radio1: {required: "请选择其中一项"},
			step4radio2: {required: "请选择其中一项"},
			step4radio14Text: {required: "请填写选项中的内容"},
			step5text: {required: "请填写年龄"}
		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parents('.qs-list-section'));
		}
	});
})