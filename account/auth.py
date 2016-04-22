# coding=utf-8
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

from rest_framework_jwt.authentication import (
    JSONWebTokenAuthentication as _JSONWebTokenAuthentication
)


class WebsiteBackend(ModelBackend):
    def authenticate(self, username=None, password=None, **kwargs):
        if username is None:
            return None
        user = get_user_model().objects.filter(**kwargs).first()
        if user and user.check_password(password):
            return user
        else:
            return None


class JSONWebTokenAuthentication(_JSONWebTokenAuthentication):

    def get_jwt_value(self, request):
        # DEBUG 模式时可在 URL 中使用 token 参数
        if settings.DEBUG:
            from rest_framework_jwt.settings import api_settings
            auth_header_prefix = api_settings.JWT_AUTH_HEADER_PREFIX
            token = getattr(request, 'query_params', request.GET).get('token')
            if token:
                request.META.setdefault(
                    'HTTP_AUTHORIZATION', '%s %s' % (auth_header_prefix, token)
                )
        return super(JSONWebTokenAuthentication, self).get_jwt_value(request)
