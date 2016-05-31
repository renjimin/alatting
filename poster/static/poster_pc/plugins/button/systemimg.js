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
    var cnd = $('<div class="cnd-element systemimg-element">'
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
    scale(cnd);
}