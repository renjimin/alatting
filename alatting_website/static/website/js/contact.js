$(document).ready(function () {
    $('a.contact').click(function(){
        var target_element = 'div.' + $(this).attr('for');
        var target_container = $(this).parents().find('div.poster-top').find('div.poster-top-information');
        var target = $(target_container).find(target_element);
        if($(target).css('display') == 'none') {
            $(target_container).find('div.description').hide();
            $(target_container).find('div.contact-info').hide();
            $(target).show();
            $(target).css('display', 'table-cell');
        }
    });
     $('a.logo').click(function(){
         var target_container = $(this).parents().find('div.poster-top').find('div.poster-top-information');
         var target = $(target_container).find('div.description');
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
    $('a.a-button-trigger').click(function(e){
        e.preventDefault();
        if($(this).attr('extended') == 'false') {
            $(this).parents('div.poster-top').find('div.a-button-child').show();
            $(this).attr('extended','true');
        } else if($(this).attr('extended') == 'true') {
            $(this).parents('div.poster-top').find('div.a-button-child').hide();
            $(this).attr('extended','false');
        }
    })
    $('a.a-button-link').click(function(e){
        e.preventDefault();
        var cookie_target = $(this).attr('cookie');
        var enabled = Cookies.get(cookie_target);
        if(enabled === null) {
            Cookies.set(cookie_target,0);
            var img_enabled = $(this).find('img.enabled');
            var img_disabled = $(this).find('img.disabled');
            $(img_disabled).show();
            $(img_enabled).hide();
        }
    })
});