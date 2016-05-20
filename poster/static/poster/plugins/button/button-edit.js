var currentElebox = null,isEdit = false,fullcontainer=$('.yunye-template');
var curentOpts={};


    var addButton = function(ele,options){
        var defaults = {
            'container':$("#button-model"),
            'href':'javascript:void(0)',
            'text':'请输入文字',
            'color':'000',
            'fontSize':'14',
            'fontFamily':'Microsoft YaHei',
            'background':'fff',
            'opacity':'1',
            'boxShadow':'0',
            'borderRadius':'3',
            'rotate':'0',
            'borderColor':'fff',
            'borderStyle':'solid',
            'borderWidth':'1',
            'height':'34'/*默认高度*/
        }

        defaults.container.addClass('open');
        var opts = $.extend(defaults,options),s = this;

        s.add = function(){
            isEdit = false;
            var newbtn = null;
            newbtn = $('<a class="element btn btn-default">请输入文字</a>')
            defaults.container.find('.btn-container').empty().append(newbtn);
            s.controlInit();
            s.upload(newbtn);

        }
        s.edit = function(element){
            isEdit = true;
            var editbtn = null;
            editbtn = element.clone(false);
            defaults.container.find('.btn-container').empty().append(editbtn);
            currentElebox = element.parent();
            //s.upload(btn);
            s.controlInit(editbtn);
        }
        $('#buttonConfirm').unbind();
        $('#buttonConfirm').on('click',function(){
            var newbtn = $("#button-model").find('.element').eq(0);
            //console.log(newbtn);
            buttonConfirm(newbtn);
        });
        s.upload = function(o){
            o.html(opts.text);
            o.attr({
                'href':opts.href,
            })
            o.css({
                'color':'#'+opts.color,
                'font-size':opts.fontSize+'px',
                'font-family':opts.fontFamily,
                'background':'#'+opts.background,
                'opacity':opts.opacity,
                'box-shadow':'0 0 '+opts.boxShadow+' #000',
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
                    'fontSize': parseInt($(b).css('font-size')),
                    'fontFamily': $(b).css('font-family').replace(/'/g,""),
                    'background': $(b).css('background'),
                    'opacity': $(b).css('opacity'),
                    'boxShadow':$(b).css('box-shadow-spread'),
                    'borderRadius':$(b).css('border-radius'),
                    'rotate':$2,
                    'borderColor':$(b).css('border-color'),
                    'borderStyle':$(b).css('border-style'),
                    'borderWidth':$(b).css('border-width'),
                    'height':$(b).innerHeight()
                }
                opts = $.extend(opts,eleopts);
            }



            var href = opts.href=="javascript:void(0)"?'':opts.href
            $('.button-href').val(href);
            $('.button-text').val(opts.text);
            $('.button-color').css('background','#'+opts.color);
            for(i=12;i<30;i++){
                $('.button-fontSize').append('<option value="'+i+'">'+i+'px</option>')
            }
            $('.button-fontSize').val(opts.fontSize);
            $('.button-fontFamily').val(opts.fontFamily);
            $('.button-background').css('background','#'+opts.background).attr('data-backgorund',opts.background);
            $('.button-opacity').val(opts.opacity*100);
            $('.button-boxShadow').val(opts.boxShadow);
            $('.button-borderRadius').val(opts.borderRadius).attr('max',opts.height/2);
            $('.button-borderColor').val(opts.borderColor);
            $('.button-borderStyle').val(opts.borderStyle);
            for(i=0;i<20;i++){
                $('.button-borderWidth').append('<option value="'+i+'">'+i+'px</option>')
            }
            $('.button-borderWidth').val(opts.borderWidth);

        }
        s.addControlListen = function(){
            var elebtn = $("#button-model").find('.element').eq(0);

            $('.button-href').off('input propertychange').on('input propertychange',function(){
                opts.href = $(this).val();
                elebtn.attr({'href':opts.href})
            });
            $('.button-text').off('input propertychange').on('input propertychange',function(){
                opts.text = $(this).val();
                elebtn.html(opts.text);
            });
            $('.button-fontSize').off('change').on('change',function(){
                opts.fontSize = $(this).val();
                elebtn.css('font-size',opts.fontSize+'px');
            });
            $('.button-fontFamily').off('change').on('change',function(){
                opts.fontFamily = $(this).val();
                elebtn.css('font-family',opts.fontFamily);
            });
            $('.button-borderStyle').off('change').on('change',function(){
                opts.borderStyle = $(this).val();
                elebtn.css('border-style',opts.borderStyle);
            });
            $('.button-borderWidth').off('change').on('change',function(){
                opts.borderWidth = $(this).val();
                elebtn.css('border-width',opts.borderWidth);
            });
            $('.button-borderColor').off('change').on('change',function(){
                opts.borderColor = $(this).val();
                elebtn.css('border-color','#'+opts.borderColor);
                $(this).css('background','#'+opts.borderColor);
            });
            $('.button-color').off('change').on('change',function(){
                opts.color = $(this).val();
                elebtn.css('color','#'+opts.color);
                $(this).css('background','#'+opts.color);
            });
            $('.button-background').off('change').on('change',function(){
                opts.background = $(this).val();
                elebtn.css('background','#'+opts.background);
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
                    elebtn.css('opacity',$(this).val()/100)
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
                    elebtn.css('box-shadow','0 0 '+$(this).val()+'px #000');
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
                    elebtn.css('border-radius',$(this).val()+'px');
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
                    elebtn.css('transform','rotate('+$(this).val()+'deg)');
                },
                'touchend':function(event){
                    opts.rotate = $(this).val();
                    elebtn.attr('data-rotate',$(this).val());
                }
            });


        }
        if(typeof(ele)=='undefined' || ele == null){
            this.add();
        }else{
            this.edit(ele);
        }

        s.addControlListen();




    }
    function buttonConfirm(ele){
        var cnd = $('<div class="cnd-element button-element">'
                +'<div class="element-box">'
                +'    <div class="element-box-contents">'
                +'        '
                +'    </div>'
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
            cnd.find('.element-box-contents').append(ele);
            cnd.hide();
            if(ele.data('rotate') != null){
                ele.css('transform','rotate(0)');
                cnd.css('transform','rotate('+ele.data('rotate')+'deg)').attr('data-rotate',ele.data('rotate'));
            }
            fullcontainer.append(cnd);
            cnd.css({'top':fullcontainer.height()/2-cnd.innerHeight()/2+'px','left':fullcontainer.width()/2-cnd.innerWidth()/2+'px'}).show();
            scale(cnd);
        }else{
            if(ele.data('rotate') != null){
                ele.css('transform','rotate(0)');
                currentElebox.parent().parent().css('transform','rotate('+ele.data('rotate')+'deg)').attr('data-rotate',ele.data('rotate'));
            }
            currentElebox.empty().append(ele);
        }
        $('#button-model').removeClass('open')
    }
var editButtonBasic = function(){
    var e = window.event || event;
    e.stopPropagation();
    if (e.originalEvent) e = e.originalEvent;
    var ele = $(e.target);
    if($(ele).hasClass('icon')){
        ele = ele.parent();
    }

    $("#button-basic").show();
    $("#button-border").hide();
    if(!$('#button-model').hasClass('open')){
        $('#button-model').css('max-height',$(window).height() - 87 +'px').addClass('open');
        addButton();
    }
    ele.addClass('open').siblings().removeClass('open');
}
var editButtonBorder = function(){
    var e = window.event || event;
    e.stopPropagation();
    if (e.originalEvent) e = e.originalEvent;
    var ele = $(e.target);
    if($(ele).hasClass('icon')){
        ele = ele.parent();
    }

    $("#button-basic").hide();
    $("#button-border").show();
    if(!$('#button-model').hasClass('open')){
        $('#button-model').css('max-height',$(window).height() - 87 +'px').addClass('open');
        addButton();
    }
    ele.addClass('open').siblings().removeClass('open');
}
var copyButton = function(){
    var imgclone = $('.button-element.active').clone();
    $('.button-element').removeClass('active');
    imgclone.animate({'top':parseInt(imgclone.css('top'))+30+'px','left':parseInt(imgclone.css('left'))+30+'px'},200);
    fullcontainer.append(imgclone);
    scale(imgclone);
}
var deleteButton = function(){
    var imgactive = $('.button-element.active');

    imgactive.animate({'width':'0','height':'0','top':parseInt(imgactive.css('top'))+imgactive.height()/2+'px','left':parseInt(imgactive.css('left'))+imgactive.width()/2+'px'},200,function(){
        imgactive.remove();
    });

}


$(function(){
    /*$('#systemimg-model ul').click(function(event){
        event.stopPropagation();
        var _this = $(this);
        $('#systemimg-model').removeClass('open');
        var eleobj = $('<div class="element systemimg"></div>');
        var current = $(event.target);
        console.log(current.tagName);
        eleobj.css({'width':current.width(),'height':current.height()});
        eleobj.append(current);
        addSystemimg(eleobj);
    });*/
    /*页面第一次加载就开始加载系统图案*/
    $.ajax({
        type: 'GET',
        url: 'http://www.yunye123.com:8000/api/v1/poster/system/images',
        success: function(data){
            var con = $('#systemimg-model .systemimg-list ul');
            con.empty();
            for(i=0;i<data.length;i++){
                var li = '<li onclick="selectSysImg(this)">'+data[i].text+'</li>';
                con.append(li);
            }

        },
    });
})
var selectSysImg = function(obj){
    $('#systemimg-model').removeClass('open');
    var eleobj = $('<div class="element systemimg"></div>');
    eleobj.css({'width':$(obj).find('svg').width(),'height':$(obj).find('svg').height()});
    eleobj.append($(obj).find('svg'));
    addSystemimg(eleobj);

}

var openSystemimg = function(){
    var e = window.event || event;
    e.stopPropagation();
    if (e.originalEvent) e = e.originalEvent;
    var ele = $(e.target);
    if($(ele).hasClass('icon')){
        ele = ele.parent();
    }

    if($('#systemimg-model').hasClass('open')){
        $('#systemimg-model').removeClass('open');
        ele.removeClass('open');
    }else{

        $('#systemimg-model').css('max-height',$(window).height() - 87 +'px').addClass('open');
        ele.addClass('open');
    }

}

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
				+'<div class="nbar nbar-nw nbar-radius"></div>'
				+'<div class="nbar nbar-se nbar-radius"></div>'
				+'<div class="nbar nbar-sw nbar-radius"></div>'
				+'<div class="nbar nbar-ne nbar-radius"></div>'
			+'</div>');

    cnd.find('.element-box-contents').append(eleobj);
    cnd.hide();
    fullcontainer.append(cnd);
    cnd.css({'top':fullcontainer.height()/2-eleobj.height()/2+'px','left':fullcontainer.width()/2-eleobj.width()/2+'px'}).show();
    scale(cnd);
}

var copySystemimg = function(){
    var imgclone = $('.systemimg-element.active').clone(false);
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

    $.fn.uploads.showDialog(function(data){
        console.log(data);
        var img = $('<div class="element"><img src="'+data.file+'" /></div>');

         if(data.width > $(window).width()){
             img.width( $(window).width() *.6);
             img.height($(window).width() *.6*data.height / data.width);
         }
        addSystemimg(img);
    },function(data){
         console.log(data);
    });

}
function deleteElement(){
    var imgactive = $('.systemimg-element.active');

    imgactive.animate({'width':'0','height':'0','top':parseInt(imgactive.css('top'))+imgactive.height()/2+'px','left':parseInt(imgactive.css('left'))+imgactive.width()/2+'px'},200,function(){
        imgactive.remove();
    });
}
$(function(){
    document.onkeyup = function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        switch (keyCode) {
            case 46:
                deleteElement();
                break;
            default:
                break;
        }
    }
})
