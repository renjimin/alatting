$(document).ready(function () {
    $('a.abutton-trigger').click(function(e){
        e.preventDefault();
        if($(this).attr('expressed') == 'false') {
            $(this).parents('div.abutton-group').find('div.abutton-contact').hide();
            $(this).parents('div.abutton-group').find('div.abutton-express').show();
            $(this).parents('div.abutton-group').find('div.abutton-express').find('img.hidden').hide();
            $(this).attr('expressed','true');
        } else if($(this).attr('expressed') == 'true') {
            $(this).parents('div.abutton-group').find('div.abutton-express').hide();
            $(this).parents('div.abutton-group').find('div.abutton-contact').show();
            $(this).attr('expressed','false');
        }
    })
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
     $('a.logo').click(function(){
         var target_container = $(this).parents().find('div.poster-header').find('div.header-information');
         var target = $(target_container).find('div.header-description');
         if($(target).css('display') == 'none') {
             $(target).show();
             $(target_container).find('div.contact-info').hide();
         }
    });
    $('a.location-info').click(function(){
        var target_map = $(this).parent().find('iframe.map');
        if($(target_map).css('display') == 'none') {
            $(target_map).show('fast');
        } else {
             $(target_map).hide('fast');
        }
    })
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