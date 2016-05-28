# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from service.views import ServiceIndexListView


urlpatterns = [
    url(r'^index.html$', ServiceIndexListView.as_view(), name='index'),
]
