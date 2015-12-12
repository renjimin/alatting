/**
 * Created by ubuntu on 11/3/15.
 */
var PosterRender = {}

PosterRender.process = function(poster){
    this.init(poster)
    this.render(poster, poster.root)
}

PosterRender.init = function(object){
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
    //pages, regions, texts
    var pages = []
    var regions = []
    for(var index in object.poster_pages){
        var poster_page = object.poster_pages[index]
        poster_page.poster = object
        pages[poster_page.index] = poster_page
        var page_regions = []
        var template_regions = poster_page.template.template_regions
        for(var position in template_regions) {
            var template_region = template_regions[position]
            template_region.poster_page = poster_page
            page_regions.push(template_region)
            regions.push(template_region)
        }
        poster_page.regions = page_regions
        //text
        for(var position in poster_page.page_texts) {
            poster_page.page_texts[position] = poster_page
        }
        poster_page.texts = poster_page.page_texts
    }
    object.pages = pages
    object.regions = regions
    return object
}

PosterRender.render = function(poster, root){
    for(var i = 0; i < poster.pages.length && i < root.pages.length; ++i){
        var poster_page = poster.pages[i]
        var page = root.pages[i]
        for(var j = 0; j < poster_page.regions.length; ++j){
            var page_region = poster_page.regions[j]
            var region = page.regions[page_region.name]
            if(region){
                this.renderRegion(page_region, region)
            }
        }
        for(var j = 0; j < poster_page.texts.length; ++j){
            var page_text = poster_page.texts[j]
            var text = page.texts[page_text.name]
            if(text){
                this.renderTextWidget(page_text, text)
            }
        }
    }
}

PosterRender.renderRegion = function(page_region, region){
    page_region.class_name = 'p' + page_region.poster_page.poster.id + '-p' + page_region.poster_page.index + '-' +
        page_region.name
    page_region.element_id = page_region.class_name
    page_region.path_id = page_region.element_id + '-path'
    $.extend(page_region, region)
    var widget = region.widget
    if(widget) {
        this.renderWidget(page_region, widget)
    }
}

PosterRender.renderWidget = function(page_region, widget){
    widget['class_name'] = 'poster-widget-' + widget['name']
    widget['element_id'] = widget['class_name']
    var type = widget['type']
    var context = {'object': page_region.poster_page.poster}
    if(type == 'image')
        this.renderImage(widget, context)
    else if(type == 'slider')
        this.renderSlider(widget, context)
    else if(type == 'music')
        this.renderMusic(widget, context)
    else if(type == 'video')
        this.renderVideo(widget, context)
}

PosterRender.renderTextWidget = function(page_text, text) {
    text['class_name'] = 'poster-widget-' + text['name']
    text['element_id'] = text['class_name']
    var context = {}
    $.extend(page_text, text)
    this.renderText(page_text, context)
}

PosterRender.renderText = function(widget, context) {
}

PosterRender.renderImage = function(widget, context) {
    var images = context['object'].images
    var image_name = widget['image_name']
    if(image_name in images) {
        widget['image_url'] = images[image_name].file
    }
    widget.include = imageWidgetURL
}

PosterRender.renderSlider = function(widget, context) {
    var object_images = context['object'].images
    var element_images = widget['images']
    for(var i=0; i < element_images.length; ++i){
        var element_image = element_images[i]
        var image_name = element_image['image_name']
        if(image_name in object_images) {
            var image = object_images[image_name]
            element_image['image_url'] = image.file
            element_image['width'] = image.width
            element_image['height'] = image.height
        }
    }
    widget.include = sliderWidgetURL
    widget.init = function(){
        initFlexSlider('#' + widget.element_id)
    }
}

PosterRender.renderMusic = function(widget, context) {
    var music = context['object'].music
    if(music) {
        widget['music_url'] = music.file
    }
    widget.include = musicWidgetURL
}

PosterRender.renderVideo = function(widget, context) {
    var videos = context['object'].videos
    var video_name = widget['video_name']
    widget['video_element_id'] = 'video-' + video_name
    if(video_name in videos) {
        widget['video'] = videos[video_name]
        widget['video'].url = widget['video'].file
    }
    widget.include = videoWidgetURL
    widget.init = function(){
        videojs.initialize(widget.video_element_id)
    }
}
