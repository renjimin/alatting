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
	if($('#qs-add').hasClass('closed')) {
		$('#qs-add').removeClass("closed");
		$('#qs-add').addClass("open");
	}
});
$('#add-qs-1-back-btn').on('click',function(e){
	if($('#qs-add').hasClass('open')) {
		$('#qs-add').removeClass("open");
		$('#qs-add').addClass("closed");
	}
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
                yyAlert('成功添加问题',function(){
                    window.location.reload(true);
                });
				if($('#qs-add').hasClass('open')) {
					$('#qs-add').removeClass("open");
					$('#qs-add').addClass("closed");
				}
			} else if($.inArray(qs_type,['choice', 'checkbox'])>-1) {
				$("#qs-add-choice_q_id").val(data.q_id);
				$("#ad-qs-new-q").html(data.q_text);
				if($('#qs-add').hasClass('open')) {
					$('#qs-add').removeClass("open");
					$('#qs-add').addClass("closed");
				}
				if($('#qs-add-choice').hasClass('closed')) {
					$('#qs-add-choice').removeClass("closed");
					$('#qs-add-choice').addClass("open");
				}
			} else if($.inArray(qs_type,['choice-input', 'checkbox-input'])>-1) {
                $("#qs-add-choice-input_q_id").val(data.q_id);
                $("#ad-qs-new-q-input").html(data.q_text);
                if($('#qs-add').hasClass('open')) {
                    $('#qs-add').removeClass("open");
                    $('#qs-add').addClass("closed");
                }
                if($('#qs-add-choice-input').hasClass('closed')) {
                    $('#qs-add-choice-input').removeClass("closed");
                    $('#qs-add-choice-input').addClass("open");
                }
            }
      	},
      	error: function(data) {
      		yyAlert(data.responseJSON.error);
      	}
    });
});

// 添加预约问卷选项
var choice_prefix = "form";
$(function() {
    $('#qs-add-choice-formset tbody tr').formset({
        prefix:choice_prefix,
        addText: '+新增选项',
        deleteText: '<span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>',
        keepFieldValues : 'input:submit',
    });
    $('.dynamic-form input[type=text]').attr("placeholder", "请输入");
})

$('#add-qs-2-back-btn').on('click',function(e){
	if($('#qs-add-choice').hasClass('open')) {
		$('#qs-add-choice').removeClass("open");
		$('#qs-add-choice').addClass("closed");
	}
	if($('#qs-add').hasClass('closed')) {
		$('#qs-add').removeClass("closed");
		$('#qs-add').addClass("open");
	}
});
$('#add-qs-2-next-btn').on('click',function(e){
	e.preventDefault();
    e.stopPropagation();
    q_id = $.trim($('#qs-add-choice_q_id').val());
    if(q_id == ""){
        yyAlert('参数错误');
        return false;
    }
    var c_texts = [];
    var dynamic_form_count = $('.dynamic-form').length;
    for(var i=0;i<dynamic_form_count;i++){
    	var dynamic_form_id = "id_"+choice_prefix+"-"+i+"-c_text";
    	var c_text = $.trim($('#'+dynamic_form_id).val());
    	if(c_text == ""){
	        yyAlert('请填写选项');
	        return false;
	    }
    	c_texts.push(c_text);
    }
    var c_texts_sort = c_texts.sort(); 
	var c_texts_sort_dup = [];
	for (var i = 0; i < c_texts_sort.length - 1; i++) {
	    if (c_texts_sort[i + 1] == c_texts_sort[i]) {
	        c_texts_sort_dup.push(c_texts_sort[i]);
	    }
	}
	if(c_texts_sort_dup.length >0){
        yyAlert('选项不能重复');
        return false;
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
			yyAlert("成功添加选项",function(){
                    window.location.reload(true);
            });
			if($('#qs-add-choice').hasClass('open')) {
				$('#qs-add-choice').removeClass("open");
				$('#qs-add-choice').addClass("closed");
			}
      	},
      	error: function(data) {
      		yyAlert(data.responseJSON.error);
      	}
    });
});

// 添加预约问卷选项
var choice_input_prefix = "form-input";
$(function() {
    $('#qs-add-choice-input-formset tbody tr').formset({
        prefix: choice_input_prefix,
        addText: '+新增选项',
        deleteText: '<span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>',
        keepFieldValues : 'input:submit',  
        addCssClass: 'add-row-input',          // CSS class applied to the add link
        deleteCssClass: 'delete-row-input',    // CSS class applied to the delete link
        formCssClass: 'dynamic-form-input',    // CSS class applied to each form in a formset
    });
})
$("input[name$='c_input']").on('click',function(e){
	this_name = $(this).attr('name');
    var c_input_disabled_name = this_name+"_disabled";
    var c_input_disabled_id = "id_" + this_name + "_disabled";
    var c_input_disabled = "<input type='text' name='"+c_input_disabled_name+"' id='"+ c_input_disabled_id+"' disabled>";
    var c_input_hidden_name = this_name+"_hidden";
    var c_input_hidden_id = "id_" + this_name + "_hidden";
    var c_input_hidden = "<input type='text' name='"+c_input_hidden_name+"' id='"+ c_input_hidden_id+"' value='has_input' class='hidden'>";
    var c_input_rep = c_input_disabled + c_input_hidden;
    $(this).replaceWith(c_input_rep);
});
$('#add-qs-3-back-btn').on('click',function(e){
    if($('#qs-add-choice-input').hasClass('open')) {
        $('#qs-add-choice-input').removeClass("open");
        $('#qs-add-choice-input').addClass("closed");
    }
    if($('#qs-add').hasClass('closed')) {
        $('#qs-add').removeClass("closed");
        $('#qs-add').addClass("open");
    }
});
$('#add-qs-3-next-btn').on('click',function(e){
	e.preventDefault();
    e.stopPropagation();
    q_id = $.trim($('#qs-add-choice-input_q_id').val());
    if(q_id == ""){
        yyAlert('参数错误');
        return false;
    }
    var c_texts = [];
    var dynamic_form_count = $('.dynamic-'+choice_input_prefix).length;
    for(var i=0;i<dynamic_form_count;i++){
    	var dynamic_form_id = "id_"+choice_input_prefix+"-"+i+"-c_input_text";
    	var c_text = $.trim($('#'+dynamic_form_id).val());
        if(c_text == ""){
            yyAlert('请填写选项');
            return false;
        }
    	var input_hidden_id = "id_"+choice_input_prefix+"-"+i+"-c_input_hidden";
    	var c_input = $.trim($('#'+input_hidden_id).val());
    	c_text={'c_text': c_text,'c_input': c_input};
    	c_texts.push(c_text);
    }

    var c_texts_dup = [];
    for (var i=0; i<c_texts.length; i++) {
        c_texts_dup.push(c_texts[i].c_text);
    }
    var c_texts_sort = c_texts_dup.sort(); 
    var c_texts_sort_dup = [];
    for (var i = 0; i < c_texts_sort.length - 1; i++) {
        if (c_texts_sort[i + 1] == c_texts_sort[i]) {
            c_texts_sort_dup.push(c_texts_sort[i]);
        }
    }
    if(c_texts_sort_dup.length >0){
        yyAlert('选项不能重复');
        return false;
    }

    var url = '/api/v1/survey/create_choice_input/'+q_id+'/';
    var posted_data = {
    	c_texts:c_texts
    };
    $.ajax({
		url:url,
		data:JSON.stringify(posted_data),
		type: "POST",
		contentType: "application/json; charset=utf-8",
		success:function(data){
			yyAlert("成功添加选项",function(){
                window.location.reload(true);
            });
            if($('#qs-add-choice-input').hasClass('open')) {
                $('#qs-add-choice-input').removeClass("open");
                $('#qs-add-choice-input').addClass("closed");
            }
      	},
      	error: function(data) {
      		yyAlert(data.responseJSON.error);
      	}
    });
});

// 删除问题
$('[id^=q_added_remove]').on('click',function(e){
    var q_id = $(this).attr("id").split("_").pop();
    yyConfirm('您确定要删除此问题吗',function(){
        var url = '/api/v1/survey/delete/'+q_id+'/';
        $.ajax({
            url:url,
            data:{q_id:q_id},
            type: "DELETE",
            success:function(data){
                window.location.reload(true);
            },
            error: function(data) {
                yyAlert(data.responseJSON.error);
            }
        });
    },{'okText':'确定 ','cancelText':'取消'});
});
