# coding=utf-8
from rest_framework import serializers
from alatting_website.models import User, Poster, Person, PosterLike, \
									PosterSubscribe
from poster.serializer.poster import  PosterSimpleInfoSerializer
from .models import UserFriends

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

	poster_creator = PosterSimpleInfoSerializer(many=True, read_only=True)
	poster_count = serializers.IntegerField(source='poster_creator.count', read_only=True)

	poster_likes_creator = AccountPosterLikeSerializer(many=True, read_only=True)
	poster_likes_count = serializers.IntegerField(source='poster_likes_creator.count', read_only=True)

	poster_subscriptions_follower = AccountPosterSubscribeSerializer(many=True, read_only=True)
	poster_subscriptions_count = serializers.IntegerField(source='poster_subscriptions_follower.count', read_only=True)

	class Meta:
		model = User
		fields = ('id', 'username', 'first_name', 'last_name', 'email', 'person', 'poster_count', 'poster_creator', 
			      'poster_likes_count', 'poster_likes_creator', 'poster_subscriptions_count', 'poster_subscriptions_follower')
		
class AccountFriendsListSerializer(serializers.ModelSerializer):
	user2 = AccountProfileSerializer(read_only=True)

	class Meta:
		model = UserFriends
		fields = ('user1', 'user2')