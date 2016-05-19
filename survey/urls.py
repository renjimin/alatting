# coding=utf-8

from django.conf.urls import url
from survey.views import IndexView, StartView, QuestionnaireView, \
QuestionnaireDoneView


urlpatterns = [
	url(r'^$', IndexView.as_view(), name='index'),
	url(r'^start/(?P<user_id>\d+)/(?P<questionnaire_id>\d+)/$', 
		StartView.as_view(permanent=False), name='start'),
	url(r'^questionnaire/(?P<runid>\d+)/$', QuestionnaireView.as_view(), 
		name='questionnaire'),
	url(r'^questionnaire/(?P<runid>\d+)/(?P<qs_sortid>\d+)$', 
		QuestionnaireView.as_view(), name='questionset'),
	url(r'^questionnairedone/', QuestionnaireDoneView.as_view(), 
		name='questionnairedone'),
]