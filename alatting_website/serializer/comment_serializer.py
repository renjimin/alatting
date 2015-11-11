__author__ = 'tianhuyang'
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


class CommentSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        extra_kwargs = {
            'created_at': {
                'read_only': True
            }
        }