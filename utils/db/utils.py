__author__ = 'tianhuyang'
import uuid
from django.db.models import F


class Utils:
    @classmethod
    def increase_counts(cls, queryset, field_counts):
        data = {key: F(key) + value for key, value in field_counts.items()}
        return queryset.update(**data)

    @classmethod
    def get_url(cls, request, path):
        url = request.scheme + '://' + request.get_host + path
        return url

    @classmethod
    def get_current_url(cls, request):
        url = cls.get_url(request, request.path)
        return url


def generate_uuid():
    return uuid.uuid4().hex