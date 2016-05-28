# coding=utf-8

from django.conf.urls import url
from poster.view.pc.main import PosterIndexView, PosterShowFrameView


# PC端路由
urlpatterns = [
    url(r'^index.html$', PosterIndexView.as_view(), name='index'),

    url(r'^(?P<pk>[\d]+)/$', PosterShowFrameView.as_view(), name='show'),
]