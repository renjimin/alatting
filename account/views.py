# coding=utf-8
import uuid
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.views.generic import FormView
from django.views.generic.detail import DetailView
from rest_framework import status
from rest_framework.response import Response
from django.views.generic import View
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from account.form.forms import RegisterForm, pwd_validate, ResetPasswordForm, LoginForm
from utils.userinput import what
from utils.message import get_message
from alatting_website.models import (
    Person, Poster, PosterLike, PosterSubscribe
    )
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import AllowAny
from .email import send_verify_email
from .models import LoginMessage, UserFriends
from .serializers import AccountProfileSerializer, AccountFriendsListSerializer


def not_found(request):
    return JsonResponse({'detail': u'Page Not Found'}, status=404)


class MessageView(APIView):
    """生成验证码"""
    permission_classes = ()

    def post(self, request, **kwargs):
        try:
            inputvalue = request.data['username']
        except KeyError:
            return Response({'detail': '参数错误'}, status=status.HTTP_400_BAD_REQUEST)
        input_type = what(inputvalue)
        message = get_message(inputvalue)
        if input_type == None:
            return Response({'detail': '参数错误,请用邮箱或者手机号注册'},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
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
                user = User.objects.all().filter(email=inputvalue)
                if len(user) != 0:
                    data['warning'] = "用户已存在"
            else:  # 手机号
                person = Person.objects.all().filter(phonenumber=inputvalue)
                if len(person) != 0:
                    data['warning'] = "用户已存在"
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
    template_name = 'account/profile.html'
    model = User

    def get_object(self):
        user = self.request.user
        if user.is_authenticated():
            obj = self.request.user
            posters_created = []
            for poster_created in Poster.objects.filter(creator=self.request.user):
                posters_created.append(poster_created)
            obj.posters_created = posters_created
            obj.poster_count = Poster.objects.filter(creator=self.request.user).count()
            obj.poster_likes_count = PosterLike.objects.filter(creator=self.request.user).count()
            obj.poster_subscriptions_count = PosterSubscribe.objects.filter(follower=self.request.user).count()
            obj.money = 340
            return obj
        else:
            return None

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        return context


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
    template_name = "account/register.html"
    form_class = RegisterForm
    success_url = settings.LOGIN_URL

    def form_valid(self, form):
        data = form.cleaned_data
        username = data['username']
        message = data['message']
        password = data['password1']
        password2 = data['password2']
        if not pwd_validate(password, password2):
            return render_to_response('account/register.html', {'error': "两次密码输入不一致"})
        else:
            input_type = what(username)
            if not input_type:
                return render_to_response('account/register.html', {'error': "请用邮箱或者手机号注册"})
            else:
                try:
                    msg = LoginMessage.objects.get(username=username)
                except LoginMessage.DoesNotExist:
                    return render_to_response('account/register.html', {'error': "未发送过此验证码"})

                offset_naive_dt = msg.created_at.replace(tzinfo=None)
                # 校验时间是否已过期
                if datetime.now() - offset_naive_dt > timedelta(seconds=settings.EXPIRE_TIME):
                    return render_to_response('account/register.html', {'error': "验证码已过期"})
                if msg.message != message:  # 校验验证码是否正确
                    return render_to_response('account/register.html', {'error': "验证码不正确"})

                username_temp = '{}_{}'.format(username, str(uuid.uuid1()).split('-')[0])
                if input_type == 'email':
                    user = User.objects.all().filter(email=username)
                    if len(user) != 0:
                        return render_to_response('account/register.html', {'error': "账户已存在"})
                    user = User.objects.create_user(username_temp, username, password)
                else:
                    user = Person.objects.all().filter(phonenumber=username)
                    if len(user) != 0:
                        return render_to_response('account/register.html', {'error': "账户已存在"})
                    user = User.objects.create_user(username_temp, password=password)
                    person = Person.objects.create(phonenumber=username, user=user)
                    person.save()
                user.save()
                # login_validate(request, username, password)
                return super(RegisterView, self).form_valid(form)


class ResetPasswordView(FormView):
    """重置密码"""
    template_name = "account/forget-pwd.html"
    form_class = ResetPasswordForm
    success_url = settings.LOGIN_URL

    def form_valid(self, form):
        data = form.cleaned_data
        username = data['username']
        password = data['password1']
        password2 = data['password2']
        if not pwd_validate(password, password2):
            return render_to_response('account/forget-pwd.html', {'error': "两次密码输入不一致"})
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
    template_name = "account/login.html"
    form_class = LoginForm
    success_url = settings.LOGIN_REDIRECT_URL

    def form_valid(self, form):
        data = form.cleaned_data
        username = data['username']
        password = data['password']

        input_type = what(username)
        if input_type == "phonenumber":
            person = get_object_or_404(Person, phonenumber=username)
            username = person.user.username
        elif input_type == "email":
            user = get_object_or_404(User, email=username)
            username = user.username
        else:
            return render_to_response('account/login.html', {'error': "请使用邮箱或者手机号登陆"})

        user = authenticate(username=username, password=password)
        if user is not None:
            request = super(LoginView, self).get_context_data().get('view').request
            login(request, user)
            return super(LoginView, self).form_valid(form)
        else:
            return render_to_response('account/login.html', {'error': "用户名或密码错误"})
