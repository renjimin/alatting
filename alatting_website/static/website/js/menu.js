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

    var popover = $('[data-toggle="sub-menu"]').popover({animation: true});
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
    var $commentsBtn = $('.comments-btn');
    $commentsBtn.on('show.bs.popover', function(evt){
        $('#comments-submenu').fadeIn({duration: 300})
    });
    $commentsBtn.on('hide.bs.popover', function(evt){
        $('#comments-submenu').fadeOut({duration: 300})
    });

    var statsBtn = $(".stats-btn"),
        statsPosterAttrs = [
            "fun_score", "popular_score", "credit_score",
            "favorites_count", "views_count", "likes_count",
            "shares_count", "fun_count", "ratings_average",
            "overall_score", "medal_next_score"
        ],
        statsHistoryAttrs = [
            "favortes_count_change", "views_count_change",
            "likes_count_change", "shares_count_change",
            "fun_count_change", "ratings_average_change",
            "score_total_change"
        ],
        statsPercentAttrs = [
            "fun_change_percent", "popular_change_percent",
            "credit_change_percent", "score_change_percent"
        ];
    statsBtn.on('show.bs.popover', function(event){
        $.get(posterStatsDataURL).done(function(resp){
            $.each(statsPosterAttrs, function(i, x){
                $("#" + x).text(resp["poster_statistics"][x]);
            });
            $.each(statsHistoryAttrs, function(i, y){
                $("#" + y).text(resp["history_statistics"][y]);
            });
        });
    });
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

var poster_statistics = null;

var updatePosterStatsPercent = function(menu, arrPercents){
    $.each(arrPercents, function(i, per){
        menu.find('.rate-' + per).css(
            'width', poster_statistics[per + "_percent"] + '%'
        ).html(poster_statistics[per + "_count"]);
    });
};

function updateRateUI(){
    if(!poster_statistics) return;
    var menu = $('.rate-submenu');
    if(!menu.length) return;
    menu.find('.rate-rating').html(poster_statistics.ratings_average);
    menu.find('.rating-count').html(poster_statistics.ratings_count);
    menu.find('.rating-average').rating('update', poster_statistics.ratings_average);
    updatePosterStatsPercent(menu, ['five', 'four', 'three', 'two', 'one']);
    menu.find('.rate-rate').rating('update', poster_statistics.rate);
}

function ratingRate(rate){
    $.post(ratingURL, {"rate": rate}).done(function(object){
        poster_statistics = object.poster_statistics;
        poster_statistics.rate = object.rate;
        updateRateUI();
    }).fail(function(jqXHR){
        if(jqXHR.status == 401 || jqXHR.status == 403){
            window.location.href = loginURL;
        }
    });
}

var YUNYE_COMPANY_NAME = "武汉云页移动科技有限公司";
var socialShareUrls = {
    "qq": "http://connect.qq.com/widget/shareqq/index.html?",
    "qzone": "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?",
    "weibo": "http://v.t.sina.com.cn/share/share.php?&content=utf8&"
};

var sharedCallback = function(type, title, desc){
    var url = window.location.href;
    var params = $.param({
        "title": encodeURIComponent(title),
        "site": encodeURIComponent(YUNYE_COMPANY_NAME),
        "url": url
    });
    // 不能将desc放到params里，否则共享到QQ和QQ空间时，内容会被编码
    params += "&desc=" + encodeURIComponent(desc);
    if (type == "wechat") {
        alert('开发中...!');
    } else {
        window.location.href = socialShareUrls[type] + params;
    }
};


function shared(type, title, desc){
    $.post(sharedURL, {type: type}).done(function(object){
        sharedCallback(type, title, desc);
    }).fail(function(jqXHR){
    });
}

function contacted(type){
    $.post(contactedURL, {type: type}).done(function(object){
    }).fail(function(jqXHR){
    })
}


function favored(){
    $.post(favoredURL).done(function(object){
    }).fail(function(jqXHR){
    })
}

function createScreenShot(){
    alert( "click OK to start transforming" );
    $.get(createScreenShotURL).done(function(object){
        alert("Transform completed");
        var full_url_header = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        var screenshot_url = full_url_header + object.image_url;
        window.open(
            screenshot_url,
            '_blank'
        );
    }).fail(function(jqXHR){
        
    })
}

function createScreenShotPDF(){
    alert( "click OK to start transforming" );
    $.get(createScreenShotURL).done(function(object){
        alert("Transform completed");
        var full_url_header = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        var screenshotPDF_url = full_url_header + object.pdf_url;
        window.open(
            screenshotPDF_url,
            '_blank'
        );
    }).fail(function(jqXHR){
    
    })
}
function printScreenShot(){
    alert( "click OK to start transforming" );
    $.get(createScreenShotURL).done(function(object){
        alert("Transform completed");
        var full_url_header = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        var screenshotPDF_url = full_url_header + object.pdf_url;
        printPDF(screenshotPDF_url);
    }).fail(function(jqXHR){
    
    })
}
function printPDF(url){
    var popup = window.open(url)
    popup.onload = function(evt){
        this.print()
    }
}
