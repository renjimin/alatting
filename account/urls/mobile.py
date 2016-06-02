# coding=utf-8

from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from account.views.mobile import (
    LoginView, RegisterView, ResetPasswordView, ProfileView,
    PosterServiceIndexView)
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


# 海报服务者url
urlpatterns += [
    url(r'^posters/(?P<poster_pk>[\d]+)/service.html$',
        login_required(PosterServiceIndexView.as_view()),
        name='posters_service'),
]
