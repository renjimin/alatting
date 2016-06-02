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
                               html += '<li class="item play">\
	            					<a href="javascript:void(0);" class="music-link">\
	            						<i class="icon ico-music-preview"></i>\
	            						<span class="music-text">'+this.id+'.'+this.format+'</span>\
	            						<i class="icon ico-play"></i>\
	            						<i class="icon ico-pause"></i>\
	            					</a>\
	            					<a href="javascript:void(0);" class="music-close"></a>\
	            					<audio src="'+this.file+'" loop></audio>\
	            				</li>';
                         });
                         $('.music-list').html(html);
                      }
        });

	$('.music-list').click(function(e){
		var target = $(e.target).closest('.music-link');
		var audio = target.parent().find('audio')[0];

		target.parent().siblings().each(function(){
			$(this).find('audio')[0].pause();//
			$(this).removeClass('pause').addClass('play');
		});
		target.parent().addClass('actived').siblings().removeClass('actived');

		if(target.parent().hasClass('play')){
			target.parent().removeClass('play').addClass('pause');
			audio.play();
		}else{
			target.parent().removeClass('pause').addClass('play');
			audio.pause();
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