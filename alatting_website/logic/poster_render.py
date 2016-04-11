# coding=utf-8

import re
from decimal import Decimal
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
    def _polygon_to_points(cls, polygon):
        polygon = polygon.replace('%', '')
        pairs = polygon.split(',')
        for index in range(len(pairs)):
            pair = pairs[index].strip()
            items = re.split('\s+', pair)
            for pos in range(len(items)):
                items[pos] = Decimal(items[pos]) / 100
                items[pos] = str(items[pos])
            pairs[index] = ' '.join(items)
        points = ', '.join(pairs)
        return points

    @classmethod
    def render_region(cls, poster_region, region):
        poster_region.class_name = 'p%s-p%s-%s' % (
            poster_region.poster_page.poster.id,
            poster_region.poster_page.index,
            poster_region.name
        )
        poster_region.element_id = poster_region.class_name
        poster_region.path_id = poster_region.element_id + '-path'
        poster_region.points = cls._polygon_to_points(poster_region.polygon)
        widget = region.get('widget')
        if widget:
            cls.render_widget(poster_region, widget)

    @classmethod
    def render_widget(cls, poster_region, widget):
        widget['class_name'] = '%s-%s' % ('poster-widget', widget['name'])
        widget['element_id'] = widget['class_name']
        typ = widget['type']
        context = dict(object=poster_region.poster_page.poster)
        if typ == 'background':
            html = cls.render_background(widget, context)
        # elif typ == 'text':
        #    html = cls.render_text(widget, context)
        elif typ == 'button':
            html = cls.render_button(widget, context)
        elif typ == 'image':
            html = cls.render_image(widget, context)
        elif typ == 'slider':
            html = cls.render_slider(widget, context)
        elif typ == 'music':
            html = cls.render_music(widget, context)
        elif typ == 'video':
            html = cls.render_video(widget, context)
        elif typ == 'map':
            html = cls.render_map(widget, context)
        else:
            html = ''
        widget['content'] = html
        poster_region.widget = widget

    @classmethod
    def render_text_widget(cls, poster, widget):
        widget['class_name'] = '%s-%s' % ('poster-widget', widget['name'])
        widget['element_id'] = widget['class_name']
        context = dict(object=poster)
        widget['content'] = cls.render_text(widget, context)

    @classmethod
    def render_background(cls, widget, context):
        template_name = 'libs/widgets/default.html'
        images = context['object'].images
        image_name = widget['image_name']
        if image_name in images:
            widget['image_url'] = images[image_name].file.url
        context['widget'] = widget
        return render_to_string(template_name, context)

    @classmethod
    def render_text(cls, widget, context):
        template_name = 'libs/widgets/text.html'
        context['widget'] = widget
        return render_to_string(template_name, context)

    @classmethod
    def render_button(cls, widget, context):
        template_name = 'libs/widgets/button.html'
        context['widget'] = widget
        return render_to_string(template_name, context)

    @classmethod
    def render_image(cls, widget, context):
        template_name = 'libs/widgets/image.html'
        images = context['object'].images
        image_name = widget['image_name']
        if image_name in images:
            widget['image_url'] = images[image_name].file.url
        context['widget'] = widget
        return render_to_string(template_name, context)

    @classmethod
    def render_slider(cls, widget, context):
        template_name = 'libs/widgets/slider.html'
        object_images = context['object'].images
        element_images = widget['images']
        for element_image in element_images:
            image_name = element_image['image_name']
            if image_name in object_images:
                image = object_images[image_name]
                element_image['image_url'] = image.file.url
                element_image['width'] = image.width
                element_image['height'] = image.height
        context['widget'] = widget
        return render_to_string(template_name, context)

    @classmethod
    def render_music(cls, widget, context):
        template_name = 'libs/widgets/music.html'
        music = context['object'].music
        if music is not None:
            widget['music_url'] = music.file.url
        context['widget'] = widget
        return render_to_string(template_name, context)

    @classmethod
    def render_video(cls, widget, context):
        template_name = 'libs/widgets/video.html'
        videos = context['object'].videos
        video_name = widget['video_name']
        widget['video_element_id'] = 'video-%s' % video_name
        if video_name in videos:
            widget['video'] = video = videos[video_name]
            video.url = video.file.url
        context['widget'] = widget
        return render_to_string(template_name, context)

    @classmethod
    def render_map(cls, widget, context):
        template_name = 'libs/widgets/map.html'
        context['widget'] = widget
        return render_to_string(template_name, context)

