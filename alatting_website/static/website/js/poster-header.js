$(document).ready(function () {
    //click the logo image in the center to toogle abuttons in two layers
    $('a.abutton-trigger').click(function(e){
        e.preventDefault();
        if($(this).attr('expressed') == 'false') {
            $(this).parents('div.abutton-group').find('div.abutton-contact').hide();
            $(this).parents('div.abutton-group').find('div.abutton-express').show();
           // $(this).parents('div.abutton-group').find('div.abutton-express').find('img.hidden').hide();
            $(this).attr('expressed','true');
        } else if($(this).attr('expressed') == 'true') {
            $(this).parents('div.abutton-group').find('div.abutton-express').hide();
            $(this).parents('div.abutton-group').find('div.abutton-contact').show();
            $(this).attr('expressed','false');
        }
    })
    //4 abuttons in the first layer
    ////contact (phone & email & hours)
    $('a.abutton-contact').click(function(){
        var target_element = 'div.' + $(this).attr('for');
        var target_container = $(this).parents().find('div.poster-header').find('div.header-information');
        var target = $(target_container).find(target_element);
        if($(target).css('display') == 'none') {
            $(target_container).find('div.header-description').hide();
            $(target_container).find('div.contact-info').hide();
            $(target).show();
        }
    });
    ////hours expand
    $('a.more-info').click(function(){
        var more_info_target = $(this).parent().find('div.poster-top-inform-more');
         if($(more_info_target).css('display') == 'none') {
             $(more_info_target).show();
             $(more_info_target).parent().addClass("expanded");
         } else {
             $(more_info_target).hide();
             $(more_info_target).parent().removeClass("expanded");
         }
    })
    $('a.location-info').click(function(){
         if($('div#map').css('display') == 'none') {
             $('div#map').show();
         } else {
             $('div#map').hide();
         }
    })
    $(".expander").click(function() {
        if ($(this).hasClass("expander")) {
            $(this).removeClass("expander");
            $(this).addClass("expanded");
        }
        else {
            $(this).removeClass("expanded");
            $(this).addClass("expander");
        }
    });

    //4 buttons in the second layer
    ////like
    $(".abutton-like").click(function(){
        if($(".abutton-like").find('img:visible').attr('src').split("/").pop()=="express-like.png")
        {   
            liked();
        } else{
            alert("You already liked it!");
        }
     
    });
    ////fun
    $(".abutton-fun").click(function(){
        if($(".abutton-fun").find('img:visible').attr('src').split("/").pop()=="express-fun.png")
        {   
            fun();
        } else{
            alert("Your IP already clicked it!");
        }
    });
    ////bookmark
    $(".abutton-bookmark").click(function(){
        if($(".abutton-bookmark").find('img:visible').attr('src').split("/").pop()=="express-bookmark.png")
        {   
            bookmarked();
        } else{
            alert("Your already bookmarked it!");
        }
    });
    //subscribe
    $(".abutton-subscribe").click(function(){
        var baseURL = location.protocol + "//" + location.hostname + (location.port && ":" + location.port);
        var rssURL = baseURL + "/poster/rss";
        window.open(rssURL); 
    });
    
    
    //click logo to show header description
     $('a.logo').click(function(){
         var target_container = $(this).parents().find('div.poster-header').find('div.header-information');
         var target = $(target_container).find('div.header-description');
         if($(target).css('display') == 'none') {
             $(target).show();
             $(target_container).find('div.contact-info').hide();
         }
    });
});

function liked(){
    $.post(likedURL).done(function(object){
        $(".abutton-like").find('img:visible').attr('src', $(".abutton-like").find('img:visible').attr('src').split(".")[0]+"-disabled.png");
        alert("Thanks for your like!");
    }).fail(function(jqXHR){
        if(jqXHR.status == 401 || jqXHR.status == 403){
            window.location.href = loginURL
        }
    })
}

function fun(){
    $.post(funURL).done(function(object){
        $(".abutton-fun").find('img:visible').attr('src', $(".abutton-fun").find('img:visible').attr('src').split(".")[0]+"-disabled.png");
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
        $(".abutton-bookmark").find('img:visible').attr('src', $(".abutton-bookmark").find('img:visible').attr('src').split(".")[0]+"-disabled.png");
        alert("Thanks for your favorites!");
    }).fail(function(jqXHR){
        if(jqXHR.status == 401 || jqXHR.status == 403){
            window.location.href = loginURL
        }
    })
}