# coding=utf-8
from django.conf.urls import url
from poster.view.api import (
    PosterPageListView, CheckPosterUniqueNameView,
    PosterPublishView, SystemImageListView, SystemBackgroundListView,
    PosterSaveView, PosterStatusView, PosterPageDetailView,
    SystemMusicListView, PosterDetailView,
    CategoryKeywordListView, CategoryKeywordDetailView,
    UploadFileView, TemplateDetailView, TemplateListView,
    CategoryListView, SurveyConsumerAnswersView,
    SurveyConsumerAnsView, PosterListView, ServiceBargainListView,
    ServiceBargainDetailView, ChatListView, StatisticsDataView,
    ServiceCommentListView, UploadBase64ImageFileView, QAListView)


urlpatterns = [
    url(r'^posters$', PosterListView.as_view(),
        name='posters'),

    url(r'^posters/(?P<pk>\d+)$', PosterDetailView.as_view(),
        name='poster_detail'),

    url(r'^categorys$', CategoryListView.as_view(),
        name='categorys'),

    url(r'^category/(?P<pk>\d+)/keywords$', CategoryKeywordListView.as_view(),
        name='category_keywords'),

    url(r'^keywords/(?P<pk>\d+)/$', CategoryKeywordDetailView.as_view(),
        name='category_keywords_detail'),

    url(r'^posterpages$', PosterPageListView.as_view(), name='poster_pages'),

    url(r'^posterpages/(?P<pk>\d+)$',
        PosterPageDetailView.as_view(), name='posterpage_detail'),

    url(r'^check/unique/$', CheckPosterUniqueNameView.as_view(),
        name='check_unique'),

    url(r'^upload/b64image$',
        UploadBase64ImageFileView.as_view(), name='upload_b64_image'),

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

    # get all consumer answers sent to the poster creator
    url(r'^(?P<pk>\d+)/consumer/answers$',
        SurveyConsumerAnswersView.as_view(), name='consumer_answers'),
    # get current consumer answer sent to the poster creator
    url(r'^(?P<pk>\d+)/consumer/ans$',
        SurveyConsumerAnsView.as_view(), name='consumer_ans'),

    url(r'^(?P<poster_pk>\d+)/bargains$',
        ServiceBargainListView.as_view(), name='poster_bargains'),

    url(r'^(?P<poster_pk>\d+)/bargains/(?P<pk>\d+)$',
        ServiceBargainDetailView.as_view(), name='poster_bargains_detail'),


    url(r'^(?P<pk>\d+)/chats$',
        ChatListView.as_view(), name='poster_chats'),

    url(r'^(?P<pk>\d+)/statistics$',
        StatisticsDataView.as_view(), name='poster_statistics'),

    url(r'^(?P<pk>\d+)/servicecomments$',
        ServiceCommentListView.as_view(), name='poster_service_comments'),

    url(r'^qa$',
        QAListView.as_view(), name='qa_list'),
]
