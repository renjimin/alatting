# coding=utf-8
from django.conf.urls import url
from poster.apiview.poster import PosterPageListView, CheckPosterUniqueNameView, \
                        PosterPublishView, SystemImageListView, SystemBackgroundListView, PosterSaveView, \
    PosterStatusView, PosterPageDetailView, SystemMusicListView
from poster.apiview.resource import CategoryKeywordListView, \
    CategoryKeywordDetailView, UploadFileView, TemplateDetailView, \
    TemplateListView


urlpatterns = [
    url(r'^category/(?P<pk>\d+)/keywords$', CategoryKeywordListView.as_view(),
        name='category_keywords'),

    url(r'^keywords/(?P<pk>\d+)/$', CategoryKeywordDetailView.as_view(),
        name='category_keywords_detail'),

    url(r'^posterpages$', PosterPageListView.as_view(), name='poster_pages'),

    url(r'^posterpages/(?P<pk>\d+)$',
        PosterPageDetailView.as_view(), name='posterpage_detail'),

    url(r'^check/unique/$', CheckPosterUniqueNameView.as_view(),
        name='check_unique'),

    url(r'^upload/(?P<page_key>\w+)$',
        UploadFileView.as_view(), name='upload'),

    url(r'^publish/(?P<pk>\d+)/$',
        PosterPublishView.as_view(), name='poster_publish'),

    url(r'^save/(?P<pk>\d+)/$',
        PosterSaveView.as_view(), name='poster_save'),

    url(r'^status/(?P<pk>\d+)/$',
        PosterStatusView.as_view(), name='poster_status'),

    url(r'^system/images$',
        SystemImageListView.as_view(), name='system_images'),

    url(r'^system/music$',
        SystemMusicListView.as_view(), name='system_music'),

    url(r'^system/background$',
        SystemBackgroundListView.as_view(), name='system_background'),

    url(r'templates$',
        TemplateListView.as_view(), name='templates'),

    url(r'templates/(?P<pk>\d+)$',
        TemplateDetailView.as_view(), name='template_detail'),
]
