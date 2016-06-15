from django.conf.urls import url
from survey.view.api import (
    QuestionCreateAPIView, ChoiceCreateAPIView)

#创建问题
urlpatterns = [
	url(r'^create$', QuestionCreateAPIView.as_view()),
	url(r'^create_choice/(?P<q_id>\d+)/$', ChoiceCreateAPIView.as_view()),
]
