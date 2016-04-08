__author__ = 'tianhuyang'
from django.template.loader import render_to_string

layouts = {
    1: {
        'name': 'first',
        'shapes': [
            {
                'd': 'M 0 .5  L .5 0 L 1 .5 L .5 1 z'
            }
        ]
    }
}


class SvgClip:
    template_name = 'website/svg_clip.xml'

    @classmethod
    def create_svg_clip_xml(cls, layout_id, shape_index):
        ret = None
        layout = layouts.get(layout_id)
        if layout is not None:
            shapes = layout['shapes']
            if shape_index < len(shapes):
                shape = shapes[shape_index]
                ret = render_to_string(cls.template_name, shape)
        return ret
