# coding=utf-8

from django.conf.urls import url
from account.views import LoginView
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import verify_jwt_token


urlpatterns = [
    url(r'^login$', obtain_jwt_token),
    url(r'^token-verify$', verify_jwt_token)
]
