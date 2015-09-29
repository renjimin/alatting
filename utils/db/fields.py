__author__ = 'tianhuyang'
from django.db import models
from utils.file import OverwriteStorage


class OverWriteFileField(models.FileField):

    def __init__(self, verbose_name=None, name=None, upload_to='', storage=None, **kwargs):
        storage = storage or OverwriteStorage()
        super(OverWriteFileField, self).__init__(verbose_name, name, upload_to, storage, **kwargs)

    def save_form_data(self, instance, data):
        value = getattr(instance, self.name)
        setattr(instance, '_' + self.name + '_', value)
        super(OverWriteFileField, self).save_form_data(instance, data)


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
