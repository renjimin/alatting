$(function(){
	loadMusic();
})
function loadMusic(){
	$.ajax({
             type: "GET",
             url: "/api/v1/account/files?q=audio",
             data: {},
             dataType: "json",
             success: function(data){
                         $('.music-list').empty();  
                         var html = ''; 
                         $.each(data, function(){
                               html += '<li class="item">\
	            					<a href="javascript:void(0);" class="music-link">\
	            						<i class="icon ico-music-preview"></i>\
	            						<span class="music-text">4.mp3</span>\
	            						<i class="icon ico-play"></i>\
	            					</a>\
	            					<a href="javascript:void(0);" class="music-close"></a>\
	            				</li>';
                         });
                         $('.music-list').html(html);
                      }
         });
}

function addMusic(){
	$.fn.uploadsaudio.showDialog(function(data){
		console.log(data)
		loadMusic();
	},function(data){
		console.log(data)
	})
}