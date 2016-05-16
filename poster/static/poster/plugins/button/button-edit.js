var btn,currentElebox = null,isEdit = false,fullcontainer=$('.container-fluid');
var curentOpts={};


    var addButton = function(ele,options){
        var defaults = {
            'container':$("#button-model"),
            'href':'javascript:void(0)',
            'text':'请输入文字',
            'color':'000',
            'fontSize':'14',
            'background':'fff',
            'opacity':'1',
            'boxShadow':'0',
            'borderRadius':'3',
            'rotate':'0',
            'borderColor':'fff',
            'borderStyle':'solid',
            'borderWidth':'1'
        }

        defaults.container.addClass('open');
        var opts = $.extend(defaults,options),s = this;

        s.add = function(){
            isEdit = false;
            btn = $('<a class="element btn btn-default">请输入文字</a>')
            defaults.container.find('.btn-container').empty().append(btn);
            s.controlInit();
            s.upload(btn);
            s.addControlListen(btn);
        }
		s.edit = function(element){
            isEdit = true;
            btn = null;
            btn = element.clone();
            defaults.container.find('.btn-container').empty().append(btn);
			currentElebox = element.parent();
            //s.upload(btn);
            s.controlInit(btn);
            s.addControlListen(btn);
        }
        s.upload = function(o){
            o.html(opts.text);
            o.attr({
                'href':opts.href,
            })
            o.css({
                'color':'#'+opts.color,
                'font-size':opts.fontSize+'px',
                'background':'#'+opts.background,
                'opacity':opts.opacity,
                'box-shadow':'0 0 '+opts.boxShadow+' #444',
                'border-radius':opts.borderRadius+'px',
                'transform':'rotate('+opts.rotate+'deg)',
                'border-color':'#'+opts.borderColor,
                'border-style':opts.borderStyle,
                'border-width':opts.borderWidth+'px',
            });
        }
        s.controlInit = function(b){
			if(typeof(b)!='undefined'){
				var reg = /(rotate\([\-\+]?((\d+)))/i;
			    var wt = b.css('transform');
                if(wt==null){
                    wt = '';
                }
                var wts = wt.match (reg);
			    var $2 = RegExp.$2;
                if($2==null || $2 == ''){
                    $2 = 0;
                }
				eleopts = {
					'href': $(b).attr('href'),
		            'text': $(b).text(),
		            'color': $(b).css('color')==null?'000':$(b).css('color'),
		            'fontSize': $(b).css('font-size'),
		            'background': $(b).css('background'),
		            'opacity': $(b).css('opacity'),
		            'boxShadow':$(b).css('box-shadow-spread'),
		            'borderRadius':$(b).css('border-radius'),
		            'rotate':$2,
		            'borderColor':$(b).css('border-color'),
		            'borderStyle':$(b).css('border-style'),
		            'borderWidth':$(b).css('border-width')
				}
				$.extend(opts,eleopts);
			}


            var href = opts.href=="javascript:void(0)"?'':opts.href
            $('.button-href').val(href);
            $('.button-text').val(opts.text);
            $('.button-color').css('background','#'+opts.color);
            for(i=12;i<30;i++){
                $('.button-fontSize').append('<option value="'+i+'">'+i+'px</option>')
            }
            $('.button-fontSize').val(opts.fontSize);
            $('.button-background').css('background','#'+opts.background).attr('data-backgorund',opts.background);
            $('.button-opacity').val(opts.opacity*100);
            $('.button-boxShadow').val(opts.boxShadow);
            $('.button-borderRadius').val(opts.borderRadius);
            $('.button-borderColor').val(opts.borderColor);
            $('.button-borderStyle').val(opts.borderStyle);
            for(i=0;i<20;i++){
                $('.button-borderWidth').append('<option value="'+i+'">'+i+'px</option>')
            }
            $('.button-borderWidth').val(opts.borderWidth);

        }
        s.addControlListen = function(o){
            $('.button-href').on('input propertychange',function(){
                opts.href = $(this).val();
                o.attr({'href':opts.href})
            });
            $('.button-text').on('input propertychange',function(){
                opts.text = $(this).val();
                o.html(opts.text);
            });
            $('.button-fontSize').on('change',function(){
                opts.fontSize = $(this).val();
                o.css('font-size',opts.fontSize+'px');
            });
            $('.button-borderStyle').on('change',function(){
                opts.borderStyle = $(this).val();
                o.css('border-style',opts.borderStyle);
            });
            $('.button-borderWidth').on('change',function(){
                opts.borderWidth = $(this).val();
                o.css('border-width',opts.borderWidth);
            });
            $('.button-borderColor').on('change',function(){
                opts.borderColor = $(this).val();
                o.css('border-color','#'+opts.borderColor);
                $(this).css('background','#'+opts.borderColor);
            });
            $('.button-color').on('change',function(){
                opts.color = $(this).val();
                o.css('color','#'+opts.color);
                $(this).css('background','#'+opts.color);
            });
            $('.button-background').on('change',function(){
                opts.background = $(this).val();
                o.css('background','#'+opts.background);
                $(this).css('background','#'+opts.background);
            });

            s.touches = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                diff: 0
            };
            $('.button-opacity').on({
                'touchstart':function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                    var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                },
                'touchmove':function(e){
                    if (e.originalEvent) e = e.originalEvent;

                    s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

                    e.currentTarget.style.left = s.touches.currentX - s.touches.startX;
                    $('.button-opacity').val($(this).val());
                    o.css('opacity',$(this).val()/100)
                },
                'touchend':function(event){
                    opts.opacity = $(this).val();
                }
            });
            $('.button-boxShadow').on({
                'touchstart':function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                    var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                },
                'touchmove':function(e){
                    if (e.originalEvent) e = e.originalEvent;

                    s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

                    e.currentTarget.style.left = s.touches.currentX - s.touches.startX;

                    $('.button-boxShadow').val($(this).val());
                    o.css('box-shadow','0 0 '+$(this).val()+'px #444');
                },
                'touchend':function(event){
                    opts.boxShadow = $(this).val();
                }
            });
            $('.button-borderRadius').on({
                'touchstart':function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                    var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                },
                'touchmove':function(e){
                    if (e.originalEvent) e = e.originalEvent;

                    s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

                    e.currentTarget.style.left = s.touches.currentX - s.touches.startX;

                    $('.button-borderRadius').val($(this).val());
                    o.css('border-radius',$(this).val()+'px');
                },
                'touchend':function(event){
                    opts.borderRadius = $(this).val();
                }
            });
            $('.button-rotate').on({
                'touchstart':function(e){
                    if (e.originalEvent) e = e.originalEvent;
                    var startX = s.touches.startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                    var startY = s.touches.startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                },
                'touchmove':function(e){
                    if (e.originalEvent) e = e.originalEvent;

                    s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

                    e.currentTarget.style.left = s.touches.currentX - s.touches.startX;

                    $('.button-rotate').val($(this).val());
                    o.css('transform','rotate('+$(this).val()+'deg)');
                },
                'touchend':function(event){
                    opts.rotate = $(this).val();
                }
            });


        }
		if(typeof(ele)=='undefined' || ele == null){
			this.add();
		}else{
			this.edit(ele);
		}


    }
	function buttonConfirm(){
        var cnd = $('<div class="cnd-element button-element">'
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
				+'<div class="nbar nbar-nw nbar-radius nbar-edit"><i class="glyphicon glyphicon-pencil"></i> </div>'
				+'<div class="nbar nbar-se nbar-radius"></div>'
				+'<div class="nbar nbar-sw nbar-radius"></div>'
				+'<div class="nbar nbar-ne nbar-radius"></div>'
			+'</div>');

		if(!isEdit){
			cnd.find('.element-box-contents').append(btn.clone());
			cnd.css({'top':$(window).height()/2-btn.height()/2+'px','left':$(window).width()/2-btn.width()/2+'px'})
			fullcontainer.append(cnd);
            scale(cnd);
		}else{
			currentElebox.empty().append(btn);
		}
		$('#button-model').removeClass('open')
	}

$(function(){
    $('#systemimg-model li').click(function(){
        $('#systemimg-model').removeClass('open');
        var eleobj = $('<div class="element systemimg '+$(this).attr('class')+'"></div>');

        addSystemimg(eleobj);
    });
})
var addSystemimg = function(eleobj){
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
				+'<div class="nbar nbar-nw nbar-radius nbar-edit" style="display: none;"><i class="glyphicon glyphicon-pencil"></i></div>'
				+'<div class="nbar nbar-se nbar-radius"></div>'
				+'<div class="nbar nbar-sw nbar-radius"></div>'
				+'<div class="nbar nbar-ne nbar-radius"></div>'
			+'</div>');
    cnd.find('.element-box-contents').append(eleobj);
    cnd.hide();
    fullcontainer.append(cnd);
    cnd.css({'top':$(window).height()/2-eleobj.height()/2+'px','left':$(window).width()/2-eleobj.width()/2+'px'}).show();
    scale(cnd);
}

var copySystemimg = function(){
    var imgclone = $('.systemimg-element.active').clone();
    $('.systemimg-element').removeClass('active');
    imgclone.animate({'top':parseInt(imgclone.css('top'))+30+'px','left':parseInt(imgclone.css('left'))+30+'px'},200);
    fullcontainer.append(imgclone);
    scale(imgclone);
}
var deleteSystemimg = function(){
    var imgactive = $('.systemimg-element.active');

    imgactive.animate({'width':'0','height':'0','top':parseInt(imgactive.css('top'))+imgactive.height()/2+'px','left':parseInt(imgactive.css('left'))+imgactive.width()/2+'px'},200,function(){
        imgactive.remove();
    });

}

var uploadSystemimg = function(eleobj){
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
				+'<div class="nbar nbar-nw nbar-radius nbar-edit" style="display: none;"><i class="glyphicon glyphicon-pencil"></i></div>'
				+'<div class="nbar nbar-se nbar-radius"></div>'
				+'<div class="nbar nbar-sw nbar-radius"></div>'
				+'<div class="nbar nbar-ne nbar-radius"></div>'
			+'</div>');
    cnd.find('.element-box-contents').append(eleobj);
    cnd.hide();
    fullcontainer.append(cnd);
    cnd.css({'top':$(window).height()/2-eleobj.height()/2+'px','left':$(window).width()/2-eleobj.width()/2+'px'}).show();
    scale(cnd);
}
var uploadSys = function(){

    $.uploads({
        success:function(){console.log("avxc");},
        error:function(){console.log("error");},
        url:'/api/v1/poster/upload/avatar'
    });

}