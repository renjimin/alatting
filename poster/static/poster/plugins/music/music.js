    var musiclinkButton = function(){
       	 //console.log(option);
       	 $("body").musicLink();
    }
    var musicuploadButton = function(){
    	$.fn.uploads.showDialog(function(data){
	$('.audiolink').empty().append('<audio autoplay></audio>');
	$('.audiolink audio').attr("src",data.file);
	console.log(data.file)
    	})
    }
    var musicbankButton = function(){
    	$(this).changeMusic({}, function (ths,img) {
    		console.log(222);
    	})
    }