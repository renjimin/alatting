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