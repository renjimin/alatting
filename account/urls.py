# coding=utf-8

from django.conf.urls import url
from account.views import (LoginView, MessageView, CheckMessageView,
                           RegisterView)


urlpatterns = [
    url(r'^login$', LoginView.as_view(), name='login'),
    url(r'^register$', RegisterView.as_view(), name='register'),
    url(r'^send_message$', MessageView.as_view(), name='send_message'),
    url(r'^auth_message$', CheckMessageView.as_view(), name='auth_message'),
]
