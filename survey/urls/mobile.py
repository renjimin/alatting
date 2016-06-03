# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from survey.view.mobile import (
	IndexView, StartView, QuestionnaireView,
	QuestionnaireBlankView, AnswerDetailView,
	QuestionCreateView, ChoiceCreateView
)

urlpatterns = [
	url(r'^$', IndexView.as_view(), name='index'),
#start/poster_id/?role=creator or start/poster_id/?role=consumer
	url(r'^start/(?P<poster_id>\d+)/$', 
		login_required(StartView.as_view(permanent=False)), name='start'),
	url(r'^questionnaire/(?P<runid>\d+)/$', QuestionnaireView.as_view(), 
		name='questionnaire'),
	url(r'^questionnaire/(?P<runid>\d+)/(?P<qs_sortid>\d+)$', 
		QuestionnaireView.as_view(), name='questionset'),
#questionnaireblank/poster_id/?role=creator or questionnaireblank/poster_id/?role=consumer
	url(r'^questionnaireblank/(?P<poster_id>\d+)/', QuestionnaireBlankView.as_view(), 
		name='questionnaireblank'),
#answer/poster_id/?role=creator or answer/poster_id/?role=consumer
	url(r'^answer/(?P<poster_id>\d+)/$', AnswerDetailView.as_view(), 
		name='answer'),
]


#创建问题
urlpatterns += [
	url(r'^create/$', QuestionCreateView.as_view(), name='create'),
	url(r'^create_choice/(?P<q_id>\d+)/$', ChoiceCreateView.as_view(), name='create_choice'),
]