__author__ = 'tiger'
import uuid
import os
import time


def get_file_path(path, filename):
    ext = ''
    comps = filename.split('.')
    if len(comps) > 1:
        ext = comps[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    path = time.strftime(path, time.gmtime())
    return os.path.join(path, filename)


def get_image_path(instance, filename):
    path = 'images/%Y/%m/%d'
    return get_file_path(path, filename)


def get_video_path(instance, filename):
    path = 'videos/%Y/%m/%d'
    return get_file_path(path, filename)


def get_music_path(instance, filename):
    path = 'music/%Y/%m/%d'
    return get_file_path(path, filename)

def get_html_path(instance, filename):
    path = 'htmls/%Y/%m/%d'
    return get_file_path(path, filename)

def get_css_path(instance, filename):
    path = 'csses/%Y/%m/%d'
    return get_file_path(path, filename)

def get_script_path(instance, filename):
    path = 'scripts/%Y/%m/%d'
    return get_file_path(path, filename)