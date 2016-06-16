// 提交预约问卷答案提示   
$("#qs_islast_consumer_repeat").on("click", function(event) {
    event.preventDefault();
    var form = $("#qs-form");
    openPopup(form,"您已向此海报创建人发送过预约信息，确认要继续吗？");
});
$("#qs_islast_consumer").on("click", function(event) {
    event.preventDefault();
    var form = $("#qs-form");
    openPopup(form,"您填写的信息将会反馈给此海报创建人");
});

function openPopup(form, text) {
    var cover = '<div id="yyconfirm-cover" class="yyalert-cover" style=""><div class="yyalert-cover-inner"></div></div>';
    var divelement = '<div class="yyalert" id="yyconfirm"><div class="yyalert-text">'+text+'</div><div class="yyalert-footer"><a href="javascript:void(0);" id="yyBtnCancel" class="yyalert-btn">取消</a><a href="javascript:void(0);" id="yyBtnConfirm" class="yyalert-btn">知道了</a></div></div></div>';
	
    confirmEle = document.createElement('div');
	confirmEle.setAttribute('id','yyconfirm-dialog');
	confirmEle.setAttribute('class','open');
	confirmEle.innerHTML = cover + divelement;
	document.body.appendChild(confirmEle);

	coverbox = document.getElementById('yyconfirm-cover');
	popbox = document.getElementById('yyconfirm');
	yyBtnConfirm = document.getElementById('yyBtnConfirm');
	yyBtnCancel = document.getElementById('yyBtnCancel');

	/* set */
    popbox.children[0].innerHTML = text;
	popbox.style.marginTop = - popbox.offsetHeight/2+'px';
	popbox.style.marginLeft =  - popbox.offsetWidth/2+'px';

	/* action */
	coverbox.onclick=function(){
		confirmEle.remove();
	}
	yyBtnCancel.onclick=function(){
		confirmEle.remove();
	}
	yyBtnConfirm.onclick=function(){
		form.submit();
	}
};

// 添加预约问卷问题  
$('#qs-footer-add-q').on('click',function(e){
	$('#qs-add').removeClass("hidden");
});
$('#add-qs-1-back-btn').on('click',function(e){
	$('#qs-add').addClass("hidden");
});
$('#add-qs-1-next-btn').on('click',function(e){
	e.preventDefault();
    e.stopPropagation();
    poster_id = $.trim($('input[name="poster_id"]').val());

	qs_text = $.trim($('#add-qs-1-text').val());
	if(qs_text == ""){
        yyAlert('请填写问题描述!');
        return false;
    }
	qs_short_text = $.trim($('input[name="add-qs-1-short-text"]').val());
	if(qs_short_text == ""){
        yyAlert('请填写问题简短描述!');
        return false;
    }
    if(qs_short_text.length>6) {
    	yyAlert('问题简短描述不超过6个字');
        return false;
    }
	qs_type = $.trim($('input[name="add-qs-1-type"]:checked').val());
    if(qs_type == ""){
        yyAlert('请填写问题类型!');
        return false;
    }
	var url = '/api/v1/survey/create';
	var posted_data = {
		poster_id:poster_id, 
		qs_text:qs_text, 
		qs_type:qs_type, 
		qs_short_text:qs_short_text
	};
	$.ajax({
		url:url,
		data:posted_data,
		type: "POST",
		success:function(data){
			if($.inArray(qs_type,['text', 'textarea'])>-1) {
				yyAlert("成功添加问题");
				$('#qs-add').addClass("hidden");
			} else if($.inArray(qs_type,['choice', 'checkbox'])>-1) {
				$("#qs-add-choice_q_id").val(data.q_id);
				$('#qs-add').addClass("hidden");
				$('#qs-add-choice').removeClass("hidden");
			}
      	},
      	error: function(data) {
      		yyAlert(data.responseJSON.error);
      	}
    });
});

// 添加预约问卷选项
$(function() {
        $('#qs-add-choice-formset tbody tr').formset({
        addText: '新增选项',
        deleteText: '删除'
    });
})
$('#add-qs-2-next-btn').on('click',function(e){
	e.preventDefault();
    e.stopPropagation();
    q_id = $.trim($('#qs-add-choice_q_id').val());
    var c_texts = [];
    var dynamic_form_count = $('.dynamic-form').length;
    for(var i=0;i<dynamic_form_count;i++){
    	var dynamic_form_id = "id_form-"+i+"-c_text";
    	var c_text = $.trim($('#'+dynamic_form_id).val());
    	c_texts.push(c_text);
    }
    
    var url = '/api/v1/survey/create_choice/'+q_id+'/';
    var posted_data = {
    	c_texts:c_texts
    };
    $.ajax({
		url:url,
		data:JSON.stringify(posted_data),
		type: "POST",
		contentType: "application/json; charset=utf-8",
		success:function(data){
			console.log("success");
      	},
      	error: function(data) {
      		console.log("error");
      	}
    });
});