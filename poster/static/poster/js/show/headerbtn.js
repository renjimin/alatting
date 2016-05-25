$(function(){
	$(document).click(function(){
		$('.header-info .header-description').show();
		$('.header-info .contact-info').hide();
		hideMap();
	});
	//4 abuttons in the first layer
	////contact (phone & email & hours)
	$('a.abutton-contact').click(function(e){
		hideMap();
		var target_element = 'div.' + $(this).attr('for');
		var target_container = $('.header-info');
		var target = $(target_container).find(target_element);
		if($(target).css('display') == 'none') {
			$(target_container).find('div.header-description').hide();
			$(target_container).find('div.contact-info').hide();
			$(target).show();
		}
		return false;
	});
	$(".contact-info.location").click(function(){
		togleMap();
		return false;
	});
	//click the logo image in the center to toogle abuttons in two layers
	$('a.abutton-trigger').click(function(e){
		e.preventDefault();
		if($(this).attr('expressed') == 'false') {
			$(this).parents('div.abutton-inner').removeClass("open");
			$(this).attr('expressed','true');
		}else if($(this).attr('expressed') == 'true') {
			$(this).parents('div.abutton-inner').addClass("open");
			$(this).attr('expressed','false');
		}
	});
	//4 buttons in the second layer
	////like
	$(".abutton-like").click(function(){
		if(!$(".abutton-like.clicked")[0]){   
			liked();
		} else{
			alert("You already liked it!");
		}
	});
	////fun
	$(".abutton-fun").click(function(){
		if(!$(".abutton-fun.clicked")[0]){   
			fun();
		} else{
			alert("Your IP already clicked it!");
		}
	});
	////bookmark
	$(".abutton-bookmark").click(function(){
		if(!$(".abutton-bookmark.clicked")[0]){   
			bookmarked();
		} else{
			alert("Your already bookmarked it!");
		}
	});
	//subscribe
	$(".abutton-subscribe").click(function(){
		if(!$(".abutton-subscribe.clicked")[0]){   
			subscribed();
		} else{
			alert("You already subscribed it!");
		}
	});
	//music
	$('#music').click(function() {
		var bg_music = document.getElementById("background_music"); 
		if (bg_music.paused == false) {
			bg_music.pause();
			$(".header-music").removeClass('rotate');
		} else {
			bg_music.play();
			$(".header-music").addClass('rotate');
		}
	});
});
function togleMap(){
	var mapDiv = $("#allmap").parents("div").eq(0),
		mapState = (mapDiv.css("visibility") == "visible")?true:false;
	if(mapState){
		hideMap();
	}else{
		showMap(mapDiv);
	}
}
function showMap(mapDiv){
	mapDiv.css("top",$("header.header").offset().top + $("header.header").height());
	mapDiv.css("visibility","visible");
	$("header.header").height($("header.header").height() + 300);
}
function hideMap(){
	var mapDiv = $("#allmap").parents("div").eq(0),
		mapState = (mapDiv.css("visibility") == "visible")?true:false;
	if(mapState)$("header.header").height($("header.header").height() - 300);
	mapDiv.css("visibility","hidden");
}
function liked(){
	$.post(likedURL).done(function(object){
		$(".abutton-like").addClass("clicked");
		alert("Thanks for your like!");
	}).fail(function(jqXHR){
		if(jqXHR.status == 401 || jqXHR.status == 403){
			window.location.href = loginURL
		}
	})
}

function fun(){
	$.post(funURL).done(function(object){
		$(".abutton-fun").addClass("clicked");
		alert("Glad you have fun!");
	}).fail(function(jqXHR){
	})
}

function bookmarked(){
	$.post(bookmarkURL).done(function(object){
		if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
			window.sidebar.addPanel(document.title,window.location.href,'');
		} else if(window.external && ('AddFavorite' in window.external)) { // IE Favorite
			window.external.AddFavorite(location.href,document.title); 
		} else if(window.opera && window.print) { // Opera Hotlist
			this.title=document.title;
			return true;
		} else { // webkit - safari/chrome
			alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
		}    
		$(".abutton-bookmark").addClass("clicked");
		alert("Thanks for your favorites!");
	}).fail(function(jqXHR){
		if(jqXHR.status == 401 || jqXHR.status == 403){
			window.location.href = loginURL
		}
	})
}
function subscribed(){
	$.post(subscribedURL).done(function(object){
		$(".abutton-subscribe").addClass("clicked");
		alert("Thanks for your subsription!");
	}).fail(function(jqXHR){
		if(jqXHR.status == 401 || jqXHR.status == 403){
			window.location.href = loginURL
		}
	})
}