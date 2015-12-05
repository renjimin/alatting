/**
 * Created by tianhuyang on 9/29/15.
 */

Array.prototype.remove = function(x) {
    for(var i in this){
        if(this[i] === x){
            this.splice(i, 1)
            break
        }
    }
}

var fillCenter = function ($slider) {
    var $images = $slider.find('img').addBack($slider)
    $images.each(function (index) {
        var $this = $(this);
        if($this.is('img')) {
            var width = $this.parent().width();
            var height = $this.parent().height();
            var w = this.naturalWidth, h = this.naturalHeight;
            if (w / h > width / height) {
                w = w / h * height;
                h = height;
                var left = (width - w) / 2.0 * 100 / width;
                $this.css('margin-left', left + '%');
            }
            else {
                h = h / w * width;
                w = width;
                var top = (height - h) / 2.0 * 100 / height;
                $this.css('margin-top', top + '%');
            }
            w = w / width * 100;
            h = h / height * 100;
            $this.css('width', w + '%');
            $this.css('height', h + '%');
        }
    });

};

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            var csrftoken = Cookies.get('csrftoken')
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function needLogin(response){
    if (response.status === 401 || response.status === 403) {
        window.location.href = loginURL
    }
}

//app
var app = angular.module('PosterApp', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui"
]);

//csrf for angular
app.config(function ($httpProvider) {
    $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
    $httpProvider.defaults.xsrfCookieName = "csrftoken";
});

/*app.config(function($routeProvider, $locationProvider) {
 $routeProvider.when('/', {
 templateUrl: "signIn.html"
 });
 });*/
