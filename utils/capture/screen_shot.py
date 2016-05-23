__author__ = 'tianhuyang'
# sudo apt-get install python3-pyqt4 libqt4-webkit xvfb
# use webkit2png to capture web pages
# webkit2png for python2 must be installed globally via "setup.py install" to import PyQt4 library
########################################################################################################################
################################################### updated 04-22-2016 #################################################
######################################################## Github ########################################################
#https://github.com/adamn/python-webkit2png
################################################### Manual installation ################################################
# Notes: system wide install, not in virtual environment
# apt-get install python-qt4 libqt4-webkit xvfb python-setuptools python3-pyqt4 pyqt4-dev-tools
# cd ~/
# git clone https://github.com/adamn/python-webkit2png.git python-webkit2png
# cd python-webkit2png
# python setup.py install
# sudo chmod -R 777 /var/www
#################################################### Installation Check ################################################
# type command "webkit2png -h"  to check if it is installed

import os
from PIL import Image


class ScreenShot(object):

    @classmethod
    def capture(cls, url, path, width, height, view_width=None, view_height=None):
        if view_width is None:
            view_width = width
        if view_height is None:
            view_height = height
        parameters = dict(url=url, width=width, height=height, path=path, view_width=view_width, view_height=view_height)
        cmd = 'webkit2png {url} -x {view_width} {view_height} -g {view_width} {view_height} --scale {width} {height} ' \
              '--aspect-ratio crop -o {path} -F javascript -F plugins -w 1 -f jpeg'.format(**parameters)
        print(cmd)
        status = os.system(cmd)
        print(status)
        return status == 0

    @classmethod
    def image_to_pdf(cls, image_path, pdf_path):
        try:
            Image.open(image_path).save(pdf_path, 'PDF')
            success = True
        except IOError as ioe:
            success = False
            print(ioe)
        return success

    @classmethod
    def test(cls, url):
        path = os.path.dirname(__file__)
        path = os.path.join(path, 'test.jpg')
        cls.capture(url + '?capture=true', path, 1000, 1280, view_height=2048)
        return path

# ScreenShot.test()