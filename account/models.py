# coding=utf=8

from django.db import models
from django.contrib.auth.models import User
from alatting_website.models import AlattingBaseModel
from utils import file
from utils.db.fields import (BigAutoField, OverWriteImageField)


class LoginMessage(models.Model):
    id = BigAutoField(primary_key=True)
    username = models.CharField(max_length=255, default='')
    message = models.CharField(max_length=10, default='')
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{:s}".format(self.id)


class UserFriends(models.Model):
    id = BigAutoField(primary_key=True)
    # user1 follow user2
    user1 = models.ForeignKey(User, related_name='user1')
    user2 = models.ForeignKey(User, related_name='user2')

    def __str__(self):
        return "{:d}".format(self.pk)


class Person(models.Model):
    GENDER_UNKNOWN = 'Unknown'
    GENDER_MALE = 'Male'
    GENDER_FEMALE = 'Female'
    GENDER_CHOICES = (
        (GENDER_UNKNOWN, GENDER_UNKNOWN),
        (GENDER_MALE, GENDER_MALE),
        (GENDER_FEMALE, GENDER_FEMALE),
    )
    USER_TYPE_SERVER = 'Server'
    USER_TYPE_CONSUMER = 'Consumer'
    USER_TYPE_CHOICES = (
        (USER_TYPE_SERVER, USER_TYPE_SERVER),
        (USER_TYPE_CONSUMER, USER_TYPE_CONSUMER)
    )
    user = models.OneToOneField(User, db_column='id', primary_key=True)
    gender = models.CharField(
        max_length=15, choices=GENDER_CHOICES, default='unknown'
    )
    # 手机号
    phonenumber = models.CharField(max_length=12, null=True, default='')
    avatar = OverWriteImageField(
        upload_to=file.get_avatar_path, default='avatars/avatar.png'
    )
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default=USER_TYPE_SERVER
    )

    def __str__(self):
        return "{:d}".format(self.pk)


class UserCategory(AlattingBaseModel):
    from alatting_website.models import Category
    user = models.ForeignKey(User, verbose_name=u'用户')
    sub_category = models.ForeignKey(
        Category,
        verbose_name=u'行业分类',
        help_text=u'保存二级行业分类'
    )

    class Meta:
        verbose_name_plural = verbose_name = u'用户关注行业'

    def __str__(self):
        return u'%s_%s' % (self.user, self.sub_category.name)
