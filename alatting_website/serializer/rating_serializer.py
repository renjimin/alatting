__author__ = 'tianhuyang'
from rest_framework import serializers
from alatting_website.models import PosterRating, Rating


class PosterRatingSerializer(serializers.ModelSerializer):
    poster_id = serializers.IntegerField(read_only=True)
    ratings_average = serializers.DecimalField(2, 1, read_only=True)
    five_percent = serializers.IntegerField(read_only=True)
    four_percent = serializers.IntegerField(read_only=True)
    three_percent = serializers.IntegerField(read_only=True)
    two_percent = serializers.IntegerField(read_only=True)
    one_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = PosterRating
        exclude = ('poster', )


class RatingSerializer(serializers.ModelSerializer):
    creator_id = serializers.IntegerField(read_only=True)
    poster_id = serializers.IntegerField(read_only=True)
    poster_rating = PosterRatingSerializer(read_only=True)

    class Meta:
        model = Rating
        exclude = ('creator', 'poster')

    def get_unique_together_validators(self):
        return []
