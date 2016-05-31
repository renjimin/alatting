# coding=utf-8

from django.conf.urls import url
from account.views.api import ProfileView, FriendsView, \
    MessageView, CheckMessageView, PostersServerListView, \
    PostersConsumerListView, FilesListView


urlpatterns = [
    url(r'^send_message$', MessageView.as_view(), name='send_message'),
    url(r'^auth_message$', CheckMessageView.as_view(), name='auth_message'),

    url(r'^posters/server$',
        PostersServerListView.as_view(), name='posters_server'),

    url(r'^posters/consumer$',
        PostersConsumerListView.as_view(), name='posters_consumer'),

    url(r'^profile$', ProfileView.as_view(), name='profile'),
    url(r'^friends$', FriendsView.as_view(), name='friends'),

    url(r'^files$', FilesListView.as_view(), name='files'),
]
