# coding=utf-8

from django.conf.urls import url
from poster.views import (
    CategoryListView, PosterSimpleInfoListView,
    CategoryKeywordListView
)


urlpatterns = [
    url(r'^categorys$', CategoryListView.as_view(), name='categorys'),

    url(r'^category/(?P<pk>\d+)/keywords$',
        CategoryKeywordListView.as_view(),
        name='category_keywords'),

    url(r'^posters/simple$',
        PosterSimpleInfoListView.as_view(),
        name='posters_simple'),


]
