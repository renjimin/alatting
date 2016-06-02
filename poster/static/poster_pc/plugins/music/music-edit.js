$(function(){
	loadMusic();
})
function loadMusic(){
	$.ajax({
             type: "GET",
             url: "/api/v1/account/audios",
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
	            					<a href="javascript:void(0);" class="music-close" data-id="'+this.id+'"></a>\
	            					<audio src="'+this.file+'" loop></audio>\
	            				</li>';
                         });
                         $('.music-list').html(html);
                      }
        });

	$('.music-list').click(function(e){
		var target = $(e.target).closest('.music-link');
		var audio = target.parent().find('audio')[0];
		if(target.length > 0){
			target.parent().siblings().each(function(){
				$(this).find('audio')[0].pause();
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
		}

		var closetarget = $(e.target).closest('.music-close');
		if(closetarget.length > 0){
			$.ajax({
		             type: "DELETE",
		             url: "/api/v1/account/audios/"+closetarget.attr('data-id'),
		             data: {},
		             dataType: "json",
		             success: function(data){
		                        closetarget.parent().stop(true,false).animate({'width':'0','opacity':'0'},200,function(){
		                        		closetarget.parent().remove();
		                        });
		              }
		        });
		}

		
	});

}
function addMusicOne(data){
	var html = $('<li class="item play">\
			<a href="javascript:void(0);" class="music-link">\
			<i class="icon ico-music-preview"></i>\
			<span class="music-text">'+data.id+'.'+data.format+'</span>\
			<i class="icon ico-play"></i>\
			<i class="icon ico-pause"></i>\
		</a>\
		<a href="javascript:void(0);" class="music-close"></a>\
		<audio src="'+data.file+'" loop></audio>\
		</li>');
	 html.width(0);
	 $('.music-list').prepend(html);
	 html.animate({'width':'33.3333333%'},200);
}

function addMusic(){
	$.fn.uploadsaudio.showDialog(function(data){
		addMusicOne(data);
	},function(data){
		console.log(data)
	})
}

function resouceMusic(){
	var url = $('#music-resouce').val();
	if(url == "") return;
	var typeName = $.fn.yyTools.getFileTypeName(url);
	if(typeName == undefined) return;
	$('.btn-music-controller audio').attr('src',url);
	
	$('.btn-music-controller audio')[0].play();
	$('.btn-music-controller').slideDown();

}

$(function(){
	$('.btn-music-controller').click(function(){
		if($(this).hasClass('pause')){
			$(this).removeClass('pause').find('audio')[0].play();
		}else{
			$(this).addClass('pause').find('audio')[0].pause();
		}
	});
})