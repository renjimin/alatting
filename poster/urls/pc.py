# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from poster.view.pc.main import PosterIndexView, PosterShowFrameView, \
    PosterEditView


# PC端路由
urlpatterns = [
    url(r'^index.html$', PosterIndexView.as_view(), name='index'),

    url(r'^(?P<pk>[\d]+)/$', PosterShowFrameView.as_view(), name='show'),
]


# 编辑海报
urlpatterns += [
    url(r'^(?P<poster_pk>[\d]+)/edit/(?P<pk>[\d]+)$',
        login_required(PosterEditView.as_view()),
        name='edit'),
]