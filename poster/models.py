import os

from django.db import models
from alatting import settings
from utils.db.fields import BigAutoField
from alatting_website.model.resource import Image
from PIL import Image as pilimage


class SystemImage(models.Model):
    id = BigAutoField(primary_key=True)
    image = models.ForeignKey(Image, related_name='system_images')
    thumbnail_img = models.ForeignKey(Image, null=True, default=None, blank=True)

    def __str__(self):
        return "{:d}".format(self.pk)

    def _get_thumbnail_name(self, full_image_name):
        dir_l = full_image_name.split('.')
        dir_l[-2] = '{}_thumbnail'.format(dir_l[-2])
        return '.'.join(dir_l)

    def _thumbnail_save(self, full_path):
        img = pilimage.open(full_path)
        # width = int(img.width/10)
        # height = int(img.height/10)
        # img = img.resize((width, height), pilimage.ANTIALIAS)
        img = img.resize((250, 160), pilimage.ANTIALIAS)
        thumbnail_file = self._get_thumbnail_name(full_path)
        img.save(thumbnail_file)
        img_obj = Image(file=thumbnail_file)
        img_obj.save()
        return img_obj

    def save(self, *args, **kwargs):
        full_path = '{}{}'.format(settings.BASE_DIR, self.image.file.url)
        self.thumbnail_img = self._thumbnail_save(full_path)
        super(SystemImage, self).save(*args, **kwargs)
