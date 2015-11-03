__author__ = 'tianhuyang'
# sudo apt-get install python3-pyqt4 libqt4-webkit xvfb
# use webkit2png to capture web pages
# webkit2png for python2 must be installed globally via "setup.py install" to import PyQt4 library
import os


class ScreenShot(object):

    @classmethod
    def capture(cls, url, path, width, height, view_width=None, view_height=None):
        if view_width is None:
            view_width = width
        if view_height is None:
            view_height = height
        parameters = dict(url=url, width=width, height=height, path=path, view_width=view_width, view_height=view_height)
        cmd = 'webkit2png {url} -x {view_width} {view_height} -g {width} {height} -o {path} -F javascript -F plugins -w 1 -f jpeg'.format(**parameters)
        status = os.system(cmd)
        print(status)
        return status == 0
