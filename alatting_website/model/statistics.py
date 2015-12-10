from django.db import models
from django.db import transaction
from django.contrib.auth.models import User
from django.core import validators
from utils.db.fields import OverWriteFileField, OverWriteImageField, OverWriteVideoField, \
    BigAutoField, BigForeignKey, BigOneToOneField
from utils.db.utils import Utils as DBUtils


class Statistics(models.Model):
    # poster = BigOneToOneField(Poster, primary_key=True, db_column='id', related_name='poster_statistics')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    # rating
    ratings_count = models.IntegerField(default=0)
    ratings_total = models.IntegerField(default=0)
    five_count = models.IntegerField(default=0)
    four_count = models.IntegerField(default=0)
    three_count = models.IntegerField(default=0)
    two_count = models.IntegerField(default=0)
    one_count = models.IntegerField(default=0)
    #
    scans_count = models.IntegerField(default=0)
    views_count = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    favorites_count = models.IntegerField(default=0)
    fun_count = models.IntegerField(default=0)
    complains_count = models.IntegerField(default=0)
    # score
    fun_survey_score = models.FloatField(default=0, validators=[validators.MinValueValidator(0), validators.MaxValueValidator(1)])
    fun_review_score = models.FloatField(default=0, validators=[validators.MinValueValidator(0), validators.MaxValueValidator(1)])
    # contacted_count
    phone_contacted_count = models.IntegerField(default=0)
    email_contacted_count = models.IntegerField(default=0)
    map_contacted_count = models.IntegerField(default=0)
    # shared_count
    facebook_shared_count = models.IntegerField(default=0)
    pinterest_shared_count = models.IntegerField(default=0)
    twitter_shared_count = models.IntegerField(default=0)
    linkedin_shared_count = models.IntegerField(default=0)
    google_shared_count = models.IntegerField(default=0)
    email_shared_count = models.IntegerField(default=0)

    MIN_PERCENT = 30

    class Meta:
        abstract = True

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

    @property
    def ratings_average(self):
        if self.ratings_count:
            value = self.ratings_total / self.ratings_count
        else:
            value = 0
        return value

    @property
    def shares_count(self):
        count = self.facebook_shared_count + self.twitter_shared_count + self.pinterest_shared_count + \
            self.linkedin_shared_count + self.google_shared_count + self.email_shared_count
        return count

    VIEWS_WEIGHT, LIKES_WEIGHT, FAVORITES_WEIGHT, RATINGS_WEIGHT, CONTACTS_WEIGHT, SHARES_WEIGHT = 1/6, 1/6, 1/6, 1/6, 1/6, 1/6

    @property
    def popular_score(self):
        """
        :return an integer:
        """
        if not hasattr(self, '_popular_score'):
            contacted_count = self.phone_contacted_count + self.email_contacted_count + self.map_contacted_count
            shared_count = self.facebook_shared_count + self.pinterest_shared_count + self.twitter_shared_count + \
                self.linkedin_shared_count + self.google_shared_count + self.email_shared_count
            score = self.views_count * self.VIEWS_WEIGHT + self.likes_count * self.LIKES_WEIGHT + \
                    self.favorites_count * self.FAVORITES_WEIGHT + self.ratings_count * self.RATINGS_WEIGHT + \
                contacted_count * self.CONTACTS_WEIGHT + shared_count * self.SHARES_WEIGHT
            score = round(score)
            setattr(self,  '_popular_score', score)
        return getattr(self, '_popular_score')

    COMPLAIN_WEIGHT, LIKE_WEIGHT, RATING_WEIGHT = -1/3, 1/3, 2/3

    @property
    def credit_score(self):
        """
        :return a float between 0 - 1:
        """
        if not hasattr(self, '_credit_score'):
            score = 0
            if self.ratings_count:
                rating_score = self.ratings_total / self.ratings_count / 5
                score += rating_score * self.RATING_WEIGHT
            if self.views_count:
                complain_score = self.complains_count / self.views_count
                score += complain_score * self.COMPLAIN_WEIGHT
                like_score = self.likes_count / self.views_count
                score += like_score * self.LIKE_WEIGHT
            setattr(self,  '_credit_score', score)
        return getattr(self, '_credit_score')

    @property
    def credit(self):
        return self.credit_score * 100

    SURVEY_WEIGHT, REVIEW_WEIGHT, FUN_WEIGHT, FUN_LIKE_WEIGHT, FAVORITE_WEIGHT = 1/5, 1/5, 1/5, 1/5, 1/5

    @property
    def fun_score(self):
        """
        :return a float between 0 - 1:
        """
        if not hasattr(self, '_fun_score'):
            score = self.fun_survey_score * self.SURVEY_WEIGHT + self.fun_review_score * self.REVIEW_WEIGHT
            if self.views_count:
                fun_count_score = self.fun_count / self.views_count
                score += fun_count_score * self.FUN_WEIGHT
                like_score = self.likes_count / self.views_count
                score += like_score * self.FUN_LIKE_WEIGHT
                favorite_score = self.favorites_count / self.views_count
                score += favorite_score * self.FAVORITE_WEIGHT
            setattr(self,  '_fun_score', score)

        return getattr(self, '_fun_score')

    POPULAR_WEIGHT, FUN_WEIGHT, CREDIT_WEIGHT = 1/3, 1/3, 1/3

    @property
    def overall_score(self):
        score = self.popular_score * self.POPULAR_WEIGHT + self.credit_score * self.CREDIT_WEIGHT + self.fun_score * \
            self.FUN_WEIGHT
        return score

    Medal_Levels = (1000, 10000, 100000, 1000000)

    @property
    def medal_info(self):
        score = self.overall_score
        last = None
        for index in range(len(self.Medal_Levels) - 1, -1, -1):
            item = self.Medal_Levels[index]
            if score >= item:
                break
            last = item
        return index, last

    @property
    def medal_index(self):
        return self.medal_info[0]

    @property
    def medal_next_score(self):
        return self.medal_info[1]


class PosterStatistics(Statistics):
    poster = BigOneToOneField('Poster', primary_key=True, db_column='id', related_name='poster_statistics')


class HistoryStatistics(Statistics):
    poster = BigOneToOneField('Poster', primary_key=True, db_column='id', related_name='history_statistics')

    REFRESH_LIMIT = 100

    def favortes_count_change(self):
        other = self.poster.poster_statistics
        change = other.favorites_count - self.favorites_count
        return change

    def views_count_change(self):
        other = self.poster.poster_statistics
        change = other.views_count - self.views_count
        return change

    def likes_count_change(self):
        other = self.poster.poster_statistics
        change = other.likes_count - self.likes_count
        return change

    def shares_count_change(self):
        other = self.poster.poster_statistics
        change = other.shares_count - self.shares_count
        return change

    def fun_count_change(self):
        other = self.poster.poster_statistics
        change = other.fun_count - self.fun_count
        return change

    def ratings_average_change(self):
        other = self.poster.poster_statistics
        change = other.ratings_average - self.ratings_average
        return change

    @classmethod
    def compute_change_percent(cls, value):
        value *= 100
        value = min(value, 100)
        value = max(value, 0)
        return value

    def popular_change(self):
        other = self.poster.poster_statistics
        if self.popular_score != 0:
            change = (other.popular_score - self.popular_score) / self.popular_score
        else:
            change = 1
        return change

    def popular_change_percent(self):
        return self.compute_change_percent(self.popular_change())

    def credit_change(self):
        other = self.poster.poster_statistics
        if self.credit_score != 0:
            change = (other.credit_score - self.credit_score) / self.credit_score
        else:
            change = 1
        return change

    def credit_change_percent(self):
        return self.compute_change_percent(self.credit_change())

    def fun_change(self):
        other = self.poster.poster_statistics
        if self.fun_score != 0:
            change = (other.fun_score - self.fun_score) / self.fun_score
        else:
            change = 1
        return change

    def fun_change_percent(self):
        return self.compute_change_percent(self.fun_change())

    def score_change(self):
        other = self.poster.poster_statistics
        if self.overall_score != 0:
            change = (other.overall_score - self.overall_score) / self.overall_score
        else:
            change = 1
        return change

    def score_total_change(self):
        other = self.poster.poster_statistics
        change = other.overall_score - self.overall_score
        return change

    def score_change_percent(self):
        return self.compute_change_percent(self.score_change())

    @classmethod
    def refresh_statistics(cls):
        queryset = HistoryStatistics.objects.all().select_related('poster__poster_statistics').order_by('poster')
        offset = 0
        fields = cls._meta.get_fields()
        while True:
            histories = queryset[offset:offset + cls.REFRESH_LIMIT]
            offset += len(histories)
            if histories:
                for history in histories:
                    poster_statistics = history.poster.poster_statistics
                    for field in fields:
                        key = field.name
                        value = getattr(poster_statistics, key)
                        setattr(history, key, value)
                    history.save()
            else:
                break
        return offset


class PosterLike(models.Model):
    id = BigAutoField(primary_key=True)
    poster = BigForeignKey('Poster', related_name='poster_likes')
    creator = models.ForeignKey(User)
    liked = models.BooleanField(default=True)

    class Meta:
        unique_together = ('poster', 'creator')

    def __str__(self):
        return "{:d}".format(self.pk)

    def save(self, **kwargs):
        adding = self._state.adding
        with transaction.atomic():
            if not adding:
                old_poster_like = PosterLike.objects.filter(pk=self.pk).only('liked').select_for_update()
                old_poster_like = old_poster_like[0]
            super(PosterLike, self).save(**kwargs)
            queryset = PosterStatistics.objects.filter(pk=self.poster_id)
            if adding:
                fields = {'likes_count': 1}
                DBUtils.increase_counts(queryset, fields)
            elif old_poster_like.liked != self.liked:
                if self.liked:
                    likes_count = 1
                else:
                    likes_count = -1
                DBUtils.increase_counts(queryset, {'likes_count': likes_count})


class PosterFun(models.Model):
    id = BigAutoField(primary_key=True)
    poster = BigForeignKey('Poster', related_name='poster_funs')
    ip_address = models.GenericIPAddressField()

    class Meta:
        unique_together = ('poster', 'ip_address')

    def __str__(self):
        return "{:d} -> {:s}".format(self.pk, self.ip_address)

    def save(self, **kwargs):
        if self._state.adding:
            with transaction.atomic():
                super(PosterFun, self).save(**kwargs)
                queryset = PosterStatistics.objects.filter(pk=self.poster_id)
                DBUtils.increase_counts(queryset, {'fun_count': 1})


class Rating(models.Model):
    id = BigAutoField(primary_key=True)
    poster = BigForeignKey('Poster', related_name='ratings')
    creator = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    rate = models.SmallIntegerField(default=5,
                                    validators=[validators.MinValueValidator(1), validators.MaxValueValidator(5)])
    RATE_TO_FIELD = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five'}
    RATE_TO_FIELD = {key: value + '_count' for key, value in RATE_TO_FIELD.items()}

    def poster_statistics(self):
        name = '_poster_statistics'
        if not hasattr(self, name):
            setattr(self, name, PosterStatistics.objects.get(poster_id=self.poster_id))
        return getattr(self, name)

    def save(self, **kwargs):
        adding = self._state.adding
        with transaction.atomic():
            if not adding:
                old_rating = Rating.objects.filter(pk=self.pk).only('rate').select_for_update()
                old_rating = old_rating[0]
            super(Rating, self).save(**kwargs)
            queryset = PosterStatistics.objects.filter(pk=self.poster_id)
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
    poster = BigForeignKey('Poster')
    creator = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=256)
    content = models.CharField(max_length=2048)

    def __str__(self):
        return "{:d}".format(self.pk)
