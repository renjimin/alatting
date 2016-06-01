$(function(){
	/*页面第一次加载就开始加载系统图案*/
	$.ajax({
		type: 'GET',
		url: '/api/v1/poster/system/images',
		success: function(data){
			var con = $('.systemimg-list ul');
	            con.empty();
	            for(i=0;i<data.length;i++){
	                var li = '<li onclick="selectSysImg(this)">'+data[i].text+'</li>';
	                con.append(li);
	            }
	            for(j=0;j<=20;j++){
	            		var li = '<li onclick="selectSysImg(this)">'+data[0].text+'</li>';
	              	con.append(li);
	            }

	        },
   	});
});
function selectSysImg(obj){
	var eleobj = $('<div class="element systemimg"></div>');
	eleobj.css({'width':$(obj).children(0).width(),'height':$(obj).children(0).height()});
	eleobj.append($(obj).children(0).clone());
	addSystemimg(eleobj);
}
function addSystemimg(eleobj){
    var cnd = $('<div class="cnd-element systemimg-element" data-type="systemimg">'
				+'<div class="element-box">'
				+'	<div class="element-box-contents">'
				+'		'
				+'	</div>'
				+'</div>'
				+'<div class="nbar nbar-rotate nbar-radius"></div>'
				+'<div class="nbar nbar-line"></div>'
				+'<div class="nbar nbar-n"><div class="nbar-radius"></div></div>'
				+'<div class="nbar nbar-s"><div class="nbar-radius"></div></div>'
				+'<div class="nbar nbar-e"><div class="nbar-radius"></div></div>'
				+'<div class="nbar nbar-w"><div class="nbar-radius"></div></div>'
				+'<div class="nbar nbar-nw nbar-radius"></div>'
				+'<div class="nbar nbar-se nbar-radius"></div>'
				+'<div class="nbar nbar-sw nbar-radius"></div>'
				+'<div class="nbar nbar-ne nbar-radius"></div>'
			+'</div>');

    cnd.find('.element-box-contents').append(eleobj);
    cnd.hide();
    fullcontainer.append(cnd);
    cnd.css({'z-index':scaleIndex++,'top':fullcontainer.innerHeight()/2-eleobj.height()/2+'px','left':fullcontainer.innerWidth()/2-eleobj.width()/2+'px'}).show();
    //scale(cnd);
    cnd.scaleable();
}

function copySystemimg(){
    var imgclone = $('.systemimg-element.active').clone(false);
    $('.systemimg-element').removeClass('active');
    imgclone.stop(true,false).animate({'top':parseInt(imgclone.css('top'))+30+'px','left':parseInt(imgclone.css('left'))+30+'px'},200);
    fullcontainer.append(imgclone);
    imgclone.scaleable();
}
function deleteSystemimg(){
    var imgactive = $('.systemimg-element.active');
    imgactive.stop(true,false).animate({'width':'0','height':'0','top':parseInt(imgactive.css('top'))+imgactive.height()/2+'px','left':parseInt(imgactive.css('left'))+imgactive.width()/2+'px'},200,function(){
        imgactive.remove();
    });
}

function uploadSystemimg(){
    $.fn.uploads.showDialog(function(data){
        var img = $('<div class="element"><img src="'+data.file+'" /></div>');
        if(data.width > $(window).width()){
             img.width( $(window).width() *.6);
             img.height($(window).width() *.6*data.height / data.width);
        }
        addSystemimg(img);
    },function(data){
        yyAlert('上传失败，请稍后重试！');
        console.log(data);
    });

}

$(function(){
	$('.systemimg-wraper .btn-scrolltop').click(function(){
		var s = $(this),o=s.parent().find('.systemimg-list');
		var st = o.scrollTop(),
			bh = o.height(),
			uh = o.find('ul').innerHeight(),
			lh = o.find('li').innerHeight();
		
		if(st>0){
			var moveT = st - lh < 0 ? 0 : st - lh;
			o.stop(true,false).animate({'scrollTop':moveT + 'px'},200);
		}

	})
	$('.systemimg-wraper .btn-scrolldown').click(function(){
		var s = $(this),o=s.parent().find('.systemimg-list');
		var st = o.scrollTop(),
			bh = o.height(),
			uh = o.find('ul').innerHeight(),
			lh = o.find('li').innerHeight();
		console.log(st+'  '+bh+'  '+uh+'  '+lh);
		if(st + uh > bh){
			var moveT = st + lh;
			console.log(111+'  '+moveT);
			o.stop(true,false).animate({'scrollTop':moveT+'px'},200);
		}

	})
})