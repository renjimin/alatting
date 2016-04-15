# coding=utf-8

from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from alatting_website.models import Comment, Person, User


class PersonSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user_id')

    class Meta:
        model = Person
        exclude = ('user', )


class UserSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'person')


class HumanDateTimeField(serializers.DateTimeField):

    def to_representation(self, value):
        return naturaltime(value)\
            .replace('weeks', u'周')\
            .replace('week', u'周')\
            .replace('months', u'月')\
            .replace('month', u'月')


class PosterRelatedIdentityField(serializers.HyperlinkedIdentityField):

    def get_url(self, obj, view_name, request, format):
        url_kwargs = {
            'poster_id': obj.poster_id,
            'pk': obj.pk
        }
        return self.reverse(view_name, kwargs=url_kwargs,
                            request=request, format=format)


class CommentSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    created_at = HumanDateTimeField(read_only=True)
    poster_id = serializers.IntegerField(read_only=True)
    url = PosterRelatedIdentityField(view_name='api:comment-detail')

    class Meta:
        model = Comment
        exclude = ('parent', 'poster')
