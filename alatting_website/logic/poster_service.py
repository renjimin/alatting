__author__ = 'tianhuyang'
import json
from django.conf import settings
from .poster_render import PosterRender


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

        return root

    @classmethod
    def parse_meida_file(cls, path, poster):
        path = settings.MEDIA_ROOT + path
        with open(path) as f:
            root = json.load(f)
        cls.parse(root, poster)