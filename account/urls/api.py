# coding=utf-8

from django.conf.urls import url
from account.views.api import ProfileView, FriendsView, \
    MessageView, CheckMessageView, PostersServerListView, \
    PostersConsumerListView, ImageDetailView, \
    AudioDetailView, VideoDetailView, ImageListView, VideoListView, \
    AudioListView, PosterFavoriteListView


urlpatterns = [
    url(r'^send_message$', MessageView.as_view(), name='send_message'),
    url(r'^auth_message$', CheckMessageView.as_view(), name='auth_message'),

    url(r'^profile$', ProfileView.as_view(), name='profile'),
    url(r'^friends$', FriendsView.as_view(), name='friends'),

    url(r'^images$', ImageListView.as_view(), name='images'),
    url(r'^images/(?P<pk>[\d]+)$',
        ImageDetailView.as_view(), name='image_detail'),

    url(r'^videos$', VideoListView.as_view(), name='videos'),
    url(r'^videos/(?P<pk>[\d]+)$',
        VideoDetailView.as_view(), name='video_detail'),

    url(r'^audios$', AudioListView.as_view(), name='audios'),
    url(r'^audios/(?P<pk>[\d]+)$',
        AudioDetailView.as_view(), name='audio_detail'),
]


# 与海报有关的接口
urlpatterns += [
    url(r'^posters/server$',
        PostersServerListView.as_view(), name='posters_server'),

    url(r'^posters/consumer$',
        PostersConsumerListView.as_view(), name='posters_consumer'),

    url(r'^posters/favorites$',
        PosterFavoriteListView.as_view(), name='posters_favorites'),
]
