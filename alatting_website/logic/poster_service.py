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
    def poster_paths(cls, poster, ext):
        file = os.path.splitext(poster.html.name)[0] + ext
        url_path = settings.MEDIA_URL + file
        path = os.path.join(settings.MEDIA_ROOT, file)
        return path, url_path

    @classmethod
    def poster_image_url(cls, poster):
        image_path, image_url = cls.poster_paths(poster, '.jpg')
        return image_url

    @classmethod
    def capture(cls, request, poster, width=800, height=1280, view_height=2048, force=False):
        image_path, image_url = cls.poster_paths(poster, '.jpg')
        pdf_path, pdf_url = cls.poster_paths(poster, '.pdf')
        # make sure it exist
        if not os.path.exists(image_path):
            open(image_path, 'wb').close()
            force = True
        if force:
            url = request.scheme + '://' + request.get_host()
            url = url + reverse('website:poster', kwargs={'pk': poster.id})
            if ScreenShot.capture(url, image_path, width, height, view_height=view_height):
                ScreenShot.image_to_pdf(image_path, pdf_path)
            else:
                pdf_url = image_url = None
        return image_url, pdf_url