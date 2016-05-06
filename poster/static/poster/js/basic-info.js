var nameFlag = false;
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
	}else if(nameFlag){
		yyAlert('海报名称已存在!');
		return false;
	}


	if(postdesc == ''){
		yyAlert('海报简述不能为空!');
		return false;
	}

	if(posteimg == ''){
		yyAlert('海报logo不能为空!');
		return false;
	}

	var reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
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


	var reg3=/^1[3|4|5|7|8][0-9]\d{4,8}$/;
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




		//var uploadimg="";
		//var params = {};
		////params.category_keyword_id = $stateParams.data.keywordId;
		////params.main_category_id = $stateParams.data.catId;
		////params.sub_category_id = $stateParams.data.subCatId;
		//params.logo_image_id = uploadimg;
		//params.unique_name = postname;
		//params.logo_title = postname;
		//params.short_description = postdesc;
		//params.phone = posttelephone;
		//params.mobile = postphone;
		//params.email = postemail;
		//params.address = postaddress;
		//console.log(params);

		//location.href = "/poster/select-template/?unique_name=" + postname + "&short_description=" + postdesc + "&phone=" + posttelephone + "&mobile=" + postphone + "&email=" + postemail + "&address="+postaddress;
		$("#form-info").submit();

}


function back(){
	yyConfirm("当前输入信息会丢失",function(){
		history.back(-1);
	});
}

$(function(){

	document.getElementById('postFile').onchange = function() {
	var val = this.value;
	var upLoadType = '.jpg,.gif,.bmp,.png';//['.jpg','.gif','.bmp','.png']; //可上传的格式
	var fileExt = val.substr(val.lastIndexOf(".")).toLowerCase();
	var result = upLoadType.indexOf(fileExt);
	_alertMsg = document.getElementById('error_text');
	var oFReader = new FileReader();
	if (this.files.length === 0) { return; }
	var oFile = this.files[0];

	if (oFile.size / 1024 < 100) {
		_alertMsg.innerHTML="<font style='color:blue'></font>";
	};
	if (result < 0) {
	//_alertMsg.innerHTML="请输入正确格式:" + upLoadType;
		 yyAlert("请输入正确格式:" + upLoadType);

	} else{
		_alertMsg.innerHTML="<font style='color:blue'></font>";
	};

	oFReader.readAsDataURL(oFile);
	oFReader.onload = function (oFREvent) {
	document.getElementById("uploadPreview").src = oFREvent.target.result;
	};
	};

	$(".post-name").blur(function(){
	 var postname = $.trim($('.post-name').val());
	 var url = '/api/v1/poster/check/unique/';
		if(postname == ''){
			return false;
		}

		$.ajax({
			url:url,
			data:{name:encodeURIComponent(postname)},
			type: "GET",
			success:function(data){
				if(data.exists){
					yyAlert('海报名称已经存在');
					nameFlag = true;
					return false;
				}else{
					nameFlag = false;
				}
			},
			error:function(){
				yyAlert('网络错误，请稍后再试');
				return false;
			}
		});

	})



})