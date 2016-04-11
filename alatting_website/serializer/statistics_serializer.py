# coding=utf-8

from rest_framework import serializers
from alatting_website.models import (
    PosterStatistics, Rating, PosterLike, PosterFun
)


class PosterStatisticsSerializer(serializers.ModelSerializer):
    poster_id = serializers.IntegerField(read_only=True)
    ratings_average = serializers.DecimalField(2, 1, read_only=True)
    five_percent = serializers.IntegerField(read_only=True)
    four_percent = serializers.IntegerField(read_only=True)
    three_percent = serializers.IntegerField(read_only=True)
    two_percent = serializers.IntegerField(read_only=True)
    one_percent = serializers.IntegerField(read_only=True)

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

