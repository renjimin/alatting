__author__ = 'tianhuyang'
import os
from django.db import models
from django.db.models.fields.files import FieldFile
from utils.file import OverwriteStorage
from utils.capture.video import Video


class OverWriteFileField(models.FileField):

    def __init__(self, verbose_name=None, name=None, upload_to='', storage=None, **kwargs):
        storage = storage or OverwriteStorage()
        super(OverWriteFileField, self).__init__(verbose_name, name, upload_to, storage, **kwargs)

    def save_form_data(self, instance, data):
        value = getattr(instance, self.name)
        setattr(instance, '_' + self.name + '_', value)
        super(OverWriteFileField, self).save_form_data(instance, data)


class VideoFieldFile(FieldFile):

    @property
    def preview_url(self):
        dst = os.path.splitext(self.url)
        dst = dst[0] + self.field.preview_format
        return dst

    @property
    def preview_path(self):
        dst = os.path.splitext(self.path)
        dst = dst[0] + self.field.preview_format
        return dst

    def save(self, *args, **kwargs):
        super(VideoFieldFile, self).save(*args, **kwargs)
        Video.extract_frame(self.path, self.preview_path)


class OverWriteVideoField(OverWriteFileField):
    attr_class = VideoFieldFile
    PREVIEW_FORMAT = '.jpg'

    def __init__(self, *args, preview_field=None, preview_format=PREVIEW_FORMAT, **kwargs):
        self.preview_field = preview_field
        self.preview_format = preview_format
        super(OverWriteVideoField, self).__init__(*args, **kwargs)

    def pre_save1(self, model_instance, add):
        file = super(OverWriteVideoField, self).pre_save(model_instance, add)
        if getattr(file, '_saved', False) and self.preview_field:
            src = file.path
            dst = os.path.splitext(src)
            dst = dst[0] + self.preview_format
            if Video.extract_frame(src, dst):
                dst = os.path.splitext(file.url)
                dst = dst[0] + self.preview_format
            else:
                dst = None
            setattr(model_instance, self.preview_field, dst); print(dst)
        return file

    def deconstruct(self):
        name, path, args, kwargs = super(OverWriteVideoField, self).deconstruct()
        if self.preview_field:
            kwargs['preview_field'] = self.preview_field
        kwargs['preview_format'] = self.preview_format
        return name, path, args, kwargs

    def contribute_to_class(self, cls, name, **kwargs):
        super(OverWriteVideoField, self).contribute_to_class(cls, name, **kwargs)
        if not cls._meta.abstract:
            models.signals.post_init.connect(self.update_preview_field, sender=cls)

    def update_preview_field(self, instance, *args, **kwargs):
        if not self.preview_field:
            return
        file = getattr(instance, self.attname)
        if file:
            preview = file.preview_url
        else:
            preview = ''
        setattr(instance, 'preview', preview)


class OverWriteImageField(models.ImageField):
    def __init__(self, storage=None, **kwargs):
        storage = storage or OverwriteStorage()
        super(OverWriteImageField, self).__init__(storage=storage, **kwargs)

    def save_form_data(self, instance, data):
        value = getattr(instance, self.name)
        setattr(instance, '_' + self.name + '_', value)
        super(OverWriteImageField, self).save_form_data(instance, data)

from django.db import models
from django.db.models import fields
from django.utils.translation import ugettext_lazy as _


class BigAutoField(fields.AutoField):
    description = _("BigInteger")
    default_error_messages = {
        'invalid': _("'%(value)s' value must be a big integer."),
    }

    def get_internal_type(self):
        return 'AutoField'
        #return "BigIntegerField"

    def db_type(self, connection):
        engine = connection.settings_dict['ENGINE']
        if engine.endswith('mysql'):
            return "bigint AUTO_INCREMENT"
        elif engine.endswith('oracle'):
            return "NUMBER(19)"
        elif 'postgres' in engine or 'postgis' in engine:
            return "bigserial"
        elif engine.endswith('sqlite3') or engine.endswith('spatialite'):
            return super(BigAutoField, self).db_type(connection)
        else:
            raise NotImplemented


class BigForeignKey(models.ForeignKey):

    def db_type(self, connection):
        rel_field = self.rel.get_related_field()
        if (isinstance(rel_field, BigAutoField) or
                (not connection.features.related_fields_match_type and
                 isinstance(rel_field, fields.BigIntegerField))):
            return fields.BigIntegerField().db_type(connection)
        return rel_field.db_type(connection)


class BigOneToOneField(models.OneToOneField):
    def db_type(self, connection):
        rel_field = self.rel.get_related_field()
        if (isinstance(rel_field, BigAutoField) or
                (not connection.features.related_fields_match_type and
                 isinstance(rel_field, fields.BigIntegerField))):
            return fields.BigIntegerField().db_type(connection)
        return rel_field.db_type(connection)
