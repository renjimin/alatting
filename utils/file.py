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


def get_file_path(instance, field_name, path, filename):
    old_filename = getattr(instance, '_%s_' % field_name)
    ext = ''
    comps = filename.split('.')
    if len(comps) > 1:
        ext = comps[-1]
    if not old_filename:
        name_label = '_name_'
        name = getattr(instance, name_label, None)
        if name is None:
            name = uuid.uuid4().hex
            setattr(instance, name_label, name)
        filename = "%s.%s" % (name, ext)
        path = time.strftime(path, time.gmtime())
        filename = os.path.join(path, filename)
    else:
        filename = old_filename.name
        comps = filename.split('.')
        if len(comps) > 1:
            filename = "%s.%s" % (comps[0], ext)
    setattr(instance, 'format', ext)
    return filename


def get_image_path(instance, filename):
    path = 'images/%Y/%m/%d'
    field_name = 'file'
    return get_file_path(instance, field_name, path, filename)


def get_video_path(instance, filename):
    path = 'videos/%Y/%m/%d'
    field_name = 'file'
    return get_file_path(instance, field_name, path, filename)


def get_music_path(instance, filename):
    path = 'music/%Y/%m/%d'
    field_name = 'file'
    return get_file_path(instance, field_name, path, filename)


def get_html_path(instance, filename):
    path = 'html5/%Y/%m/%d'
    field_name = 'html'
    return get_file_path(instance, field_name, path, filename)


def get_css_path(instance, filename):
    path = 'html5/%Y/%m/%d'
    field_name = 'css'
    return get_file_path(instance, field_name, path, filename)


def get_script_path(instance, filename):
    path = 'html5/%Y/%m/%d'
    field_name = 'script'
    return get_file_path(instance, field_name, path, filename)