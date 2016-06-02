# coding=utf-8

from django.contrib.auth import views as auth_views
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.generic import TemplateView
from account.views.base import ProfileBaseView, AccountPosterBaseView


def alatting_logout(request):
    auth_views.logout(request)
    return redirect(reverse('website:index'))


class LoginView(TemplateView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('PC端登录页面，待实现...')


class ProfileView(ProfileBaseView):
    template_name = 'account/pc/profile.html'


class PosterIndexView(AccountPosterBaseView):
    template_name = 'account/pc/poster.html'


class PosterServerIndexView(AccountPosterBaseView):
    template_name = 'account/pc/server.html'


class PosterConsumerIndexView(AccountPosterBaseView):
    template_name = 'account/pc/consumer.html'
