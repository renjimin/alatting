# coding: utf-8
from django.conf import settings
from django.contrib.auth.models import User


class DisableCSRF(object):
    def process_request(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)
        if settings.IS_FRONTEND_DEV:
            setattr(request, 'user',
                    User.objects.filter(username='admin').first())
