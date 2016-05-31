# coding=utf-8

from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from account.views.mobile import (
    LoginView, RegisterView, ResetPasswordView, ProfileView
)


urlpatterns = [
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),

    url(r'^register$', RegisterView.as_view(), name='register'),
    url(r'^reset_password', ResetPasswordView.as_view(),
        name='reset_password'),
    url(r'^profile.html$',
        login_required(ProfileView.as_view()), name='profile'),
]
