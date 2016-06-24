from django.conf.urls import url
from survey.view.api import (
    QuestionCreateAPIView, ChoiceCreateAPIView,
    ChoiceInputCreateAPIView, QuestionDeleteAPIView,
    QuestionnaireDetailAPIView)

#创建问题
urlpatterns = [
	url(r'^create$', QuestionCreateAPIView.as_view()),
	url(r'^create_choice/(?P<q_id>\d+)/$', ChoiceCreateAPIView.as_view()),
	url(r'^create_choice_input/(?P<q_id>\d+)/$', ChoiceInputCreateAPIView.as_view()),
	url(r'^delete/(?P<q_id>\d+)/$', QuestionDeleteAPIView.as_view()),
	url(r'^show/(?P<poster_id>\d+)/(?P<role>\w+)/$', QuestionnaireDetailAPIView.as_view()),
]
