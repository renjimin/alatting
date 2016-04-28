# coding=utf-8

from django.conf.urls import url
from poster.view.poster import PosterListView, PosterSimpleInfoListView
from poster.view.resource import (
    CategoryListView, CategoryKeywordListView, TemplateListView,
    UploadFileView)


urlpatterns = [
    url(r'^categorys$', CategoryListView.as_view(), name='categorys'),

    url(r'^category/(?P<pk>\d+)/keywords$',
        CategoryKeywordListView.as_view(),
        name='category_keywords'),

    url(r'^templates$', TemplateListView.as_view(), name='templates'),

    url(r'^posters/simple$', PosterSimpleInfoListView.as_view(),
        name='posters_simple'),

    url(r'^posters$', PosterListView.as_view(), name='posters'),
]


urlpatterns += [
    url(r'^upload/(?P<page_key>\w+)$',
        UploadFileView.as_view(), name='upload')
]
