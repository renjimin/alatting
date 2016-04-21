# coding=utf-8
from django.template.defaultfilters import floatformat

from rest_framework import serializers
from alatting_website.model.statistics import HistoryStatistics
from alatting_website.models import (
    PosterStatistics, Rating, PosterLike, PosterFun, PosterFavorites
)


class PosterStatisticsSerializer(serializers.ModelSerializer):
    poster_id = serializers.IntegerField(read_only=True)
    ratings_average = serializers.DecimalField(2, 1, read_only=True)
    five_percent = serializers.IntegerField(read_only=True)
    four_percent = serializers.IntegerField(read_only=True)
    three_percent = serializers.IntegerField(read_only=True)
    two_percent = serializers.IntegerField(read_only=True)
    one_percent = serializers.IntegerField(read_only=True)
    fun_score = serializers.DecimalField(2, 1, read_only=True)
    popular_score = serializers.IntegerField(read_only=True)
    credit_score = serializers.DecimalField(2, 1, read_only=True)
    overall_score = serializers.DecimalField(2, 0, read_only=True)
    medal_next_score = serializers.IntegerField(read_only=True)

    class Meta:
        model = PosterStatistics
        exclude = ('poster', )


class RatingSerializer(serializers.ModelSerializer):
    creator_id = serializers.IntegerField(read_only=True)
    poster_id = serializers.IntegerField(read_only=True)
    poster_statistics = PosterStatisticsSerializer(read_only=True)

    class Meta:
        model = Rating
        exclude = ('creator', 'poster')

    def get_unique_together_validators(self):
        return []


class PosterLikeSerializer(serializers.ModelSerializer):
    creator_id = serializers.IntegerField(read_only=True)
    poster_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = PosterLike
        exclude = ('creator', 'poster')
        extra_kwargs = {
            'liked': {
                'default': True
            }
        }

    def get_unique_together_validators(self):
        return []


class PosterFunSerializer(serializers.ModelSerializer):
    poster_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = PosterFun
        exclude = ('poster', 'ip_address')

    def get_unique_together_validators(self):
        return []

class PosterFavoritesSerializer(serializers.ModelSerializer):
    creator_id = serializers.IntegerField(read_only=True)
    poster_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = PosterFavorites
        exclude = ('creator', 'poster')
        extra_kwargs = {
            'bookmarked': {
                'default': True
            }
        }

    def get_unique_together_validators(self):
        return []


class SimpleStatisticsSerializer(serializers.Serializer):
    pass  # poster_id = serializers.IntegerField(read_only=True)


class ShareStatisticsSerializer(serializers.Serializer):
    MEDIAS = (
        ('facebook', 'Facebook'),
        ('pinterest', 'Pinterest'),
        ('twitter', 'Twitter'),
        ('linkedin', 'Linkedin'),
        ('google', 'Google'),
        ('email', 'Email'),
        ('qq', 'QQ'),
        ('weibo', 'Weibo'),
        ('wechat', 'Wechat'),
        ('qzone', 'Qzone'),
    )
    # poster_id = serializers.IntegerField(read_only=True)
    type = serializers.ChoiceField(choices=MEDIAS)


class ContactStatisticsSerializer(serializers.Serializer):
    MEDIAS = (
        ('phone', 'Phone'),
        ('email', 'Email'),
        ('map', 'Map'),
    )
    # poster_id = serializers.IntegerField(read_only=True)
    type = serializers.ChoiceField(choices=MEDIAS)


class HistoryStatisticsSerializer(serializers.ModelSerializer):
    favortes_count_change = serializers.SerializerMethodField()
    views_count_change = serializers.SerializerMethodField()
    likes_count_change = serializers.SerializerMethodField()
    shares_count_change = serializers.SerializerMethodField()
    fun_count_change = serializers.SerializerMethodField()
    ratings_average_change = serializers.SerializerMethodField()
    score_total_change = serializers.SerializerMethodField()
    fun_change_percent = serializers.SerializerMethodField()
    popular_change_percent = serializers.SerializerMethodField()
    credit_change_percent = serializers.SerializerMethodField()
    score_change_percent = serializers.SerializerMethodField()

    def get_favortes_count_change(self, obj):
        return obj.favortes_count_change()

    def get_views_count_change(self, obj):
        return obj.views_count_change()

    def get_likes_count_change(self, obj):
        return obj.likes_count_change()

    def get_shares_count_change(self, obj):
        return obj.shares_count_change()

    def get_fun_count_change(self, obj):
        return obj.fun_count_change()

    def get_ratings_average_change(self, obj):
        return floatformat(obj.ratings_average_change(), 1)

    def get_score_total_change(self, obj):
        return floatformat(obj.score_total_change(), 0)

    def get_fun_change_percent(self, obj):
        return obj.fun_change_percent()

    def get_popular_change_percent(self, obj):
        return obj.popular_change_percent()

    def get_credit_change_percent(self, obj):
        return obj.credit_change_percent()

    def get_score_change_percent(self, obj):
        return obj.score_change_percent()

    class Meta:
        model = HistoryStatistics
        fields = (
            "favortes_count_change", "views_count_change",
            "likes_count_change", "shares_count_change",
            "fun_count_change", "ratings_average_change",
            "score_total_change",
            "fun_change_percent", "popular_change_percent",
            "credit_change_percent", "score_change_percent"
        )
