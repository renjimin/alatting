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


