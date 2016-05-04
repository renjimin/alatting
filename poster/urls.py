# coding=utf-8

from django.conf.urls import url
from poster.view.create import (KeywordsView, CreateFormView,
                                SelectTemplateView)
from poster.view.edit import PosterEditView


urlpatterns = [
    url(r'^keywords/$', KeywordsView.as_view(),
        name='keywords'),

    url(r'^create-form/$', CreateFormView.as_view(),
        name='create_form'),

    url(r'^select-template/$', SelectTemplateView.as_view(),
        name='select_template'),
]

# 编辑海报url
urlpatterns += [
    url(r'^(?P<pk>[\d]+)/edit/$', PosterEditView.as_view(),
        name='edit'),
]


# urlpatterns = [
#     url(r'^categorys$', CategoryListView.as_view(), name='categorys'),
#
#     url(r'^category/(?P<pk>\d+)/keywords$',
#         CategoryKeywordListView.as_view(),
#         name='category_keywords'),
#
#     url(r'^templates$', TemplateListView.as_view(), name='templates'),
#
#     url(r'^posters/simple$',
#         PosterSimpleInfoListView.as_view(),
#         name='posters_simple'),
#
#     url(r'^posters$', PosterListView.as_view(), name='posters'),
#
#     url(r'^posters/(?P<pk>[\d]+)$',
#         PosterDetailView.as_view(), name='poster_detail'),
#
#     url(r'^posterpages$', PosterPageListView.as_view(), name='posterpages'),
#
# ]
#
# urlpatterns += [
#     url(r'^upload/(?P<page_key>\w+)$',
#         UploadFileView.as_view(), name='upload')
# ]
