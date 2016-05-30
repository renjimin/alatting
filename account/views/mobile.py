# coding=utf-8

import uuid
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render_to_response, render
from django.views.generic import FormView
from django.views.generic.detail import DetailView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from account.form.forms import RegisterForm, pwd_validate, \
    ResetPasswordForm, LoginForm
from utils.userinput import what
from utils.message import get_message
from alatting_website.models import (
    Poster, PosterLike, PosterSubscribe
    )
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from account.email import send_verify_email
from account.models import LoginMessage, UserFriends, Person
from account.serializers import AccountProfileSerializer, \
    AccountFriendsListSerializer


def not_found(request):
    return JsonResponse({'detail': u'Page Not Found'}, status=404)


class MessageView(APIView):
    """生成验证码"""
    permission_classes = ()


    def is_user_existed(self, raw_input):
        input_type = what(raw_input)
        if input_type == 'email':  # 邮箱
            user = User.objects.all().filter(email=raw_input)
            user_existed = "0" if len(user) == 0 else "1"
        elif input_type == 'phonenumber':  # 手机号
            person = Person.objects.all().filter(phonenumber=raw_input)
            user_existed = "0" if len(person) == 0 else "1"
        else:
            user_existed = "0"
        return [input_type, user_existed]


    def post(self, request, **kwargs):
        try:
            inputvalue = request.data['username']
            # 这个参数区别注册和重置密码需求，为0要求用户不存在，为1反之
            need_user_existed = request.data['user_existed']
        except KeyError:
            return Response({'detail': '参数错误'}, status=status.HTTP_400_BAD_REQUEST)

        input_type, is_user_existed = self.is_user_existed(inputvalue)
        if input_type == None:
            return Response({'detail': '参数错误,请用邮箱号注册'}, status=401)
            # return Response({'detail': '参数错误,请用邮箱或者手机号注册'}, status=401)
        if need_user_existed != is_user_existed:
            if is_user_existed == '1':
                data = {'detail': '用户已存在'}
            else:
                data = {'detail': '用户不存在'}
            return Response(data, status=403)

        message = get_message(inputvalue)
        try:
            msg = LoginMessage.objects.get(username=inputvalue)
            msg.message = message
            msg.save()
        except LoginMessage.DoesNotExist:
            LoginMessage.objects.create(message=message,
                                        username=inputvalue)
        data = {'username': inputvalue}
        if input_type == 'email':  # 邮箱
            send_verify_email(inputvalue, message)
        else:  # 手机号
            data['message'] = message
        return Response(data)


class CheckMessageView(APIView):
    """校验验证码"""
    permission_classes = ()

    def post(self, request, **kwargs):
        try:
            inputvalue = request.data['username']
            message = request.data['message']
        except KeyError:
            return Response({'detail': '参数错误'}, status=status.HTTP_400_BAD_REQUEST)
        input_type = what(inputvalue)
        if input_type == None:
            return Response({'detail': '参数错误'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            msg = get_object_or_404(LoginMessage, username=inputvalue)
            offset_naive_dt = msg.created_at.replace(tzinfo=None)
            # 校验时间是否已过期
            if datetime.now() - offset_naive_dt > timedelta(seconds=settings.EXPIRE_TIME):
                return Response(dict(detail="验证码已过期"),
                                status=status.HTTP_401_UNAUTHORIZED)
            if msg.message == message:  # 校验验证码是否正确
                return Response(dict(detail="验证成功"))
            else:
                return Response(dict(detail="验证码不正确"),
                                status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(DetailView):
    template_name = 'account/mobile/profile.html'
    model = User

    def get_object(self, queryset=None):
        user = self.request.user
        if user.is_authenticated():
            obj = self.request.user
            posters_created = []
            posters = Poster.objects.filter(creator=self.request.user)
            for poster_created in posters:
                posters_created.append(poster_created)
            obj.posters_created = posters_created
            obj.poster_count = Poster.objects.filter(
                creator=self.request.user
            ).count()
            obj.poster_likes_count = PosterLike.objects.filter(
                creator=self.request.user
            ).count()
            obj.poster_subscriptions_count = PosterSubscribe.objects.filter(
                follower=self.request.user
            ).count()
            obj.money = 340
            return obj
        else:
            return None


class FriendsView(ListAPIView):
    model = UserFriends
    queryset = UserFriends.objects.all()
    serializer_class = AccountFriendsListSerializer

    def get_queryset(self):
        queryset = super(FriendsView, self).get_queryset()
        user = self.request.user
        if user.is_authenticated():
            queryset = queryset.filter(user1=user)
        else:
            queryset = queryset.none()
        return queryset


class RegisterView(FormView):
    """
    注册接口
    """
    template_name = "account/mobile/register.html"
    form_class = RegisterForm
    success_url = settings.LOGIN_URL

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
        if not pwd_validate(password, password2):
            form.initial = data
            return self.response_error_msg(form, u'两次密码输入不一致')
        else:
            input_type = what(username)
            if not input_type:
                form.initial = data
                return self.response_error_msg(form, u'请用邮箱注册')
                # return self.response_error_msg(form, u'请用邮箱或者手机号注册')
            else:
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

                username_temp = '{}_{}'.format(username, str(uuid.uuid1()).split('-')[0])
                if input_type == 'email':
                    user = User.objects.all().filter(email=username)
                    if len(user) != 0:
                        return self.response_error_msg(form, u'用户名已存在')
                    user = User.objects.create_user(username_temp, username, password)
                else:
                    user = Person.objects.all().filter(phonenumber=username)
                    if len(user) != 0:
                        return self.response_error_msg(form, u'用户名已存在')
                    user = User.objects.create_user(username_temp, password=password)
                    person = Person.objects.create(phonenumber=username, user=user)
                    person.save()
                user.save()
                # login_validate(request, username, password)
                return super(RegisterView, self).form_valid(form)


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
