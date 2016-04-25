# coding=utf-8

from django.conf.urls import url
from poster.views import CategoryListView, PosterSimpleInfoListView


urlpatterns = [
    url(r'^categorys$', CategoryListView.as_view(), name='categorys'),

    url(r'^posters/simple$',
        PosterSimpleInfoListView.as_view(),
        name='posters'),

]
