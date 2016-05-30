# coding=utf-8

from django.conf.urls import url
from account.views.api import PostersListView, ProfileView, FriendsView


urlpatterns = [
    url(r'^posters$', PostersListView.as_view(), name='posters'),
    url(r'^profile$', ProfileView.as_view(), name='profile'),
    url(r'^friends', FriendsView.as_view(), name='friends'),
]
