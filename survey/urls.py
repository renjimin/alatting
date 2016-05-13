# coding=utf-8

from django.conf.urls import url
from survey.views import IndexView, SurveyDetailView

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^(?P<main_cat_pk>[\d]+)/(?P<sub_cat_pk>[\d]+)$',
        SurveyDetailView.as_view(), name='survey_detail'),
]