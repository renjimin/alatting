# coding=utf=8

from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from alatting_website.models import AlattingBaseModel, Category
from utils import file
from utils.db.fields import (BigAutoField, OverWriteImageField)


class LoginMessage(models.Model):
    id = BigAutoField(primary_key=True)
    username = models.CharField(max_length=255, default='')
    message = models.CharField(max_length=10, default='')
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{:d}".format(self.id)


class UserFriends(models.Model):
    id = BigAutoField(primary_key=True)
    # user1 follow user2
    user1 = models.ForeignKey(User, related_name='user1')
    user2 = models.ForeignKey(User, related_name='user2')

    def __str__(self):
        return "{:d}".format(self.id)


class Person(models.Model):
    GENDER_UNKNOWN = 'Unknown'
    GENDER_MALE = 'Male'
    GENDER_FEMALE = 'Female'
    GENDER_CHOICES = (
        (GENDER_UNKNOWN, GENDER_UNKNOWN),
        (GENDER_MALE, GENDER_MALE),
        (GENDER_FEMALE, GENDER_FEMALE),
    )
    USER_TYPE_SERVER = 'server'
    USER_TYPE_CONSUMER = 'consumer'
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

    def create_user_category_record(self, main_category_id, sub_category_id):
        UserCategory.objects.create(
            user=self.user,
            main_category_id=main_category_id,
            sub_category_id=sub_category_id
        )

    def create_user_categorys(self, main_category_id,
                              sub_category_ids=None, input_category=''):
        main_cate = get_object_or_404(Category, pk=main_category_id)
        if sub_category_ids:
            sub_ids = sub_category_ids.split(',')
            for sub_id in sub_ids:
                sub_id = sub_id.strip()
                if sub_id:
                    self.create_user_category_record(
                        main_cate.id, sub_id
                    )

        if input_category and isinstance(input_category, str):
            input_category = input_category.strip()
            qs = Category.objects.filter(name=input_category)
            if qs.exists():
                sub_cate = qs.first()
            else:
                sub_cate = Category.objects.create(
                    name=input_category,
                    parend_id=main_cate.id,
                    type=main_cate.type,
                    audit_status=Category.AUDIT_STATUS_AUDITING
                )
            self.create_user_category_record(main_cate.id, sub_cate.id)


class UserCategory(AlattingBaseModel):
    from alatting_website.models import Category
    user = models.ForeignKey(User, verbose_name=u'用户')
    main_category = models.ForeignKey(
        Category,
        verbose_name=u'主行业分类',
        related_name='+',
        default=None
    )
    sub_category = models.ForeignKey(
        Category,
        verbose_name=u'二级行业分类',
        related_name='+',
        default=None
    )

    class Meta:
        verbose_name_plural = verbose_name = u'用户关注行业'

    def __str__(self):
        return u'%s_%s' % (self.user, self.main_category.name)
