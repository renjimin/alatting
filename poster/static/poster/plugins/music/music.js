    var musiclinkButton = function(){
       	 //console.log(option);
       	 $("body").musicLink();
    }
    var musicuploadButton = function(){
    	$.fn.uploads.showDialog(function(data){
	$('.header-info').empty().append('<audio autoplay></audio>');
	$('.header-info audio').attr("src",data.file);
    	})
    }
    var musicbankButton = function(){
    	$(this).changeMusic({}, function (ths,img) {
    		console.log(222);
    	})
    }