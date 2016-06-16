$(function(){
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

