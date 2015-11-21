__author__ = 'tianhuyang'
import os

"""
sudo add-apt-repository ppa:mc3man/trusty-media
sudo apt-get update
sudo apt-get install ffmpeg
sudo add-apt-repository --remove ppa:mc3man/trusty-media
sudo apt-get update
"""


class Video(object):

    @classmethod
    def extract_frame(cls, src, dst, max_width=None, max_height=None):
        ss = '00:00:01'
        if max_width is None and max_height is None:
            cmd = 'ffmpeg -i {src} -y -vframes 1 -ss {ss} {dst}'
        elif max_width is not None and max_height is not None:
            cmd = 'ffmpeg -i {src} -y -vf "scale=\'if(gt(a,{max_width}/{max_height}),min({max_width},iw),-1)\':' \
                  '\'if(gt(a,{max_width}/{max_height}),-1,min({max_height}, ih))\'" -vframes 1 -ss {ss} {dst}'
        elif max_width is not None:
            cmd = 'ffmpeg -i {src} -y -vf "scale=\'min({max_width},iw)\':-1" -vframes 1 -ss {ss} {dst}'
        else:
            cmd = 'ffmpeg -i {src} -y -vf "scale=-1:\'min({max_height},ih)\'" -vframes 1 -ss {ss} {dst}'
        args = dict(src=src, dst=dst, max_width=max_width, max_height=max_height, ss=ss)
        cmd = cmd.format(**args)
        status = os.system(cmd)
        # print(status)
        return status == 0

    @classmethod
    def extract_preview(cls, src, dst, max_width=800, max_height=None):
        if max_height is None:
            max_height = max_width
        success = cls.extract_frame(src, dst, max_width, max_height)
        return success

    @classmethod
    def test(cls):
        from django.conf import settings
        src = os.path.join(settings.MEDIA_ROOT, 'videos/2015/09/23/0fe873324f3745c7b2c30f1d7ad58290.MP4')
        dst = os.path.join(os.path.dirname(__file__), 'test.jpg')
        cls.extract_preview(src, dst)

# Video.test()