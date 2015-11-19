__author__ = 'tianhuyang'
import os


class Video(object):

    @classmethod
    def extract_frame(cls, src, dst, max_width=800, max_height=None):
        if max_height is None:
            max_height = max_width
        ratio = max_width / max_height
        cmd = 'ffmpeg -i {src} -y -vf "scale=\'if(gt(a,{max_width}/{max_height}),min({max_width},iw),-1)\':' \
              '\'if(gt(a,{max_width}/{max_height}),-1,min({max_height}, ih))\'" -vframes 1 -ss 00:00:01 {dst}'
        args = dict(src=src, dst=dst, max_width=max_width, max_height=max_height, ratio=ratio)
        cmd = cmd.format(**args)
        status = os.system(cmd)
        print(status)
        return status == 0

    @classmethod
    def extract_preview(cls, src, max_width=800, max_height=None):
        ext = '.jpg'
        dst = os.path.splitext(src)
        dst = dst[0] + ext
        success = cls.extract_frame(src, dst, max_width, max_height)
        if not success:
            dst = None
        return dst

    @classmethod
    def test(cls):
        from django.conf import settings
        src = os.path.join(settings.MEDIA_ROOT, 'videos/2015/09/23/0fe873324f3745c7b2c30f1d7ad58290.MP4')
        dst = os.path.join(os.path.dirname(__file__), 'test.jpg')
        cls.extract_preview(src, dst)

# Video.test()