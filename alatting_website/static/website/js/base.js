String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

(function($){
    $.fn.yyTools = {
        "getAllowFileTypesAll": function(){
            return  [
                "jpg", "jpeg", "gif", "png",
                "flv", "webm", "mp4", "ogg",
                "mp3"
            ];
        },
        "getAllowFileTypes": function(){
            return {
                "image": ["jpg", "jpeg", "gif", "png"],
                "video": ["webm", "mp4", "ogg"],
                "music": ["mp3"]
            }
        },
        'getFileExtension': function(fileName){
            return fileName.split('.').pop().toLowerCase();
        },
        "allowedFileType": function(fileName){
            var ret = $.inArray(
                $.fn.yyTools.getFileExtension(fileName),
                $.fn.yyTools.getAllowFileTypesAll()
            );
            return ret != -1;
        },
        "getFileTypeName": function(fileName){
            if(!$.fn.yyTools.allowedFileType(fileName)){
                yyAlert("不接受此文件类型");
                return;
            }
            var ext = $.fn.yyTools.getFileExtension(fileName),
                types = $.fn.yyTools.getAllowFileTypes(),
                name = "";
            $.each(types, function(tName, tArr){
                if($.inArray(ext, tArr) != -1){
                    name = tName;
                    return false;
                }
            });
            return name;
        },
        "mask": function(toggle){
            var $m = $(".yunye-template-mask");
            if(toggle) {
                $m.show();
            } else {
                $m.hide();
            }
        }
    }
})(jQuery);


(function () {
	function yyAlert(text,callback,params){
        var defaults = {
            'okText':'知道了'
        }
        var options = extend(defaults,params);

        var alertEle = document.getElementById('yyalert-dialog'), coverbox,popbox,yyBtnConfirm;

		if(alertEle == undefined || alertEle.length <= 0){
            var cover = '<div id="yyalert-cover" class="yyalert-cover" style=""><div class="yyalert-cover-inner"></div></div>';
    		var divelement = '<div class="yyalert" id="yyalert"><div class="yyalert-text">'+text+'</div><div class="yyalert-footer"><a href="javascript:void(0);" id="yyBtnAlert" class="yyalert-btn">知道了</a></div></div>';
            alertEle = document.createElement('div');
            alertEle.setAttribute('id','yyalert-dialog');
            alertEle.innerHTML = cover + divelement;

    		document.body.appendChild(alertEle);
		}
        coverbox = document.getElementById('yyalert-cover');
        popbox = document.getElementById('yyalert');
        yyBtnConfirm = document.getElementById('yyBtnAlert');

        /* set */
        yyBtnConfirm.innerHTML = options.okText;
        popbox.children[0].innerHTML = text;
        /* position */
        popbox.style.marginTop = - popbox.offsetHeight/2+'px';
        popbox.style.marginLeft =  -popbox.offsetWidth/2+'px';
        setTimeout(function(){
            alertEle.classList.add('open');
        },50);
        coverbox.onclick=function(){
            alertEle.classList.remove('open');
        }
        yyBtnConfirm.onclick=function(){
            alertEle.classList.remove('open');
            if(callback!=null && typeof(eval(callback)) == "function"){
				callback();
			}
        }
	}
	window.yyAlert = yyAlert;
})();
(function () {
	function yyConfirm(text,callback,params){
		var defaults = {
            'okText':'知道了',
			'cancelText':'取消',
			'cancelFun':null
        }
		var options = extend(defaults,params);

        var confirmEle = document.getElementById('yyconfirm-dialog'), coverbox, popbox, yyBtnConfirm,yyBtnCancel;
        if(confirmEle == undefined || confirmEle.length <= 0){
            var cover = '<div id="yyconfirm-cover" class="yyalert-cover" style=""><div class="yyalert-cover-inner"></div></div>';
    		var divelement = '<div class="yyalert" id="yyconfirm"><div class="yyalert-text">'+text+'</div><div class="yyalert-footer"><a href="javascript:void(0);" id="yyBtnCancel" class="yyalert-btn">取消</a><a href="javascript:void(0);" id="yyBtnConfirm" class="yyalert-btn">知道了</a></div></div>';
            confirmEle = document.createElement('div');
            confirmEle.setAttribute('id','yyconfirm-dialog');
            confirmEle.innerHTML = cover + divelement;
                            document.body.appendChild(confirmEle);
		}
        coverbox = document.getElementById('yyconfirm-cover');
        popbox = document.getElementById('yyconfirm');
        yyBtnConfirm = document.getElementById('yyBtnConfirm');
        yyBtnCancel = document.getElementById('yyBtnCancel');
		/* set */
		yyBtnConfirm.innerHTML = options.okText;
		yyBtnCancel.innerHTML = options.cancelText;
        popbox.children[0].innerHTML = text;

        popbox.style.marginTop = - popbox.offsetHeight/2+'px';
        popbox.style.marginLeft =  - popbox.offsetWidth/2+'px';
        setTimeout(function(){
            confirmEle.classList.add('open');
        },50);
        coverbox.onclick=function(){
            confirmEle.classList.remove('open');
        }
        yyBtnCancel.onclick=function(){
            confirmEle.classList.remove('open');
			if(options.cancelFun!=null && typeof(eval(options.cancelFun)) == "function"){
				options.cancelFun();
			}
        }
        yyBtnConfirm.onclick=function(){
            confirmEle.classList.remove('open');
            if(callback!=null && typeof(eval(callback)) == "function"){
				callback();
			}
        }

	}
	window.yyConfirm = yyConfirm;
})();
(function () {
	function yyMessage(text){
        var yymessage = document.getElementById('yymessage');

		if(yymessage == undefined || yymessage.length <= 0){
    		var divelement = '<div class="yymessage-txt"></div>';
            yymessage = document.createElement('div');
            yymessage.setAttribute('id','yymessage');
			yymessage.setAttribute('class','yymessage');
            yymessage.innerHTML = divelement;
    		document.body.appendChild(yymessage);
		}

        yymessage.children[0].innerHTML = text;

        yymessage.classList.add('open');
        setTimeout(function(){
            yymessage.classList.remove('open');
        },3000);

	}
	window.yyMessage = yyMessage;
})();
function extend(destination, source) {
    for (var property in source)
    destination[property] = source[property];
    return destination;
}


