__author__ = 'tianhuyang'
import os
import json
from django.conf import settings
from django.core.urlresolvers import reverse
from .poster_render import PosterRender
from utils.capture.screen_shot import ScreenShot


class PosterService:
    @classmethod
    def parse(cls, root, poster):
        """
        parse the poster contents into html context
        """
        for poster_page, page in zip(poster.pages, root['pages']):
            for poster_region in poster_page.regions:
                poster_region.poster_page = poster_page
                region = page['regions'][poster_region.name]
                PosterRender.render_region(poster_region, region)

            for text_widget in page['texts']:
                PosterRender.render_text_widget(poster, text_widget)
            poster_page.texts = page['texts']

        return root

    @classmethod
    def parse_media_file(cls, path, poster):
        path = settings.MEDIA_ROOT + path
        with open(path) as f:
            root = json.load(f)
        cls.parse(root, poster)

    @classmethod
    def image_paths(cls, poster):
        file = os.path.splitext(poster.html.name)[0] + '.jpg'
        url_path = settings.MEDIA_URL + file
        path = os.path.join(settings.MEDIA_ROOT, file)
        return path, url_path

    @classmethod
    def capture(cls, poster, width=800, height=1280, view_height=2048, force=False):
        path, url_path = cls.image_paths(poster)
        if not os.path.exists(path) or force:
            host = "http://127.0.0.1:8000"
            url = host + reverse('website:poster', kwargs={'pk': poster.id})
            if not ScreenShot.capture(url, path, width, height, view_height=view_height):
                url_path = None
        return url_path