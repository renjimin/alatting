# coding=utf-8
from django.contrib.auth import authenticate
from django.core import exceptions
from rest_framework import serializers
from alatting_website.models import User, PosterLike, \
    PosterSubscribe
from .models import UserFriends, Person


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})
    name_type = serializers.ChoiceField(['email', 'cellphone'])

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        name_type = attrs.get('name_type')

        if name_type != 'email':
            raise exceptions.ValidationError(u'暂不支持使用手机号码登录')

        qs = User.objects.filter(email=username.strip())
        if not qs.exists():
            raise exceptions.ValidationError(u'用户不存在')

        user = qs.first()
        if not user.check_password(password):
            raise exceptions.ValidationError(u'用户名或密码错误')

        if not user.is_active:
            raise exceptions.ValidationError(u'当前用户已被禁用')
        user = authenticate(
            username=user.username, password=password
        )
        attrs['user'] = user
        return attrs


class AccountPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        exclude = ('user', )


class AccountPosterLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosterLike
        fields = ('liked', 'poster')


class AccountPosterSubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosterSubscribe
        fields = ('subscribed', 'poster')


class AccountProfileSerializer(serializers.ModelSerializer):
    person = AccountPersonSerializer(read_only=True)

    poster_count = serializers.IntegerField(source='poster_creator.count',
                                            read_only=True)

    poster_likes_creator = AccountPosterLikeSerializer(many=True,
                                                       read_only=True)
    poster_likes_count = serializers.IntegerField(
        source='poster_likes_creator.count', read_only=True)

    poster_subscriptions_follower = AccountPosterSubscribeSerializer(
        many=True, read_only=True
    )
    poster_subscriptions_count = serializers.IntegerField(
        source='poster_subscriptions_follower.count', read_only=True
    )

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email', 'person',
            'poster_count', 'poster_likes_count', 'poster_likes_creator',
            'poster_subscriptions_count', 'poster_subscriptions_follower'
        )


class AccountFriendsListSerializer(serializers.ModelSerializer):
    user2 = AccountProfileSerializer(read_only=True)

    class Meta:
        model = UserFriends
        fields = ('user1', 'user2')


class AccountProfileSimpleSerializer(serializers.ModelSerializer):
    person = AccountPersonSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email', 'person'
        )
