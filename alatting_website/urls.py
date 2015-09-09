__author__ = 'tianhuyang'
from django.conf.urls import include, url
from alatting_website.views import PosterView


urlpatterns = [
    url(r'^poster/(?P<pk>\d+)', PosterView.as_view(), name='poster'),
]
