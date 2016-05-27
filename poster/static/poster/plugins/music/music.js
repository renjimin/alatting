    var musiclinkButton = function(){
       	 //console.log(option);
       	 $("body").musicLink();
    }
    var musicuploadButton = function(){
    	$.fn.uploadsaudio.showDialog(function(data){
    	$('.audiolink').empty().append('<audio autoplay  id= "background_music" loop="loop"></audio>');
    	$('.audiolink audio').attr("src",data.file);
          var bg_music = document.getElementById("background_music"); 
          if (bg_music.paused == false) {
              bg_music.pause();
          } else {
              bg_music.play();
         }
  	console.log(data)
  	$.fn.yunyeStorage.setHead('music',data.file);
        $.fn.yyTools.mask(0);
      	},function(data){

        })
    }
    var musicbankButton = function(){
    	$(this).changeMusic({}, function (ths,img) {
	$('.audiolink').empty().append('<audio autoplay  id = "background_music" loop="loop"></audio>');
	$('.audiolink audio').attr("src",img);
  console.log(img);
        var bg_music = document.getElementById("background_music"); 
        if (bg_music.paused == false) {
            bg_music.pause();
        } else {
            bg_music.play();
       }  
	console.log($.fn.yunyeStorage.setHead('music',img));
    	})
    }