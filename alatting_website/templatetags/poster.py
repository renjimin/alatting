# coding=utf-8

import json
from django import template
from django.conf import settings
from alatting_website.logic.poster_render import PosterRender

__author__ = 'tianbuyang'


register = template.Library()


@register.simple_tag(takes_context=True)
def embed(context, path, *args, **kwargs):
    path = settings.MEDIA_ROOT + path
    with open(path) as f:
        root = json.load(f)
    return PosterRender.json_to_html(root, context)
