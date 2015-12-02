/**
 * Created by ubuntu on 10/19/15.
 */
$(document).ready(function () {
    function setSelectedSrc(selected, src) {
        var name = '_selected'
        var pattern = new RegExp(name + '$');
        var parts = src.split('.')
        var hasName = parts[0].match(pattern);
        if (selected) {
            if (!hasName) {
                parts[0] += name;
                src = parts[0] + '.' + parts[1];
            }
        }
        else {
            if (hasName) {
                parts[0] = parts[0].replace(pattern, '');
                src = parts[0] + '.' + parts[1];
            }
        }
        return src;
    }

    var popover = $('[data-toggle="sub-menu"]').popover({animation: true})
    popover.on('show.bs.popover', function (evt) {
        var $img = $(this).find('img');
        var src = $img.attr('src');
        src = setSelectedSrc(true, src);
        $img.attr("src", src);
    });
    popover.on('inserted.bs.popover', function(evt){
        $(".rating").rating()
            .on('rating.change', function(event, value, caption) {
            ratingRate(value)
        });
        $('.doughnut').doughnut();
        //rate
        updateRateUI()
    });
    popover.on('shown.bs.popover', function () {
        // make the top of the popover relative
        var popover = $(this).data('bs.popover');
        var $tip = popover.$tip;
        var top = $tip.position().top / $tip.parent().outerHeight() * 100 + '%';
        $tip.css('top', top);
    });
    popover.on('hide.bs.popover', function (evt) {
        var $img = $(this).find('img');
        var src = $img.attr('src');
        src = setSelectedSrc(false, src);
        $img.attr("src", src);
    });
    //for comments menu
    $('.comments-btn').on('show.bs.popover', function(evt){
        $('#comments-submenu').fadeIn({duration: 300})
    })
    $('.comments-btn').on('hide.bs.popover', function(evt){
        $('#comments-submenu').fadeOut({duration: 300})
    })
});
// dismiss popover
$('body').on('click', function (e) {
    $('[data-toggle="sub-menu"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        //&& $('.popover').has(e.target).length === 0
        $this = $(this);
        if (!$this.is(e.target) && $this.has(e.target).length === 0) {
            var tipId = $this.attr('aria-describedby');
            if (tipId) {
                $this.triggerHandler('click');
            }
        }
    });
});

var poster_statistics = null

function updateRateUI(){
    if(!poster_statistics) return
    var menu = $('.rate-submenu')
    if(!menu.length) return
    menu.find('.rate-rating').html(poster_statistics.ratings_average)
    menu.find('.rating-count').html(poster_statistics.ratings_count)
    menu.find('.rating-average').rating('update', poster_statistics.ratings_average)
    menu.find('.rate-five').css('width', poster_statistics.five_percent + '%')
    .html(poster_statistics.five_count)
    menu.find('.rate-four').css('width', poster_statistics.four_percent + '%')
    .html(poster_statistics.four_count)
    menu.find('.rate-three').css('width', poster_statistics.three_percent + '%')
    .html(poster_statistics.three_count)
    menu.find('.rate-two').css('width', poster_statistics.two_percent + '%')
    .html(poster_statistics.two_count)
    menu.find('.rate-one').css('width', poster_statistics.one_percent + '%')
    .html(poster_statistics.one_count)
    menu.find('.rate-rate').rating('update', poster_statistics.rate)
}

function ratingRate(rate){
    $.post(ratingURL, {"rate": rate}).done(function(object){
        poster_statistics = object.poster_statistics
        poster_statistics.rate = object.rate
        updateRateUI()
    }).fail(function(jqXHR){
        if(jqXHR.status == 401 || jqXHR.status == 403){
            window.location.href = loginURL
        }
    })
}

function shared(type){
    $.post(sharedURL, {type: type}).done(function(object){
    }).fail(function(jqXHR){
    })
}

function contacted(type){
    $.post(contactedURL, {type: type}).done(function(object){
    }).fail(function(jqXHR){
    })
}

function liked(){
    $.post(likedURL).done(function(object){
    }).fail(function(jqXHR){
        if(jqXHR.status == 401 || jqXHR.status == 403){
            window.location.href = loginURL
        }
    })
}

function favored(){
    $.post(favoredURL).done(function(object){
    }).fail(function(jqXHR){
    })
}

function fun(){
    $.post(funURL).done(function(object){
    }).fail(function(jqXHR){
    })
}
