# coding=utf-8

from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from account.views import (LoginView, MessageView, CheckMessageView,
                           RegisterView, ResetPasswordView, ProfileView,
                           FriendsView)


urlpatterns = [
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),

    url(r'^register$', RegisterView.as_view(), name='register'),
    url(r'^send_message$', MessageView.as_view(), name='send_message'),
    url(r'^auth_message$', CheckMessageView.as_view(), name='auth_message'),
    url(r'^reset_password', ResetPasswordView.as_view(), name='reset_password'),
    url(r'^profile', login_required(ProfileView.as_view()), name='profile'),
    url(r'^friends', FriendsView.as_view(), name='friends'),
]
