/**
 * Created by ubuntu on 11/3/15.
 */

function initPoster(object){
    //images
    var images = {}
    for(var index in object.poster_images){
        var poster_image = object.poster_images[index]
        images[poster_image.name] = poster_image.image
    }
    object.images = images
    //videos
    var videos = {}
    for(var index in object.poster_videos){
        var poster_video = object.poster_videos[index]
        videos[poster_video.name] = poster_video.video
    }
    object.videos = videos
    //pages & regions
    var pages = []
    var regions = []
    for(var index in object.poster_pages){
        var poster_page = object.poster_pages[index]
        pages[poster_page.index] = poster_page
        var page_regions = []
        var template_regions = poster_page.template.template_regions
        for(var position in template_regions) {
            var template_region = template_regions[position]
            page_regions.push(template_region)
            regions.push(template_region)
        }
        poster_page.regions = page_regions
    }
    object.pages = pages
    object.regions = regions
    return object
}

app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
    $scope.object = null
    $scope.retrievePoster = function () {
        $http.get(posterURL).then(function (response) {
            $scope.object = response.data
            //$scope.$apply()
        }, function (response) {
        });
    }
    $scope.retrievePoster()
}]);
