from decimal import Decimal
import os
import re
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from alatting_website.model.statistics import (
    PosterStatistics, HistoryStatistics, PosterLike,
    PosterFun, PosterFavorites, PosterSubscribe, Comment, Rating
)
from alatting_website.model.resource import (
    Image, Video, Music, PosterImage, PosterVideo
)
from alatting_website.model.poster import (
    Poster, PosterPage, ActivityInvitation, BusinessMarketing,
    ProductSell, ExpertShow, PageText, BusinessCard, PosterMoreLink,
    AbstractPageTemplate
)
from utils import file
from utils.db.fields import (
    OverWriteFileField, OverWriteImageField, OverWriteVideoField,
    BigAutoField, BigForeignKey, BigOneToOneField
)


class Person(models.Model):
    GENDER_UNKNOWN = 'Unknown'
    GENDER_MALE = 'Male'
    GENDER_FEMALE = 'Female'
    GENDER_CHOICES = (
        (GENDER_UNKNOWN, GENDER_UNKNOWN),
        (GENDER_MALE, GENDER_MALE),
        (GENDER_FEMALE, GENDER_FEMALE),
    )
    user = models.OneToOneField(User, db_column='id', primary_key=True)
    gender = models.CharField(
        max_length=15, choices=GENDER_CHOICES, default='unknown'
    )
    phonenumber = models.CharField(max_length=12, null=True, default='')  # 手机号
    avatar = OverWriteImageField(
        upload_to=file.get_avatar_path, default='avatars/avatar.png'
    )

    def __str__(self):
        return "{:d}".format(self.pk)


class Category(models.Model):
    TYPE_ACTIVITY = 'Activity'
    TYPE_PRODUCT = 'Product'
    TYPE_EXPERT = 'Expert'
    TYPE_BUSINESS = 'Business'
    TYPE_CHOICES = (
        (TYPE_ACTIVITY, ActivityInvitation),
        (TYPE_PRODUCT, ProductSell),
        (TYPE_EXPERT, ExpertShow),
        (TYPE_BUSINESS, BusinessMarketing),
    )
    TYPE_DICT = {
        TYPE_ACTIVITY: ActivityInvitation,
        TYPE_PRODUCT: ProductSell,
        TYPE_EXPERT: ExpertShow,
        TYPE_BUSINESS: BusinessMarketing,
    }
    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey('Category', null=True, blank=True, related_name='children')
    type = models.CharField(
        max_length=15,
        choices=TYPE_CHOICES,
        default=TYPE_BUSINESS
    )
    name = models.CharField(max_length=63, blank=True, unique=True)
    description = models.CharField(max_length=127, blank=True, default='')
    tags = models.CharField(max_length=2048, blank=True, default='')

    def __str__(self):
        return "{:s}".format(self.name, )

    def get_type_class(self):
        return self.TYPE_DICT[self.type]


class Address(models.Model):
    id = BigAutoField(primary_key=True)
    address1 = models.CharField(max_length=128)
    address2 = models.CharField(max_length=128, blank=True, default='')
    city = models.CharField(max_length=128, blank=True, default='')
    state = models.CharField(max_length=128, blank=True, default='')
    country = models.CharField(max_length=16, blank=True, default='')
    post_code = models.CharField(max_length=16, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{:s}".format(self.address1)


class Template(models.Model):
    name = models.CharField(max_length=64, unique=True)
    image = models.ForeignKey(Image, default=None, null=True, blank=False)

    def __str__(self):
        return "{:s}".format(self.name)

    def get_template_static_dir_path(self, with_root=False):
        dir_root = os.path.join(settings.BASE_DIR, 'poster',
                                'templates', 'page_template')
        full_path = os.path.join(dir_root, self.name)
        if with_root:
            return full_path
        else:
            return full_path.replace(settings.BASE_DIR, '')

    def html_path(self):
        return os.path.join(self.get_template_static_dir_path(), 'index.html')

    def css_path(self):
        return os.path.join(self.get_template_static_dir_path(), 'index.css')

    def js_path(self):
        return os.path.join(self.get_template_static_dir_path(), 'index.js')

    def static_file_exists(self):
        html = os.path.join(settings.BASE_DIR, self.html_path()[1:])
        css = os.path.join(settings.BASE_DIR, self.css_path()[1:])
        js = os.path.join(settings.BASE_DIR, self.js_path()[1:])
        return all([
            os.path.exists(html),
            os.path.exists(css),
            os.path.exists(js)
        ])


class TemplateRegion(models.Model):
    template = models.ForeignKey(Template, related_name='template_regions')
    name = models.CharField(max_length=64)
    left = models.FloatField()
    top = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    polygon = models.CharField(
        max_length=256,
        blank=True,
        default=''
    )  # use percentage

    class Meta:
        unique_together = ('template', 'name')

    def __str__(self):
        return "{:s}".format(self.name)

    @classmethod
    def polygon_to_points(cls, polygon):
        polygon = polygon.replace('%', '')
        pairs = polygon.split(',')
        for index in range(len(pairs)):
            pair = pairs[index].strip()
            items = re.split('\s+', pair)
            for pos in range(len(items)):
                items[pos] = Decimal(items[pos]) / 100
                items[pos] = str(items[pos])
            pairs[index] = ' '.join(items)
        points = ', '.join(pairs)
        return points

    def points(self):
        return self.polygon_to_points(self.polygon)


class CategoryKeyword(models.Model):
    category = models.ForeignKey(
        Category,
        limit_choices_to={'parent__isnull': False},
        help_text=u'选用二级分类'
    )
    verb = models.CharField(max_length=20, help_text=u'动词')
    noun = models.CharField(max_length=100, help_text=u'名词')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return u'%s + %s' % (self.verb, self.noun)
