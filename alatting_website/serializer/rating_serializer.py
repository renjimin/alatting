__author__ = 'tianhuyang'
from rest_framework import serializers
from alatting_website.models import Poster, Rating


class RatingSerializer(serializers.ModelSerializer):
    creator_id = serializers.IntegerField(read_only=True)
    poster_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Rating
        exclude = ('creator', 'poster')

    def get_unique_together_validators(self):
        return []
