# coding=utf-8

import uuid
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.core.urlresolvers import reverse, reverse_lazy
from django.http import JsonResponse, QueryDict
from django.shortcuts import get_object_or_404, render_to_response, render
from django.views.generic import FormView

from account.form.forms import RegisterForm, pwd_validate, \
    ResetPasswordForm, LoginForm
from account.views.base import ProfileBaseView, AccountPosterBaseView
from utils.userinput import what
from alatting_website.models import (
    Category
)
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from account.models import LoginMessage, Person


def not_found(request):
    return JsonResponse({'detail': u'Page Not Found'}, status=404)


class ProfileView(ProfileBaseView):
    template_name = 'account/mobile/profile.html'


class RegisterView(FormView):
    """
    注册接口
    """
    template_name = "account/mobile/register.html"
    form_class = RegisterForm
    success_url = reverse_lazy('account:login')

    def response_error_msg(self, form, error):
        form.initial = form.cleaned_data
        return render(
            self.request, self.template_name,
            {'form': form, 'error': error}
        )

    def form_valid(self, form):
        data = form.cleaned_data
        username = data['username']
        message = data['message']
        password = data['password1']
        password2 = data['password2']
        user_type = data['user_type']
        main_category_id = data['main_category_id']
        sub_category_ids = data['sub_category_ids']
        input_category = data['input_category']
        if not pwd_validate(password, password2):
            form.initial = data
            return self.response_error_msg(form, u'两次密码输入不一致')

        input_type = what(username)
        if not input_type:
            form.initial = data
            return self.response_error_msg(form, u'请用邮箱注册')
            # return self.response_error_msg(form, u'请用邮箱或者手机号注册')

        try:
            msg = LoginMessage.objects.get(username=username)
        except LoginMessage.DoesNotExist:
            form.initial = data
            return self.response_error_msg(form, u'未发送过此验证码')

        offset_naive_dt = msg.created_at.replace(tzinfo=None)
        # 校验时间是否已过期
        if datetime.now() - offset_naive_dt > timedelta(seconds=settings.EXPIRE_TIME):
            return self.response_error_msg(form, u'验证码已过期')

        if msg.message != message:  # 校验验证码是否正确
            return self.response_error_msg(form, u'验证码不正确')

        username_temp = '{}_{}'.format(
            username, str(uuid.uuid1()).split('-')[0]
        )
        if input_type == 'email':
            user = User.objects.all().filter(email=username)
            if user.exists():
                return self.response_error_msg(form, u'用户名已存在')
            user = User.objects.create_user(username_temp, username, password)
        else:
            user = Person.objects.all().filter(phonenumber=username)
            if user.exists():
                return self.response_error_msg(form, u'用户名已存在')
            user = User.objects.create_user(username_temp, password=password)
        user.save()

        person = Person.objects.create(
            phonenumber=username, user=user,
            user_type=user_type
        )
        person.save()
        person.create_user_categorys(
            main_category_id, sub_category_ids,
            input_category
        )
        self.login_and_redirect_to(
            user_type, user.username, password,
            main_category_id, sub_category_ids
        )
        return super(RegisterView, self).form_valid(form)

    def login_and_redirect_to(self, user_type, username, password,
                              main_id, sub_id='',
                              input_category=''):
        user = authenticate(username=username, password=password)
        if user is None:
            return
        login(self.request, user)
        self.success_url = reverse('account:profile')
        if user_type == Person.USER_TYPE_SERVER:
            main_cate = get_object_or_404(Category, pk=main_id)
            if sub_id:
                sub_cate = get_object_or_404(Category, pk=sub_id)
            else:
                input_category = input_category.strip()
                sub_cate = Category.objects.filter(
                    name=input_category
                ).first()

            if sub_cate:
                self.success_url = reverse('posters:keywords')
                q = QueryDict(mutable=True)
                kw = {
                    'main_category_id': main_cate.id,
                    'sub_category_id': sub_cate.id,
                    'cate': main_cate.name,
                    'subcate': sub_cate.name
                }
                q.update(kw)
                self.success_url += '?%s' % q.urlencode()
        else:
            self.success_url = reverse('website:mobile_poster_index')
            self.success_url += '?q=%s' % sub_id
        return self.success_url


class ResetPasswordView(FormView):
    """重置密码"""
    template_name = "account/mobile/forget-pwd.html"
    form_class = ResetPasswordForm
    success_url = settings.LOGIN_URL

    def form_valid(self, form):
        data = form.cleaned_data
        username = data['username']
        password = data['password1']
        password2 = data['password2']
        if not pwd_validate(password, password2):
            return render_to_response(self.template_name,
                                      {'error': "两次密码输入不一致"})
        else:
            input_type = what(username)
            if input_type == "phonenumber":  # 手机号重置密码
                person = get_object_or_404(Person, phonenumber=username)
                user = person.user
            else:  # 邮箱重置密码
                if input_type == "email":
                    user = get_object_or_404(User, email=username)
                else:
                    user = get_object_or_404(User, username=username)
            user.set_password(password)
            user.save()
            return super(ResetPasswordView, self).form_valid(form)


class LoginView(FormView):
    """用户登陆，支持邮箱登陆、手机号登陆"""
    template_name = "account/mobile/login.html"
    form_class = LoginForm
    success_url = settings.LOGIN_REDIRECT_URL

    def form_valid(self, form):
        data = form.cleaned_data
        username = data['username']
        password = data['password']

        input_type = what(username)
        if input_type == "phonenumber":
            try:
                person = Person.objects.get(phonenumber=username)
                username = person.user.username
            except Person.DoesNotExist:
                return render_to_response(self.template_name,
                                          {'error': "请输入正确的邮箱"})
                # return render_to_response('account/login.html', {'error': "请输入正确的邮箱或手机号"})
        elif input_type == "email":
            try:
                user = User.objects.get(email=username)
                username = user.username
            except User.DoesNotExist:
                return render_to_response(self.template_name,
                                          {'error': "请输入正确的邮箱"})
                # return render_to_response('account/login.html', {'error': "请输入正确的邮箱或手机号"})
        else:
            return render_to_response(self.template_name,
                                      {'error': "请使用邮箱登陆"})
            # return render_to_response('account/login.html', {'error': "请使用邮箱或者手机号登陆"})

        user = authenticate(username=username, password=password)
        if user is not None:
            request = super(LoginView, self).get_context_data().get('view').request
            login(request, user)
            next_url = self.request.GET.get('next', None)
            if next_url:
                self.success_url = next_url
            return super(LoginView, self).form_valid(form)
        else:
            return render_to_response(self.template_name,
                                      {'error': "用户名或密码错误"})


class PosterIndexView(AccountPosterBaseView):
    template_name = 'account/mobile/poster.html'


class PosterServerIndexView(AccountPosterBaseView):
    template_name = 'account/mobile/server.html'


class PosterConsumerIndexView(AccountPosterBaseView):
    template_name = 'account/mobile/consumer.html'


class PosterStatisticsIndexView(AccountPosterBaseView):
    template_name = 'account/mobile/statistics.html'
