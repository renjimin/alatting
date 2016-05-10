from django.conf import settings

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
    old_file = getattr(instance,
                       '_%s_' % field_name,
                       getattr(instance, field_name))
    ext = ''
    comps = filename.split('.')
    if len(comps) > 1:
        ext = comps[-1]
    if not old_file:
        name_label = '_name_'
        name = getattr(instance, name_label, None)
        if name is None:
            name = uuid.uuid4().hex
            setattr(instance, name_label, name)
        filename = "%s.%s" % (name, ext)
        path = time.strftime(path, time.gmtime())
        filename = os.path.join(path, filename)
    else:
        filename = old_file.name
        comps = filename.split('.')
        if len(comps) > 1:
            filename = "%s.%s" % (comps[0], ext)
    setattr(instance, 'format', ext)
    return filename


def get_avatar_path(instance, filename):
    path = 'avatars/%Y/%m/%d'
    field_name = 'avatar'
    field = instance._meta.get_field(field_name)
    old_field_name = '_%s_' % field_name
    old_file = getattr(instance, old_field_name)
    # avoid overwrite the default avatar
    if old_file and old_file.name == field.default:
        setattr(instance, old_field_name, None)
    return get_file_path(instance, field_name, path, filename)


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


def get_data_path(instance, filename):
    path = 'html5/%Y/%m/%d'
    field_name = 'data'
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


def get_file_ext_name(file_name):
    return file_name.split('.')[-1] if '.' in file_name else ''


def handle_uploaded_file(save_path, upfile):
    save_full_path = os.path.join(
        settings.MEDIA_ROOT, save_path
    )
    parent_path = os.path.dirname(save_full_path)
    if not os.path.exists(parent_path):
        os.makedirs(parent_path)

    with open(save_full_path, 'wb+') as destination:
        for chunk in upfile.chunks():
            destination.write(chunk)
    return save_full_path


def read_template_file_content(file_path):
    content = []
    if len(file_path) > 1:
        full_path = os.path.join(settings.BASE_DIR, file_path[1:])
        if os.path.exists(full_path) and os.path.isfile(full_path):
            file_ext = get_file_ext_name(os.path.basename(full_path))
            if file_ext.lower() in ['css', 'js', 'html', 'htm']:
                with open(full_path, 'r') as f:
                    content = f.readlines()
    return ''.join([line.strip().replace('\n', '') for line in content])


def save_file(file_pull_path, content):
    with open(file_pull_path, 'w+') as destination:
        # 按行写入前端上传的html\css\js文件
        for line in content.split('\n'):
            destination.write(line+'\n')