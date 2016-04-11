# coding=utf-8

from django.db import models
from utils.db.utils import generate_uuid
from utils.db.fields import (OverWriteFileField, OverWriteImageField,
                             OverWriteVideoField, BigForeignKey)
from utils import file


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    uuid = models.CharField(max_length=64, default=generate_uuid)
    created_at = models.DateTimeField(auto_now_add=True)
    # TODO: update the upload_to function
    file = OverWriteImageField(
        upload_to=file.get_image_path,
        width_field='width', height_field='height'
    )
    width = models.PositiveSmallIntegerField(blank=True)
    height = models.PositiveSmallIntegerField(blank=True)
    format = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return "{:d}".format(self.pk)


class Music(models.Model):
    id = models.AutoField(primary_key=True)
    uuid = models.CharField(max_length=64, default=generate_uuid)
    created_at = models.DateTimeField(auto_now_add=True)
    file = OverWriteFileField(upload_to=file.get_music_path)
    format = models.CharField(max_length=10, default='mp3')

    def __str__(self):
        return "{:d}".format(self.pk)


class Video(models.Model):
    id = models.AutoField(primary_key=True)
    uuid = models.CharField(max_length=64, default=generate_uuid)
    created_at = models.DateTimeField(auto_now_add=True)
    preview = models.CharField(max_length=1023, blank=True, null=True)
    file = OverWriteVideoField(
        upload_to=file.get_video_path,
        preview_field='preview'
    )
    format = models.CharField(max_length=31, default='mp4')

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterImage(models.Model):
    id = models.AutoField(primary_key=True)
    poster = BigForeignKey('Poster', related_name='poster_images')
    image = models.ForeignKey(Image, related_name='poster_images')
    name = models.CharField(max_length=63)

    class Meta:
        unique_together = (('poster', 'image'), ('poster', 'name'))

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterVideo(models.Model):
    id = models.AutoField(primary_key=True)
    poster = BigForeignKey('Poster', related_name='poster_videos')
    video = models.ForeignKey(Video, related_name='poster_videos')
    name = models.CharField(max_length=63)

    class Meta:
        unique_together = (('poster', 'video'), ('poster', 'name'))

    def __str__(self):
        return "{:d}".format(self.pk)
