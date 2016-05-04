function submitinfo(){
    var postname = $.trim($('.post-name').val());
	var postdesc = $.trim($('.post-desc').val());
    var posteimg = $.trim($('.post-img').val());
	var postemail = $.trim($('.post-email').val());
	var posttelephone = $.trim($('.post-telephone').val());
	var postphone = $.trim($('.post-phone').val());
    var postaddress = $.trim($('.post-address').val());


	if(postname == ''){
		yyAlert('海报名称不能为空!');
		return false;
	}

	if(postdesc == ''){
		yyAlert('海报简述不能为空!');
		return false;
	}


	var reg=/^\w{1,}@\w+(\.\w+)+$/;
	if(postemail == '') {
		yyAlert('email不能为空!');
		return false;
	}else if(!reg.test(postemail)) {
		yyAlert('email格式不正确!');
		return false;
	}


	var reg2=/^0\d{2,3}-?\d{7,8}$/;
	if(posttelephone == '') {
		yyAlert('电话不能为空!');
		return false;
	}else if(!reg2.test(posttelephone)) {
		yyAlert('电话格式不正确!');
		return false;
	}


	var reg3=/^1[3|4|5|8][0-9]\d{4,8}$/;
	if(postphone == '') {
		yyAlert('手机不能为空!');
		return false;
	}else if(!reg3.test(postphone)) {
		yyAlert('手机格式不正确!');
		return false;
	}


	if(postaddress == ''){
		yyAlert('地址不能为空!');
		return false;
	}




		var uploadimg="";
		var params = {};
		//params.category_keyword_id = $stateParams.data.keywordId;
		//params.main_category_id = $stateParams.data.catId;
		//params.sub_category_id = $stateParams.data.subCatId;
		params.logo_image_id = uploadimg;
		params.unique_name = postname;
		params.logo_title = postname;
		params.short_description = postdesc;
		params.phone = posttelephone;
		params.mobile = postphone;
		params.email = postemail;
		params.address = postaddress;
		console.log(params);

		location.href = "/poster/select-template/?unique_name=" + postname + "&short_description=" + postdesc + "&phone=" + posttelephone + "&mobile=" + postphone + "&email=" + postemail + "&address="+postaddress;


}

