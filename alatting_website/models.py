from django.db import models
from django.db import transaction
from django.core import validators
from django.contrib.auth.models import User
from model_utils.managers import InheritanceManager
from utils import file
from utils.db.fields import OverWriteFileField, OverWriteImageField, OverWriteVideoField, \
    BigAutoField, BigForeignKey, BigOneToOneField
from utils.db.utils import generate_uuid, Utils as DBUtils


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


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    uuid = models.CharField(max_length=64, default=generate_uuid)
    created_at = models.DateTimeField(auto_now_add=True)
    file = OverWriteImageField(upload_to=file.get_image_path, width_field='width', height_field='height')  # TODO: update the upload_to function
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
    preview = models.CharField(max_length=1023)
    file = OverWriteVideoField(upload_to=file.get_video_path, preview_field='preview')
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
    #type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    name = models.CharField(max_length=63, blank=True, default='', unique=True)
    description = models.CharField(max_length=127, blank=True, default='')
    tags = models.CharField(max_length=2048, blank=True, default='')

    def __str__(self):
        return "{:s}".format(self.name, )


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


class Poster(models.Model):
    STATUS_DRAFT = 'Draft'
    STATUS_PUBLISHED = 'Published'
    STATUS_ACTIVE = 'Active'
    STATUS_INACTIVE= 'Inactive'
    STATUS_CHOICES = (
        (STATUS_DRAFT, STATUS_DRAFT),
        (STATUS_PUBLISHED, STATUS_PUBLISHED),
        (STATUS_ACTIVE, STATUS_ACTIVE),
        (STATUS_INACTIVE, STATUS_INACTIVE)
    )
    LIFETIME_WEEKLY = 'weekly'
    LIFETIME_SPECIFIC_DAY = 'specific_day'
    LIFETIME_SPECIFIC_DAYS = 'specific_days'
    LIFETIME_CHOICES = (
        (LIFETIME_WEEKLY, LIFETIME_WEEKLY),
        (LIFETIME_SPECIFIC_DAY, LIFETIME_SPECIFIC_DAY),
        (LIFETIME_SPECIFIC_DAYS,LIFETIME_SPECIFIC_DAYS)
    )
    id = BigAutoField(primary_key=True)
    creator = models.ForeignKey(User)
    unique_name = models.CharField(max_length=255, unique=True)
    url = models.CharField(max_length=255)

    #qr_image
    logo_image = models.ForeignKey(Image, related_name='poster_logo_images')
    logo_title = models.CharField(max_length=255)
    short_description = models.CharField(max_length=255)
    phone = models.CharField(max_length=16)
    mobile = models.CharField(max_length=16, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    address = BigForeignKey(Address, related_name='posters')
    lifetime_type = models.CharField(max_length=32, choices=LIFETIME_CHOICES, default=LIFETIME_WEEKLY)
    lifetime_value = models.CharField(max_length=1024)
    music = models.ForeignKey(Music, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    main_category = models.ForeignKey(Category, related_name='main_posters')
    sub_category = models.ForeignKey(Category, related_name='sub_posters')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    width = models.PositiveSmallIntegerField(default=800)
    height = models.PositiveSmallIntegerField(default=1024)
    # desc = models.CharField(max_length=255)
    views_count = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    forwarded_count = models.IntegerField(default=0)
    reviews_score = models.SmallIntegerField(default=0)
    html = OverWriteFileField(upload_to=file.get_html_path)
    css = OverWriteFileField(upload_to=file.get_css_path)
    script = OverWriteFileField(upload_to=file.get_script_path)
    tags = models.CharField(max_length=128, default='', blank=True)

    objects = InheritanceManager()

    def save(self, **kwargs):
        adding = self._state.adding
        super(Poster, self).save(**kwargs)
        if adding:
            self.poster_rating = PosterRating.objects.create(poster=self)

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterPage(models.Model):
    poster = BigForeignKey(Poster, related_name='poster_pages')
    template = models.ForeignKey(Template)
    index = models.SmallIntegerField(default=0)
    name = models.CharField(max_length=64)

    class Meta:
        unique_together = ('poster', 'index')

    def __str__(self):
        return "{:s}".format(self.name)


class PosterImage(models.Model):
    id = models.AutoField(primary_key=True)
    poster = BigForeignKey(Poster, related_name='poster_images')
    image = models.ForeignKey(Image, related_name='poster_images')
    name = models.CharField(max_length=63)

    class Meta:
        unique_together = (('poster', 'image'), ('poster', 'name'))

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterVideo(models.Model):
    id = models.AutoField(primary_key=True)
    poster = BigForeignKey(Poster, related_name='poster_videos')
    video = models.ForeignKey(Video, related_name='poster_videos')
    name = models.CharField(max_length=63)

    class Meta:
        unique_together = (('poster', 'video'), ('poster', 'name'))

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterLike(models.Model):
    id = models.AutoField(primary_key=True)
    poster = BigForeignKey(Poster)
    user = models.ForeignKey(User)

    class Meta:
        unique_together = ('poster', 'user')

    def __str__(self):
        return "{:d}".format(self.pk)


class PosterRating(models.Model):
    poster = BigOneToOneField(Poster, primary_key=True, db_column='id', related_name='poster_rating')
    created_at = models.DateTimeField(auto_now_add=True)
    ratings_count = models.IntegerField(default=0)
    ratings_total = models.IntegerField(default=0)
    five_count = models.IntegerField(default=0)
    four_count = models.IntegerField(default=0)
    three_count = models.IntegerField(default=0)
    two_count = models.IntegerField(default=0)
    one_count = models.IntegerField(default=0)

    MIN_PERCENT = 30

    def count_max(self):
        if not hasattr(self, '_count_max'):
            self._count_max = max(self.five_count, self.four_count, self.three_count, self.two_count, self.one_count)
        return self._count_max

    def compute_percent(self, name):
        percent_name = '_' + name + '_percent'
        if not hasattr(self, percent_name):
            count_max = self.count_max()
            if count_max > 0:
                percent = getattr(self, name + '_count') / count_max
                percent = percent * (100 - self.MIN_PERCENT) + self.MIN_PERCENT
            else:
                percent = self.MIN_PERCENT
            setattr(self, percent_name, percent)
        return getattr(self, percent_name)

    def five_percent(self):
        return self.compute_percent('five')

    def four_percent(self):
        return self.compute_percent('four')

    def three_percent(self):
        return self.compute_percent('three')

    def two_percent(self):
        return self.compute_percent('two')

    def one_percent(self):
        return self.compute_percent('one')

    def __str__(self):
        return "{:d}".format(self.pk)

    def ratings_average(self):
        if self.ratings_count:
            value = self.ratings_total / self.ratings_count
        else:
            value = 0
        return value


class Rating(models.Model):
    id = BigAutoField(primary_key=True)
    poster = BigForeignKey(Poster, related_name='ratings')
    creator = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    rate = models.SmallIntegerField(default=5,
                                    validators=[validators.MinValueValidator(1), validators.MaxValueValidator(5)])
    RATE_TO_FIELD = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five'}
    RATE_TO_FIELD = {key: value + '_count' for key, value in RATE_TO_FIELD.items()}

    def poster_rating(self):
        name = '_poster_rating'
        if not hasattr(self, name):
            setattr(self, name, PosterRating.objects.get(poster_id=self.poster_id))
        return getattr(self, name)

    def save(self, **kwargs):
        adding = self._state.adding
        with transaction.atomic():
            if not adding:
                old_rating = Rating.objects.filter(pk=self.pk).only('rate').select_for_update()
                old_rating = old_rating[0]
            super(Rating, self).save(**kwargs)
            queryset = PosterRating.objects.filter(pk=self.poster_id)
            if adding:
                fields = {'ratings_count': 1, self.RATE_TO_FIELD[self.rate]: 1, 'ratings_total': self.rate}
                DBUtils.increase_counts(queryset, fields)
            elif old_rating.rate != self.rate:
                fields = {self.RATE_TO_FIELD[old_rating.rate]: -1, self.RATE_TO_FIELD[self.rate]: 1,
                          'ratings_total': self.rate - old_rating.rate}
                DBUtils.increase_counts(queryset, fields)

    class Meta:
        unique_together = ('poster', 'creator')

    def __str__(self):
        return "{:d}->{:d}".format(self.pk, self.poster.id)


class Comment(models.Model):
    id = BigAutoField(primary_key=True)
    parent = BigForeignKey('Comment', related_name='children', null=True, blank=True)
    poster = BigForeignKey(Poster)
    creator = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=256)
    content = models.CharField(max_length=2048)

    def __str__(self):
        return "{:d}".format(self.pk)


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
    activity_status = models.CharField(max_length=15, choices=ACTIVITY_STATUS_CHOICES, default=ACTIVITY_STATUS_COMING)
    invitation_message = models.CharField(max_length=255)
    activity_start_time = models.DateTimeField()
    activity_end_time = models.DateTimeField()
    special_description = models.CharField(max_length=255, blank=True, default='')
    activity_reminder_message = models.CharField(max_length=255, blank=True, default='')
    parking_notice_message = models.CharField(max_length=255, blank=True, default='')
    accepted_count = models.IntegerField(default=0)
    rejected_count = models.IntegerField(default=0)
    need_pre_notification = models.BooleanField(default=True)
    pre_minutes_to_notify = models.IntegerField(default=0)

    def __str__(self):
        return "{:d}".format(self.pk)


class BusinessMarketing(Poster):
    poster = BigOneToOneField(Poster, primary_key=True, parent_link=True)
    slogan = models.CharField(max_length=128, blank=True, default='')
    parking_notice_message = models.CharField(max_length=255, blank=True, default='')
    need_reservation = models.BooleanField(default=True)
    business_keywords = models.CharField(max_length=255, blank=True, default='')

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
    appearance_description = models.CharField(max_length=255, blank=True, default='')
    material_description = models.CharField(max_length=32, blank=True, default='')
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
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)
    birthday = models.DateField(null=True, blank=True)
    profession = models.CharField(max_length=128)
    working_years = models.IntegerField()
    degree = models.CharField(max_length=64, choices=DEGREE_CHOICES)
    university = models.CharField(max_length=128, blank=True, default='')
    awards = models.CharField(max_length=2048, blank=True, default='')
    experince_description = models.CharField(max_length=2048)
    industry = models.CharField(max_length=128)
    specials = models.CharField(max_length=255, blank=True, default='')
    available_hours = models.CharField(max_length=64, blank=True, default='')
    need_reservation = models.BooleanField(default=False)
    expert_keywords = models.CharField(max_length=255, blank=True, default='')
    parking_notice_message = models.CharField(max_length=255, blank=True, default='')
    resume = OverWriteFileField(null=True, blank=True)

    def __str__(self):
        return "{:d}".format(self.pk)