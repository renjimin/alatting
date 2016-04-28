# coding=utf-8
from rest_framework import serializers
from alatting_website.models import User, Person
from .models import UserFriends

class AccountPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        exclude = ('user', )

class AccountProfileSerializer(serializers.ModelSerializer):
	person = AccountPersonSerializer(read_only=True)

	class Meta:
		model = User
		fields = ('id', 'username', 'first_name', 'last_name', 'email', 'person')
		
class AccountFriendsListSerializer(serializers.ModelSerializer):
	user2 = AccountProfileSerializer(read_only=True)

	class Meta:
		model = UserFriends
		fields = ('user1', 'user2')