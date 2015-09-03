from django.db import models
from django.contrib.auth.models import User
from model_utils.managers import InheritanceManager


class Person(models.Model):
    user = models.OneToOneField(User, db_column='id', primary_key=True)
    gender = models.PositiveSmallIntegerField(default=0)


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    url = models.URLField()
    width = models.PositiveSmallIntegerField()
    height = models.PositiveSmallIntegerField()


class Music(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    url = models.URLField(max_length=2047)
    format = models.CharField(max_length=31)


class Video(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    url = models.URLField(max_length=2047)
    format = models.CharField(max_length=31)


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey('Category')
    name = models.CharField(max_length=63)
    desc = models.CharField(max_length=127)


class Poster(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.ForeignKey(Person)
    music = models.ForeignKey(Music)
    created = models.DateTimeField(auto_now_add=True)
    type = models.PositiveSmallIntegerField()
    category = models.ForeignKey(Category)
    status = models.PositiveSmallIntegerField()
    width = models.PositiveSmallIntegerField()
    height = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=127)
    desc = models.CharField(max_length=255)
    likes_cnt = models.IntegerField(default=0)
    cmnt_cnt = models.IntegerField(default=0)
    html = models.TextField(max_length=4095)
    css = models.TextField(max_length=4095)
    script = models.TextField(max_length=4095)

    objects = InheritanceManager()


class PosterImage(models.Model):
    id = models.AutoField(primary_key=True)
    poster = models.ForeignKey(Poster)
    image = models.ForeignKey(Image)

    class Meta:
        unique_together = ('poster', 'image')


class PosterVideo(models.Model):
    id = models.AutoField(primary_key=True)
    poster = models.ForeignKey(Poster)
    video = models.ForeignKey(Video)

    class Meta:
        unique_together = ('poster', 'video')


class PosterLike(models.Model):
    id = models.AutoField(primary_key=True)
    poster = models.ForeignKey(Poster)
    person = models.ForeignKey(Person)

    class Meta:
        unique_together = ('poster', 'person')


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    poster = models.ForeignKey(Poster)
    person = models.ForeignKey(Person)
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=127)
    desc = models.CharField(max_length=255)


class Invite(Poster):
    pass