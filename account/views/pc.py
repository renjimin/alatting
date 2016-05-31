# coding=utf-8

from django.contrib.auth import views as auth_views
from django.core.urlresolvers import reverse
from django.shortcuts import redirect


def alatting_logout(request):
    auth_views.logout(request)
    return redirect(reverse('website:index'))