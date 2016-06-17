$(function(){
	$.ajax({
		type:'GET',
		url:'/api/v1/poster/qa',
		success:function(msg){
			var str = "";
			for(var i in msg){
				str += '<ul>';
				str += '<li class="Qes">';
				str += '<span class="QAFake"></span>';
				str += '<span class="QAText">'+msg[i].question+'</span>';
				str += '</li>';
				str += '<li class="Ans">';
				str += '<span class="QAFake"></span>';
				str += '<span class="QAText">'+msg[i].answer+'</span>';
				str += '</li>';
				str += '</ul>';
			}
			$("#QAContent").append(str);
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

	$('#hide-cate').click(function(){
		$('#type-model').removeClass('open');
	});

    $('#btn-create').click(function(){
        var login_url = $(this).data('login');
        if(login_url !== ""){
            yyAlert("您需要登录才能创建海报", function () {
                window.location.href = login_url;
            });
            return false;
        }
        if($('#type-model').hasClass('open')){
            $('#type-model').removeClass('open');
            $('#type-model').off('touchstart');
        }else{
            //$('#type-model').css('top',$('body').scrollTop()+'px');
            $('#type-model').addClass('open');
            var top,startY;
        }
    });

    $('#hide-cate').click(function(){
        $('#type-model').removeClass('open');
    });
});
/*
var cate = document.querySelector('#catelist').childNodes;
cate.onclick = function(event){
    alert(event.currentTarget.children.length);
}*/
