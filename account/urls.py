# coding=utf-8

from django.conf.urls import url
from account.views import LoginView


urlpatterns = [
    url(r'^login$', LoginView.as_view(), name='login'),
]
