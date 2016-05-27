# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from survey.views import IndexView, StartView, QuestionnaireView, \
QuestionnaireDoneView, QuestionnaireBlankView, AnswerDetailView

urlpatterns = [
	url(r'^$', IndexView.as_view(), name='index'),
#start/poster_id/?role=creator or start/poster_id/?role=consumer
	url(r'^start/(?P<poster_id>\d+)/$', 
		login_required(StartView.as_view(permanent=False)), name='start'),
	url(r'^questionnaire/(?P<runid>\d+)/$', QuestionnaireView.as_view(), 
		name='questionnaire'),
	url(r'^questionnaire/(?P<runid>\d+)/(?P<qs_sortid>\d+)$', 
		QuestionnaireView.as_view(), name='questionset'),
	url(r'^questionnairedone/', QuestionnaireDoneView.as_view(), 
		name='questionnairedone'),
	url(r'^questionnaireblank/(?P<poster_id>\d+)/', QuestionnaireBlankView.as_view(), 
		name='questionnaireblank'),
#answer/poster_id/?role=creator or answer/poster_id/?role=consumer
	url(r'^answer/(?P<poster_id>\d+)/$', AnswerDetailView.as_view(), 
		name='answer'),
]