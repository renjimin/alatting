# coding=utf-8

from django.contrib.auth.models import User

from django.db import models
from alatting import settings
from alatting_website.model.poster import Poster
from alatting_website.models import AlattingBaseModel
from utils.constants import TRUE_FALSE
from utils.db.fields import BigAutoField, BigOneToOneField
from alatting_website.model.resource import Image, Music
from PIL import Image as pilimage


class SystemImage(models.Model):
    id = BigAutoField(primary_key=True)
    image = models.ForeignKey(Image, related_name='system_images', blank=True, null=True)
    name = models.CharField(max_length=64, unique=True)
    text = models.TextField(
        default='',
        blank=True,
        help_text=u'保存svg图片格式'
    )

    def __str__(self):
        return "{:d}".format(self.pk)


class SystemBackground(models.Model):
    id = BigAutoField(primary_key=True)
    image = models.ForeignKey(Image, related_name='system_background')
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
        img_obj = Image(file=thumbnail_file.replace(settings.MEDIA_ROOT, ''))
        img_obj.save()
        return img_obj

    def save(self, *args, **kwargs):
        full_path = '{}{}'.format(settings.BASE_DIR, self.image.file.url)
        self.thumbnail_img = self._thumbnail_save(full_path)
        super(SystemBackground, self).save(*args, **kwargs)


class SystemMusic(models.Model):
    id = BigAutoField(primary_key=True)
    music = models.ForeignKey(Music, related_name='system_music')
    name = models.CharField(max_length=64)

    def __str__(self):
        return "{:d}".format(self.pk)


class ServiceBargain(AlattingBaseModel):
    poster = BigOneToOneField(Poster, primary_key=True, parent_link=True)
    server = models.ForeignKey(
        User,
        verbose_name=u'服务者',
        related_name='+',
        help_text=u'服务者',
    )
    consumer = models.ForeignKey(
        User,
        verbose_name=u'需求者',
        related_name='+',
        help_text=u'需求者'
    )
    price = models.FloatField(
        verbose_name=u'价格(元)'
    )
    accepted = models.BooleanField(
        verbose_name=u'已接受',
        default=False,
        choices=TRUE_FALSE
    )
    refused = models.BooleanField(
        verbose_name=u'已拒绝',
        default=False,
        choices=TRUE_FALSE
    )
    note = models.CharField(
        verbose_name=u'留言',
        max_length=300,
        default=''
    )

    def __str__(self):
        return '服务:%s-需求:%s-价格:%s' % (
            self.server.username,
            self.consumer.username,
            self.price
        )

    class Meta:
        verbose_name_plural = verbose_name = '服务询价'
