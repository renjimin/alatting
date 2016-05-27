# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from account.views_api import AccountPostersListView


urlpatterns = [
    url(r'^posters$', AccountPostersListView.as_view(), name='posters'),
    # url(r'^profile$', login_required(ProfileView.as_view()), name='profile'),
]
