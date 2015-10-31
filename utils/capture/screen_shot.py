__author__ = 'tianhuyang'
# sudo apt-get install python3-pyqt4 libqt4-webkit xvfb
# use webkit2png to capture web pages
# webkit2png for python2 must be installed globally to import PyQt4 library
import os
from django.conf import settings


class ScreenShot(object):

    @classmethod
    def capture(cls, url, width, height, path):
        parameters = dict(url=url, width=width, height=height, path=path)
        cmd = 'webkit2png {url} -x {width} {height} -g {width} {height} -o {path} -F javascript -F plugins -f jpeg'.format(**parameters)
        status = os.system(cmd)
        print(status)
        return status == 0

    @classmethod
    def test(cls, url, width=800, height=1000):
        path = os.path.dirname(__file__)
        path = os.path.join(settings.MEDIA_ROOT, 'website.jpeg')
        cls.capture(url, width, height, path)
        return path
