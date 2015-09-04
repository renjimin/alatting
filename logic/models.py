from django.db import models
from django.contrib.auth.models import User
from model_utils.managers import InheritanceManager
from utils import file


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

    def __str__(self):
        return "{:d}".format(self.pk)


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    file = models.ImageField(upload_to=file.get_image_path)  # TODO: update the upload_to function
    #width = models.PositiveSmallIntegerField()
    #height = models.PositiveSmallIntegerField()

    def __str__(self):
        return "{:d}".format(self.pk)


class Music(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to=file.get_music_path)
    format = models.CharField(max_length=31, default='mp3')

    def __str__(self):
        return "{:d}".format(self.pk)


class Video(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to=file.get_video_path)
    format = models.CharField(max_length=31, default='mp4')

    def __str__(self):
        return "{:d}".format(self.pk)


class Category(models.Model):
    TYPE_INVITE = 'Invite'
    TYPE_ACTIVITY = 'Activity'
    TYPE_PRODUCT = 'Product'
    TYPE_EXPERT = 'Expert'
    TYPE_RESUME = 'Resume'
    TYPE_WEBSITE = 'Website'
    TYPE_BUSINESS = 'Business'
    TYPE_CHOICES = (
        (TYPE_INVITE, TYPE_INVITE),
        (TYPE_ACTIVITY, TYPE_ACTIVITY),
        (TYPE_PRODUCT, TYPE_PRODUCT),
        (TYPE_EXPERT, TYPE_EXPERT),
        (TYPE_RESUME, TYPE_RESUME),
        (TYPE_WEBSITE, TYPE_WEBSITE),
        (TYPE_BUSINESS, TYPE_BUSINESS),
    )
    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey('Category', null=True, blank=True)
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    name = models.CharField(max_length=63)
    desc = models.CharField(max_length=127)

    def __str__(self):
        return "{:s} -> {:s}".format(self.type, self.name)


class Poster(models.Model):
    STATUS_DRAFT = 'Draft'
    STATUS_PUBLISHED = 'Published'
    STATUS_CHOICES = (
        (STATUS_DRAFT, STATUS_DRAFT),
        (STATUS_PUBLISHED, STATUS_PUBLISHED),
    )
    id = models.AutoField(primary_key=True)
    creator = models.ForeignKey(Person)
    music = models.ForeignKey(Music, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    # type = models.CharField(max_length=15)
    category = models.ForeignKey(Category)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    width = models.PositiveSmallIntegerField(default=800)
    height = models.PositiveSmallIntegerField(default=1024)
    title = models.CharField(max_length=127)
    desc = models.CharField(max_length=255)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    html = models.FileField(upload_to=file.get_html_path)
    css = models.FileField(upload_to=file.get_css_path)
    script = models.FileField(upload_to=file.get_script_path)

    objects = InheritanceManager()

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterImage(models.Model):
    id = models.AutoField(primary_key=True)
    poster = models.ForeignKey(Poster)
    image = models.ForeignKey(Image)

    class Meta:
        unique_together = ('poster', 'image')

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterVideo(models.Model):
    id = models.AutoField(primary_key=True)
    poster = models.ForeignKey(Poster)
    video = models.ForeignKey(Video)

    class Meta:
        unique_together = ('poster', 'video')

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterLike(models.Model):
    id = models.AutoField(primary_key=True)
    poster = models.ForeignKey(Poster)
    person = models.ForeignKey(Person)

    class Meta:
        unique_together = ('poster', 'person')

    def __str__(self):
        return "{:d}".format(self.pk)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    poster = models.ForeignKey(Poster)
    person = models.ForeignKey(Person)
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=127)
    desc = models.CharField(max_length=255)

    def __str__(self):
        return "{:d}".format(self.pk)


class Invite(Poster):

    def __str__(self):
        return "{:d}".format(self.pk)


class Activity(Poster):

    def __str__(self):
        return "{:d}".format(self.pk)


class Product(Poster):

    def __str__(self):
        return "{:d}".format(self.pk)


class Expert(Poster):

    def __str__(self):
        return "{:d}".format(self.pk)


class Resume(Poster):

    def __str__(self):
        return "{:d}".format(self.pk)


class Website(Poster):

    def __str__(self):
        return "{:d}".format(self.pk)


class Business(Poster):

    def __str__(self):
        return "{:d}".format(self.pk)