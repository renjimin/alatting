# coding=utf-8
from django.conf.urls import url
from poster.apiview.poster import PosterPageListView
from poster.apiview.resource import CategoryKeywordListView, \
    CategoryKeywordDetailView


urlpatterns = [
    url(r'^category/(?P<pk>\d+)/keywords$', CategoryKeywordListView.as_view(),
        name='category_keywords'),

    url(r'^keywords/(?P<pk>\d+)/$', CategoryKeywordDetailView.as_view(),
        name='category_keywords_detail'),

    url(r'^posterpages$', PosterPageListView.as_view(), name='posterpages'),

]
