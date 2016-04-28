# coding=utf-8
from rest_framework import serializers
from alatting_website.models import User, Poster, Person, PosterLike, PosterSubscribe

class AccountPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        exclude = ('user', )

class AccountPosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poster
	
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
	poster_creator = AccountPosterSerializer(many=True, read_only=True)
	poster_likes_creator = AccountPosterLikeSerializer(many=True, read_only=True)
	poster_subscriptions_follower = AccountPosterSubscribeSerializer(many=True, read_only=True)


	class Meta:
		model = User
		fields = ('id', 'username', 'first_name', 'last_name', 'email', 'person', 'poster_creator', 'poster_likes_creator', 'poster_subscriptions_follower')
		