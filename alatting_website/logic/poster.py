__author__ = 'tianhuyang'
import json
from django.conf import settings
from .poster_render import PosterRender


class Poster:
    @classmethod
    def parse(cls, root, context):
        """
        parse the poster contents into html context
        """
        pages = root['pages']
        for page in pages:
            for name, region in page.items():
                PosterRender.render(region, context)

    @classmethod
    def parse_file(cls, path):
        path = settings.MEDIA_ROOT + path
        with open(path) as f:
            root = json.load(f)
        return cls.parse(root)