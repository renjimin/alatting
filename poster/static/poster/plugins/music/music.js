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
	$('.audiolink').empty().append('<audio autoplay  id= "background_music" loop="loop"></audio>');
	$('.audiolink audio').attr("src",data.file);
        var bg_music = document.getElementById("background_music"); 
        if (bg_music.paused == false) {
            bg_music.pause();
            $(".header-music").removeClass('rotate');
        } else {
            bg_music.play();
            $(".header-music").addClass('rotate');
       }
	yyAlert("上传音乐成功");
	console.log(data)
	$.fn.yunyeStorage.setHead('music',data.file);
    	})
    }
    var musicbankButton = function(){
    	$(this).changeMusic({}, function (ths,img) {
	$('.audiolink').empty().append('<audio autoplay  id = "background_music" loop="loop"></audio>');
	$('.audiolink audio').attr("src",img);
        var bg_music = document.getElementById("background_music"); 
        if (bg_music.paused == false) {
            bg_music.pause();
            $(".header-music").removeClass('rotate');
        } else {
            bg_music.play();
            $(".header-music").addClass('rotate');
       }  
	console.log($.fn.yunyeStorage.setHead('music',img));
    	})
    }