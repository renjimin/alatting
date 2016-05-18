# coding=utf-8

from django.conf.urls import url
from survey.views import IndexView, QuestionnaireView, \
QuestionnaireDoneView

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^(?P<user_id>\d+)/(?P<questionnaire_id>\d+)/$', 
    	QuestionnaireView.as_view(), name='questionnaire'),
    url(r'^questionnairedone/', QuestionnaireDoneView.as_view(), 
    	name='questionnairedone'),
]