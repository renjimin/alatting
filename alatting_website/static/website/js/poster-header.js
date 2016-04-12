$(document).ready(function () {
    //click the logo image in the center to toogle different abuttons
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
    ////location
    /*
    //////display google map
    $('a.location-info').click(function(){
        var target_map = $(this).parent().find('iframe.map');
        if($(target_map).css('display') == 'none') {
            $(target_map).show('fast');
        } else {
             $(target_map).hide('fast');
        }
    })
    */

    //4 buttons in the second layer
    /*
    $('a.abutton-express').click(function(e){
        e.preventDefault();
        var cookie_target = $(this).attr('cookie');
        var enabled = Cookies.get(cookie_target);
        if(enabled === undefined) {
            Cookies.set(cookie_target,0);
            var img_enabled = $(this).find('img.enabled');
            var img_disabled = $(this).find('img.disabled');
            $(img_disabled).removeClass('hidden');
            $(img_enabled).addClass('hidden');
        }
    })
    */
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
    //click logo to show header description
     $('a.logo').click(function(){
         var target_container = $(this).parents().find('div.poster-header').find('div.header-information');
         var target = $(target_container).find('div.header-description');
         if($(target).css('display') == 'none') {
             $(target).show();
             $(target_container).find('div.contact-info').hide();
         }
    });
    //header description
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
