$(function(){
	$.ajax({
		type:'GET',
		url:'/api/v1/poster/qa',
		success:function(msg){
			console.log(msg);
		}
	});

	$("#catelist .item-link").click(function(){
		if($(this).parent().hasClass('open')){
			 $(this).parent().find('.sublist').slideUp(200);
			$(this).parent().removeClass('open');
		}else{
			$(this).parent().addClass('open');
			$(this).parent().siblings().removeClass('open').find('.sublist').slideUp(200);
			$(this).parent().find('.sublist').slideDown(200);
		}

	});
	$('#btn-create').click(function(){
		var login_url = $(this).data('login');
		if(login_url !== ""){
			yyAlert("您需要登录才能创建海报", function () {window.location.href = login_url;});
			return false;
		}
		if($('#type-model').hasClass('open')){
			$('#type-model').removeClass('open');
			$('#type-model').off('touchstart');
		}else{
			$('#type-model').addClass('open');
		}
	});
	$('#hide-cate').click(function(){
		$('#type-model').removeClass('open');
	});
	$("#btn-question").click(function(){
		if($('#QA').is(":visible")){
			$('#QA').hide();
		}else{
			$('#QA').show();
		}
	});

	$(".Qes").click(function(e){
		var ans = $(e.currentTarget).siblings(".Ans");
		if(ans.is(":visible")){
			ans.hide();
			$("#QA #arrow").hide();
		}else{
			$(".Ans").hide();
			ans.show();
			$("#QA #arrow").css("top",$(e.currentTarget).offset().top + $(e.currentTarget).height()).show();
		}
	});
});

