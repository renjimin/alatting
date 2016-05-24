# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from survey.views import IndexView, StartView, QuestionnaireView, \
QuestionnaireDoneView


urlpatterns = [
	url(r'^$', IndexView.as_view(), name='index'),
	url(r'^start/(?P<poster_id>\d+)/$', 
		login_required(StartView.as_view(permanent=False)), name='start'),
	url(r'^questionnaire/(?P<runid>\d+)/$', QuestionnaireView.as_view(), 
		name='questionnaire'),
	url(r'^questionnaire/(?P<runid>\d+)/(?P<qs_sortid>\d+)$', 
		QuestionnaireView.as_view(), name='questionset'),
	url(r'^questionnairedone/', QuestionnaireDoneView.as_view(), 
		name='questionnairedone'),
]