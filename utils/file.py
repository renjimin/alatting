import codecs
from PIL import Image
from django.conf import settings

__author__ = 'tiger'
import uuid
import os
import time
from django.core.files.storage import FileSystemStorage
MAX_BUFF_SIZE = 65535

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
                f = codecs.open(full_path, 'r', 'utf-8')
                content = f.readlines()
                f.close()
    return ''.join(content)


def spilt_string(string, width):
    """按照固定长度来拆分一个字符串"""
    return [string[x:x+width] for x in range(0, len(string), width)]


def save_file(file_full_path, content):
    with codecs.open(file_full_path, 'w', 'utf-8') as destination:
        if len(content) < MAX_BUFF_SIZE:
            destination.write(content)
        else:
            for chunk in spilt_string(content, MAX_BUFF_SIZE):
                destination.write(chunk)
    return file_full_path.replace(settings.MEDIA_ROOT, '')


IMAGE_ROTATES = {
    1: 0,
    6: -90,
    8: -270,
    3: -180
}


def rotate_image(image_path):
    """
    :param image_path 图片文件全路径
    274 代表 PIL.ExifTagsTAGS 中的 Orientation(旋转角度)
    旋转角度    参数(Orientation)
    0°	        1
    顺时针90°	6
    逆时针90°	8
    180°	    3
    """
    if os.path.exists(image_path):
        key_code = 274
        try:
            img = Image.open(image_path)
            exif = img._getexif()
            if exif:
                key = exif.get(key_code, None)
                if key and key != 1 and key in IMAGE_ROTATES.keys():
                    new_img = img.rotate(IMAGE_ROTATES.get(key))
                    new_img.save(image_path)
        except:
            # todo:lyh:写入错误日志
            pass
