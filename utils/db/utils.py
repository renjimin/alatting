__author__ = 'tianhuyang'
import uuid
from django.db.models import F


class Utils:
    @classmethod
    def increase_counts(cls, queryset, field_counts):
        data = {key: F(key) + value for key, value in field_counts.items()}
        return queryset.update(**data)


def generate_uuid():
    return uuid.uuid4().hex