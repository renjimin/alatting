# coding=utf-8

from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from account.views.mobile import (
    LoginView, RegisterView, ResetPasswordView, ProfileView,
    PosterServerIndexView, PosterConsumerIndexView, PosterIndexView, PosterStatisticsIndexView)
from account.views.pc import alatting_logout


urlpatterns = [
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', alatting_logout, name='logout'),

    url(r'^register$', RegisterView.as_view(), name='register'),
    url(r'^reset_password', ResetPasswordView.as_view(),
        name='reset_password'),
    url(r'^profile.html$',
        login_required(ProfileView.as_view()), name='profile'),


]


# 海报服务
urlpatterns += [
    url(r'^posters/(?P<poster_pk>[\d]+).html$',
        login_required(PosterIndexView.as_view()),
        name='posters_index'),

    url(r'^posters/(?P<poster_pk>[\d]+)/server.html$',
        login_required(PosterServerIndexView.as_view()),
        name='posters_server'),

    url(r'^posters/(?P<poster_pk>[\d]+)/consumer.html$',
        login_required(PosterConsumerIndexView.as_view()),
        name='posters_consumer'),

    url(r'^posters/(?P<poster_pk>[\d]+)/statistics.html$',
        login_required(PosterStatisticsIndexView.as_view()),
        name='posters_statistics'),
]
