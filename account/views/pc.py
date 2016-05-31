# coding=utf-8

from django.contrib.auth import views as auth_views
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.generic import TemplateView


def alatting_logout(request):
    auth_views.logout(request)
    return redirect(reverse('website:index'))


class LoginView(TemplateView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('PC端登录页面，待实现...')
