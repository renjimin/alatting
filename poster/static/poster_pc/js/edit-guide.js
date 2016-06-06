$(function(){
	var ghtml = '<div class="body-guide"><div class="edit-header"><span class="tool">编辑工具<i class="fa fa-caret-right"></i></span> <div class="top-bar"></div></div>';
		ghtml+='<div class= "edit-viewport edit-viewport2"><div class="edit-left"><span>页面管理</span></div>';
		ghtml+='<div class="edit-center"><div class="guid-center"><a  id="edit-guide-hide" href="#" class="guid-btn"><i><img src="/static/poster_pc/images/check.png"></i>';
		ghtml+='<span>了解</span></a><div class="checkbox"><input type="checkbox" name="" value="">不再显示</div>';
		ghtml+='<span>海报编辑</span></div></div><div class="edit-right"><span>子选项界面</span></div></div></div>';
	$('body').append(ghtml);
	$("#edit-guide-hide").click(function(){
		$(".body-guide").hide();
	});
});