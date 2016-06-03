#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from account.views.pc import alatting_logout, LoginView, ProfileView, \
    PosterServerIndexView, PosterConsumerIndexView, PosterIndexView

__author__ = 'lyhapple'


urlpatterns = [
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', alatting_logout, name='logout'),

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
]
