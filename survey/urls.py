# coding=utf-8

from django.conf.urls import url
from survey.views import IndexView, StartView, QuestionnaireView

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^start/(?P<user_id>\d+)/(?P<questionnaire_id>\d+)/$', StartView.as_view(), name='start'),
    url(r'^questionnaire/', QuestionnaireView.as_view(), name='questionnaire'),
]