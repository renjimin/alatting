# coding=utf-8
import datetime
import os
from django.conf import settings
from django.core.urlresolvers import reverse

from django.db import models
from django.db import transaction
from django.contrib.auth.models import User
from django.db.models import SET_NULL
from utils.db.fields import OverWriteFileField, \
    BigAutoField, BigForeignKey, BigOneToOneField
from model_utils.managers import InheritanceManager
from utils import file
from alatting_website.model.statistics import (PosterStatistics,
                                               HistoryStatistics)
from utils.file import read_template_file_content


def get_default_lifetime_value():
    import json
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    foo = lambda x: {"time_start": "09:00:00", "time_end": "18:00:00", x: 1}
    result = {}
    for d in days:
        status = "disabled" if d in ["Saturday", "Sunday"] else "enabled"
        result[d] = foo(status)
    return json.dumps(result)


class Poster(models.Model):
    STATUS_DRAFT = 'Draft'
    STATUS_PUBLISHED = 'Published'
    STATUS_ACTIVE = 'Active'
    STATUS_INACTIVE = 'Inactive'
    STATUS_CHOICES = (
        (STATUS_DRAFT, STATUS_DRAFT),
        (STATUS_PUBLISHED, STATUS_PUBLISHED),
        (STATUS_ACTIVE, STATUS_ACTIVE),
        (STATUS_INACTIVE, STATUS_INACTIVE)
    )
    LIFETIME_WEEKLY = 'weekly'
    LIFETIME_SPECIFIC_DAYS = 'specific_days'
    LIFETIME_CHOICES = (
        (LIFETIME_WEEKLY, LIFETIME_WEEKLY),
        (LIFETIME_SPECIFIC_DAYS,LIFETIME_SPECIFIC_DAYS)
    )
    id = BigAutoField(primary_key=True)
    creator = models.ForeignKey(User, related_name="poster_creator")
    unique_name = models.CharField(max_length=255)
    url = models.CharField(max_length=255, default='')

    #qr_image
    logo_image = models.ForeignKey(
        'Image', related_name='poster_logo_images', null=True,
        on_delete=SET_NULL
    )
    logo_title = models.CharField(
        max_length=255, default='',
        blank=True
    )
    short_description = models.CharField(max_length=255, default='')
    phone = models.CharField(max_length=16, default='')
    mobile = models.CharField(max_length=16, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    address = BigForeignKey('Address', related_name='posters', null=True)
    lifetime_type = models.CharField(
        max_length=32, choices=LIFETIME_CHOICES, default=LIFETIME_WEEKLY
    )
    lifetime_timezone = models.CharField(
        max_length=32, default='Asia/Shanghai'
    )
    lifetime_value = models.CharField(
        max_length=1024, default=get_default_lifetime_value
    )
    # music = models.ForeignKey('Music', null=True, blank=True)
    music = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    main_category = models.ForeignKey(
        'Category',
        related_name='main_posters',
        limit_choices_to={'parent__isnull': True}
    )
    sub_category = models.ForeignKey(
        'Category',
        related_name='sub_posters',
        limit_choices_to={'parent__isnull': False}
    )
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    width = models.PositiveSmallIntegerField(default=800)
    height = models.PositiveSmallIntegerField(default=1024)
    data = OverWriteFileField(
        upload_to=file.get_data_path,
        default='',
        blank=True
    )
    html = OverWriteFileField(
        upload_to=file.get_html_path,
        default='',
        blank=True
    )
    css = OverWriteFileField(
        upload_to=file.get_css_path,
        default='',
        blank=True
    )
    script = OverWriteFileField(
        upload_to=file.get_script_path,
        default='',
        blank=True
    )
    tags = models.CharField(
        max_length=128,
        default='',
        blank=True
    )
    snapshot = OverWriteFileField(
        verbose_name=u'首页截屏',
        upload_to=file.get_snapshot_path,
        default='',
        blank=True
    )

    objects = InheritanceManager()

    @property
    def thumb(self):
        return self.snapshot

    # prevent save parent
    def save_base(self, raw=False, *args, **kwargs):
        _raw = getattr(self, '_raw', None)
        if _raw is not None:
            self._raw = raw
            raw = _raw
        super(Poster, self).save_base(raw, *args, **kwargs)

    # recover raw
    def _save_table(self, raw=False, *args, **kwargs):
        _raw = getattr(self, '_raw', None)
        if _raw is not None:
            raw = _raw
        return super(Poster, self)._save_table(raw, *args, **kwargs)

    def save(self, **kwargs):
        if self._state.adding and self.__class__ is Poster:
            with transaction.atomic():
                super(Poster, self).save(**kwargs)
                template = getattr(self, 'template', None)
                if template:
                    PosterPage.objects.create(
                        template=self.template,
                        poster=self
                    )
                self.poster_statistics = PosterStatistics.objects.create(
                    poster=self
                )
                self.history_statistics = HistoryStatistics.objects.create(
                    poster=self
                )
                child_type = self.main_category.get_type_class()
                child = child_type(poster=self)
                child._raw = True
                child.save(force_insert=True)
        else:
            super(Poster, self).save(**kwargs)

    def __str__(self):
        return "{:d}".format(self.pk)

    def get_absolute_url(self):
        return reverse('posters:show', kwargs={'pk': self.id})


class AbstractPageTemplate(models.Model):
    html = OverWriteFileField(
        upload_to=file.get_html_path,
        default='',
        blank=True,
        help_text=u'发布的html内容'
    )
    css = OverWriteFileField(
        upload_to=file.get_css_path,
        default='',
        blank=True,
        help_text=u'发布的css内容'
    )
    script = OverWriteFileField(
        upload_to=file.get_script_path,
        default='',
        blank=True,
        help_text=u'发布的js内容'
    )

    class Meta:
        abstract = True


class PosterPage(AbstractPageTemplate):
    # 发布后的静态文件保存路径
    STATIC_DIR_STR = 'poster/{year}/{poster_id}/{page_id}'

    id = BigAutoField(primary_key=True)
    poster = BigForeignKey(Poster, related_name='poster_pages')
    template = models.ForeignKey('Template')
    index = models.SmallIntegerField(default=0)
    name = models.CharField(max_length=64, default='')
    temp_html = models.TextField(
        default='',
        blank=True,
        help_text=u'保存临时修改的html内容'
    )
    temp_css = models.TextField(
        default='',
        blank=True,
        help_text=u'保存临时修改的css内容'
    )
    temp_script = models.TextField(
        default='',
        blank=True,
        help_text=u'保存临时修改的js内容'
    )

    # class Meta:
    # unique_together = ('poster', 'index')

    def __str__(self):
        return "{:s}".format(self.name)

    def get_static_file_path(self, with_root=False):
        dir_path = self.STATIC_DIR_STR.format(
            year=datetime.datetime.now().year,
            poster_id=self.poster.id,
            page_id=self.id
        )
        if with_root:
            return os.path.join(settings.MEDIA_ROOT, dir_path)
        else:
            return dir_path

    def check_and_create_static_file_dir(self):
        full_dir_path = self.get_static_file_path(with_root=True)
        if not os.path.exists(full_dir_path):
            os.makedirs(full_dir_path)
        return full_dir_path

    def render_html_to_string(self):
        return read_template_file_content(self.html.url)

    def render_css_to_string(self):
        return read_template_file_content(self.css.url)

    def render_script_to_string(self):
        return read_template_file_content(self.script.url)


class PageText(models.Model):
    id = BigAutoField(primary_key=True)
    poster = BigForeignKey(Poster, related_name='poster_texts')
    poster_page = BigForeignKey(PosterPage, related_name='page_texts')
    content = models.CharField(max_length=255)
    name = models.CharField(max_length=64)

    class Meta:
        unique_together = ('poster', 'name')

    def __str__(self):
        return "{:s}".format(self.name)


class ActivityInvitation(Poster):
    ACTIVITY_STATUS_COMING = 'coming'
    ACTIVITY_STATUS_NOW = 'now'
    ACTIVITY_STATUS_FINISHED = 'finished'
    ACTIVITY_STATUS_CANCELLED = 'cancelled'
    ACTIVITY_STATUS_CHOICES = (
        (ACTIVITY_STATUS_COMING, ACTIVITY_STATUS_COMING),
        (ACTIVITY_STATUS_NOW, ACTIVITY_STATUS_NOW),
        (ACTIVITY_STATUS_FINISHED, ACTIVITY_STATUS_FINISHED),
        (ACTIVITY_STATUS_CANCELLED, ACTIVITY_STATUS_CANCELLED),
    )
    poster = BigOneToOneField(Poster, primary_key=True, parent_link=True)
    activity_status = models.CharField(
        max_length=15,
        choices=ACTIVITY_STATUS_CHOICES,
        default=ACTIVITY_STATUS_COMING
    )
    invitation_message = models.CharField(max_length=255, default='')
    activity_start_time = models.DateTimeField(auto_now_add=True)
    activity_end_time = models.DateTimeField(auto_now_add=True)
    special_description = models.CharField(
        max_length=255, blank=True, default=''
    )
    activity_reminder_message = models.CharField(
        max_length=255, blank=True, default=''
    )
    parking_notice_message = models.CharField(
        max_length=255, blank=True, default=''
    )
    accepted_count = models.IntegerField(default=0)
    rejected_count = models.IntegerField(default=0)
    need_pre_notification = models.BooleanField(default=True)
    pre_minutes_to_notify = models.IntegerField(default=0)

    def __str__(self):
        return "{:d}".format(self.pk)


class BusinessMarketing(Poster):
    poster = BigOneToOneField(Poster, primary_key=True, parent_link=True)
    slogan = models.CharField(max_length=128, blank=True, default='')
    parking_notice_message = models.CharField(
        max_length=255, blank=True, default=''
    )
    need_reservation = models.BooleanField(default=True)
    business_keywords = models.CharField(
        max_length=255, blank=True, default=''
    )

    def __str__(self):
        return "{:d}".format(self.pk)


class ProductSell(Poster):
    poster = BigOneToOneField(Poster, primary_key=True, parent_link=True)
    price = models.FloatField(default=0)
    is_negotiable = models.BooleanField(default=False)
    is_express_delivery = models.BooleanField(default=False)
    size_length = models.IntegerField(default=0)
    size_width = models.IntegerField(default=0)
    size_height = models.IntegerField(default=0)
    is_product_available = models.BooleanField(default=False)
    is_product_on_sale = models.BooleanField(default=False)
    appearance_description = models.CharField(
        max_length=255, blank=True, default=''
    )
    material_description = models.CharField(
        max_length=32, blank=True, default=''
    )
    color = models.CharField(max_length=32, blank=True, default='')

    def __str__(self):
        return "{:d}".format(self.pk)


class ExpertShow(Poster):
    SEX_MALE = 'male'
    SEX_FEMALE = 'female'
    SEX_CHOICES = (
        (SEX_MALE, SEX_MALE),
        (SEX_FEMALE, SEX_FEMALE),
    )
    DEGREE_BACHELOR = 'Bachelor'
    DEGREE_MASTER = 'Master'
    DEGREE_DOCTOR = 'PHD'
    DEGREE_CHOICES = (
        (DEGREE_BACHELOR, DEGREE_BACHELOR),
        (DEGREE_MASTER, DEGREE_MASTER),
        (DEGREE_DOCTOR, DEGREE_DOCTOR),
    )
    poster = BigOneToOneField(Poster, primary_key=True, parent_link=True)
    first_name = models.CharField(max_length=64, default='')
    last_name = models.CharField(max_length=64, default='')
    sex = models.CharField(
        max_length=10, choices=SEX_CHOICES, default=SEX_MALE
    )
    birthday = models.DateField(null=True, blank=True)
    profession = models.CharField(max_length=128, default='')
    working_years = models.IntegerField(default=0)
    degree = models.CharField(
        max_length=64, choices=DEGREE_CHOICES, default=DEGREE_BACHELOR
    )
    university = models.CharField(max_length=128, blank=True, default='')
    awards = models.CharField(max_length=2048, blank=True, default='')
    experince_description = models.CharField(max_length=2048, default='')
    industry = models.CharField(max_length=128, default='')
    specials = models.CharField(max_length=255, blank=True, default='')
    available_hours = models.CharField(max_length=64, blank=True, default='')
    need_reservation = models.BooleanField(default=False)
    expert_keywords = models.CharField(max_length=255, blank=True, default='')
    parking_notice_message = models.CharField(
        max_length=255, blank=True, default=''
    )
    resume = OverWriteFileField(null=True, blank=True)

    def __str__(self):
        return "{:d}".format(self.pk)


class BusinessCard(Poster):
    poster = BigOneToOneField(Poster, primary_key=True, parent_link=True)

    def __str__(self):
        return self.unique_name


class PosterMoreLink(models.Model):
    id = BigAutoField(primary_key=True)
    poster = BigForeignKey(Poster, related_name='poster_more_links')
    template = models.ForeignKey('Template')
    index = models.SmallIntegerField(default=0)
    name = models.CharField(max_length=200, default='')
    content = models.CharField(max_length=200, default='')
    link = models.CharField(max_length=1024, default='')

    class Meta:
        unique_together = ('poster', 'index')

    def __str__(self):
        return "{:s}".format(self.name)


class PosterKeyword(models.Model):
    id = BigAutoField(primary_key=True)
    poster = BigForeignKey(Poster, related_name='poster_keywords')
    category_keyword = models.ForeignKey('CategoryKeyword')