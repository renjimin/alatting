# coding=utf-8

from django.conf.urls import url
from poster.view.show_pc import PosterShowFrameView


# PC端路由
urlpatterns = [
    url(r'^(?P<pk>[\d]+)/$', PosterShowFrameView.as_view(), name='show'),
]
