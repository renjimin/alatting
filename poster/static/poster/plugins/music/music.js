    var musiclinkButton = function(){
       	 //console.log(option);
       	 $("body").musicLink();
    }
    var musicuploadButton = function(){
    	$.fn.uploads.showDialog(function(data){
               var filename = data.file.split(".")[1];
              if(!/\.(mp3)$/.test(data.file)){
                    yyAlert("上传音频格式错误");
                    return false;
               }
	$('.audiolink').empty().append('<audio autoplay loop="loop"></audio>');
	$('.audiolink audio').attr("src",data.file);
	yyAlert("上传音乐成功");
	console.log(data)
	$.fn.yunyeStorage.setHead('music',data.file);
    	})
    }
    var musicbankButton = function(){
    	$(this).changeMusic({}, function (ths,img) {
	$('.audiolink').empty().append('<audio autoplay loop="loop"></audio>');
	$('.audiolink audio').attr("src",img);
	console.log($.fn.yunyeStorage.setHead('music',img));
    	})
    }