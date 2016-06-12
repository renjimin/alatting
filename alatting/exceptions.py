# coding=utf-8

from django.utils.translation import ugettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class BargainsNoConsumerError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('报价失败，没有提供需求者信息!')


class ChatsNoConsumerError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('留言失败，没有提供接收者信息!')


class PosterPageNotFoundError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('没有找到页面信息!')
