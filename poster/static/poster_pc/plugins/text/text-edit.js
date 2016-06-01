function textEditor(type){
	var s = this;
	if(type == undefined || type == null){
		alert('功能未定义');
		return;
	}
	initFun();
	

	function addText(){
		var eleobj = $('<div contenteditable="true" type="text" class="element text-editor-content" value="" style="font-size:20px">请输入文字</div>')
		var cnd = $('<div class="cnd-element text-element actived" data-type="text">'
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
		cnd.css('opacity','0');
		fullcontainer.append(cnd);
		cnd.css({'z-index':scaleIndex++,'top':fullcontainer.innerHeight()/2-eleobj.height()/2+'px','left':fullcontainer.innerWidth()/2-eleobj.width()/2+'px'}).css('opacity','1');
		cnd.scaleable();		
	}
	function copyText(){
	    if($('.text-element.actived').hasClass('sys-text')){
	        return;
	    }
	    var imgclone = $('.text-element.actived').clone();
	    $('.text-element').removeClass('actived');
	    imgclone.stop(true,false).animate({'top':parseInt(imgclone.css('top'))+30+'px','left':parseInt(imgclone.css('left'))+30+'px'},200);
	    fullcontainer.append(imgclone);
	    imgclone.scaleable();
	}
	function deleteText(){
	    if($('.text-element.actived').hasClass('sys-text')){
	        return;
	    }
	    var imgactive = $('.text-element.actived');

	    imgactive.stop(true,false).animate({'width':'0','height':'0','top':parseInt(imgactive.css('top'))+imgactive.height()/2+'px','left':parseInt(imgactive.css('left'))+imgactive.width()/2+'px'},200,function(){
	        imgactive.remove();
	    });

	}
	function resetButton(){
	    if($('.text-element.actived').hasClass('sys-text')){
	        return;
	    }
	    var imgactive = $('.text-element.actived');

	    addButton('reset');

	}


	function initFun(){
		switch(type){
			case 'add':addText();break;
			case 'copy':copyText();break;
			case 'delete':deleteText();break;
			default:break;
		}
	}

}

