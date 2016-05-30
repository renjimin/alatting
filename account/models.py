# coding=utf=8

from django.db import models
from django.contrib.auth.models import User
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
    user = models.OneToOneField(User, db_column='id', primary_key=True)
    gender = models.CharField(
        max_length=15, choices=GENDER_CHOICES, default='unknown'
    )
    # 手机号
    phonenumber = models.CharField(max_length=12, null=True, default='')
    avatar = OverWriteImageField(
        upload_to=file.get_avatar_path, default='avatars/avatar.png'
    )

    def __str__(self):
        return "{:d}".format(self.pk)
