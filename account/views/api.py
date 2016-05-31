# coding=utf-8
from django.contrib.auth.models import User

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, \
    ListAPIView, get_object_or_404
from rest_framework.views import APIView
from account.models import Person, UserFriends
from account.serializers import AccountProfileSerializer, \
    AccountFriendsListSerializer
from alatting_website.model.poster import Poster
from poster.serializer.poster import PosterSerializer


class PostersListView(ListCreateAPIView):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterSerializer

    def get_queryset(self):
        qs = super(PostersListView, self).get_queryset()
        return qs.filter(creator=self.request.user).order_by('-created_at')


class ProfileView(RetrieveUpdateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = AccountProfileSerializer

    def get_object(self):
        return get_object_or_404(User, pk=self.request.user.id)


class FriendsView(ListAPIView):
    model = UserFriends
    queryset = UserFriends.objects.all()
    serializer_class = AccountFriendsListSerializer

    def get_queryset(self):
        queryset = super(FriendsView, self).get_queryset()
        user = self.request.user
        if user.is_authenticated():
            queryset = queryset.filter(user1=user)
        else:
            queryset = queryset.none()
        return queryset