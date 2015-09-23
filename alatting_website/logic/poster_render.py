__author__ = 'tianhuyang'
from django.template.loader import render_to_string


class PosterRender:
    @classmethod
    def json_to_html(cls, root, context):
        pages = root['pages']
        page = pages[0]
        html = ''
        for element in page:
            typ = element['type']
            if typ == 'background':
                html += cls.render_background(element, context) + '\n'
            elif typ == 'text':
                html += cls.render_text(element, context) + '\n'
            elif typ == 'button':
                html += cls.render_button(element, context) + '\n'
            elif typ == 'image':
                html += cls.render_image(element, context) + '\n'
            elif typ == 'slider':
                html += cls.render_slider(element, context) + '\n'
            elif typ == 'music':
                html += cls.render_music(element, context) + '\n'
            elif typ == 'video':
                html += cls.render_video(element, context) + '\n'
            elif typ == 'map':
                html += cls.render_map(element, context) + '\n'
        return html

    @classmethod
    def render_background(cls, element, context_instance):
        template_name = 'libs/components/background.html'
        images = context_instance['object'].images
        image_name = element['image_name']
        if image_name in images:
            element['image_url'] = images[image_name].file.url
        context = dict(element=element)
        return render_to_string(template_name, context, context_instance)

    @classmethod
    def render_text(cls, element, context_instance):
        template_name = 'libs/components/text.html'
        context = dict(element=element)
        return render_to_string(template_name, context, context_instance)

    @classmethod
    def render_button(cls, element, context_instance):
        template_name = 'libs/components/button.html'
        context = dict(element=element)
        return render_to_string(template_name, context, context_instance)

    @classmethod
    def render_image(cls, element, context_instance):
        template_name = 'libs/components/image.html'
        images = context_instance['object'].images
        image_name = element['image_name']
        if image_name in images:
            element['image_url'] = images[image_name].file.url
        context = dict(element=element)
        return render_to_string(template_name, context, context_instance)

    @classmethod
    def render_slider(cls, element, context_instance):
        template_name = 'libs/components/slider.html'
        object_images = context_instance['object'].images
        element_images = element['images']
        for element_image in element_images:
            image_name = element_image['image_name']
            if image_name in object_images:
                image = object_images[image_name]
                element_image['image_url'] = image.file.url
                element_image['width'] = image.width
                element_image['height'] = image.height
        context = dict(element=element)
        return render_to_string(template_name, context, context_instance)

    @classmethod
    def render_music(cls, element, context_instance):
        template_name = 'libs/components/music.html'
        music = context_instance['object'].music
        if music is not None:
            element['music_url'] = music.file.url
        context = dict(element=element)
        return render_to_string(template_name, context, context_instance)

    @classmethod
    def render_video(cls, element, context_instance):
        template_name = 'libs/components/video.html'
        videos = context_instance['object'].videos
        video_name = element['video_name']
        if video_name in videos:
            element['video_url'] = videos[video_name].file.url
        context = dict(element=element)
        return render_to_string(template_name, context, context_instance)

    @classmethod
    def render_map(cls, element, context_instance):
        template_name = 'libs/components/map.html'
        context = dict(element=element)
        return render_to_string(template_name, context, context_instance)

