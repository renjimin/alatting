$(function(){
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
	$('#btn-create').click(function() {
		var login_url = $(this).data('login');
		if (login_url != "") {
			yyAlert("您需要登录才能创建海报", function() {
				window.location.href = login_url;
			});
			return false;
		}
		if ($('#type-model').hasClass('open')) {
			$('#type-model').removeClass('open');
			$('#type-model').off('touchstart');
		} else {
			//$('#type-model').css('top',$('body').scrollTop()+'px');
			$('#type-model').addClass('open');
			var top, startY;
			/*$('#type-model .type-model-containar').on({
					'touchstart':function(e){
							if (e.originalEvent) e = e.originalEvent;
							e.preventDefault();e.stopPropagation();
							var touch = e.touches[0];
							startY = touch.pageY;
							top = $('#type-model').find('.type-model-inner').scrollTop();
					},
					'touchmove':function(e){
							if (e.originalEvent) e = e.originalEvent;
							var touch = e.touches[0];
							var endY = touch.pageY;
							var st = startY - endY +top;
							$('#type-model').find('.type-model-inner').animate({scrollTop: st},0);
					},
					'touchend':function(event){
							event.preventDefault();
							event.stopPropagation();
					}
			});*/
		}
	});
	$('#hide-cate').click(function() {
		$('#type-model').removeClass('open');
	});

	/* search */
	$(".search-type-list").off('click').on('click','.sublink-item',function(e){
		var target = $(this);
		if(!target.hasClass('active')){			
			target.addClass('active');
			target.find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
		}else{
			target.removeClass('active');
			target.find('.fa').addClass('fa-square-o').removeClass('fa-check-square-o');
			target.find('.typeid').val(0);
			if(target.hasClass('link-item')){
				target.next().find('a').click();
			}
			if(target.hasClass('sublink-item') && target.parent().parent().prev().hasClass('active')){
				target.parent().parent().prev().removeClass('active');
				target.parent().parent().prev().find('.fa').addClass('fa-square-o').removeClass('fa-check-square-o');
			}
		}	
	});
	function selectSearchTypeAll(obj,flag){
			if(flag){
				obj.addClass('active');
				obj.find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
				obj.next().find('a').each(function(){
					$(this).addClass('active');
					$(this).find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
				});
			}else{
				obj.removeClass('active');
				obj.find('.fa').addClass('fa-square-o').removeClass('fa-check-square-o');
				obj.next('.subnav').find('a').each(function(){
					$(this).removeClass('active');
					$(this).find('.fa').addClass('fa-square-o').removeClass('fa-check-square-o');
				});
				console.log(obj.hasClass('active'))
			}
		}
	$(".search-type-list .link-item").on('click',function(e){
		var _this = $(this);
		if($(e.target).closest('.fa').length > 0){
			selectSearchTypeAll(_this,!_this.hasClass('active'));			
		}
		
		if(_this.next('.subnav').length <= 0) return;
		if(_this.next('.subnav').hasClass('open')){
			if($(e.target).closest('.fa').length > 0) return;
			_this.next('.subnav').slideUp().removeClass('open');
		}else{
			_this.next('.subnav').slideDown().addClass('open');
		}

	});

	$('#searchtxt').on('focus',function(){
		var s = $(this);
		s.parent().addClass('active');
	});
	$('#searchtxt').on('blur',function(){
		var s = $(this);
		if(s.val().length > 0) return;
		s.parent().removeClass('active');
	});
	$('#searchdel').on('click',function(){
		$('#searchtxt').val('');
		location.href="/mobile/?q=…&sub_ids="
	});
	$('#searchbtn').on('click',function(){
		var q = $('#searchtxt').val();
		if(q == ""){
			yyAlert("请输入关键词");
			return;
		}
		var sub_ids = getAllSubids();
		location.href=$('#searchPath').val()+'?q='+q+'&sub_ids='+sub_ids;
	});

})
function getAllSubids(){
	var ids = "";
	$('.search-type-list .sublink-item').each(function(){
		if($(this).hasClass('active')){
			ids = ids==""? $(this).attr('data-id'):ids+","+$(this).attr('data-id');
		}
	});
	return ids;
}


$(function(){
	$("#btn-question").click(function(){
		if($('#type-model').hasClass('open')){
		
		}else{
			
		}
	});
	$(".Qes").click(function(e){
		console.log($(e.target).siblings(".Ans"));
	});
});
