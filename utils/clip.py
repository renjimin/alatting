__author__ = 'tianhuyang'
from django.template.loader import render_to_string


class SvgClip:
    template_name = 'website/svg_clip.xml'

    @classmethod
    def create_svg_clip_xml(cls, data):
        context = dict()
        return render_to_string(cls.template_name, context)
