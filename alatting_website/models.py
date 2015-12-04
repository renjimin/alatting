from django.db import models
from django.contrib.auth.models import User
from alatting_website.model.statistics import PosterStatistics, HistoryStatistics, PosterLike, PosterFun, Comment, Rating
from alatting_website.model.resource import Image, Video, Music, PosterImage, PosterVideo
from alatting_website.model.poster import Poster, PosterPage, ActivityInvitation, BusinessMarketing, ProductSell, ExpertShow
from utils import file
from utils.db.fields import OverWriteFileField, OverWriteImageField, OverWriteVideoField, \
    BigAutoField, BigForeignKey, BigOneToOneField


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
    gender = models.CharField(max_length=15, choices=GENDER_CHOICES, default='unknown')
    avatar = OverWriteImageField(upload_to=file.get_avatar_path, default='avatars/avatar.png')

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
    parent = models.ForeignKey('Category', null=True, blank=True)
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    name = models.CharField(max_length=63, blank=True, default='', unique=True)
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
    city = models.CharField(max_length=128)
    state = models.CharField(max_length=128)
    country = models.CharField(max_length=16)
    post_code = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{:s}".format(self.address1)


class Template(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return "{:s}".format(self.name)


class TemplateRegion(models.Model):
    template = models.ForeignKey(Template, related_name='template_regions')
    name = models.CharField(max_length=64)
    left = models.FloatField()
    top = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    polygon = models.CharField(max_length=256)  # use percentage

    class Meta:
        unique_together = ('template', 'name')

    def __str__(self):
        return "{:s}".format(self.name)


