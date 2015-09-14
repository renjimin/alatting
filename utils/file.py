__author__ = 'tiger'
import uuid
import os
import time
from django.core.files.storage import FileSystemStorage


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        if name:
            self.delete(name)
        return super(OverwriteStorage, self).get_available_name(name, max_length)


def get_file_path(old_filename, path, filename):
    if not old_filename:
        ext = ''
        comps = filename.split('.')
        if len(comps) > 1:
            ext = comps[-1]
        filename = "%s.%s" % (uuid.uuid4(), ext)
        path = time.strftime(path, time.gmtime())
        filename = os.path.join(path, filename)
    else:
        filename = old_filename.name
    # sprint('filename: ' + filename)
    return filename


def get_image_path(instance, filename):
    path = 'images/%Y/%m/%d'
    old_filename = getattr(instance, '_file_')
    return get_file_path(old_filename, path, filename)


def get_video_path(instance, filename):
    path = 'videos/%Y/%m/%d'
    old_filename = getattr(instance, '_file_')
    return get_file_path(old_filename, path, filename)


def get_music_path(instance, filename):
    path = 'music/%Y/%m/%d'
    old_filename = getattr(instance, '_file_')
    return get_file_path(old_filename, path, filename)


def get_html_path(instance, filename):
    path = 'html5/%Y/%m/%d'
    old_filename = getattr(instance, '_html_')
    return get_file_path(old_filename, path, filename)


def get_css_path(instance, filename):
    path = 'html5/%Y/%m/%d'
    old_filename = getattr(instance, '_css_')
    return get_file_path(old_filename, path, filename)


def get_script_path(instance, filename):
    path = 'html5/%Y/%m/%d'
    old_filename = getattr(instance, '_script_')
    return get_file_path(old_filename, path, filename)