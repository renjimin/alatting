# coding=utf-8
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from utils.userinput import what, test_phonenumer
from utils.message import get_message
from alatting_website.models import Person
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from .models import LoginMessage


def not_found(request):
    return JsonResponse({'detail': u'Page Not Found'}, status=404)


class MessageView(APIView):
    """生成验证码"""
    permission_classes = ()

    def post(self, request, **kwargs):
        phonenumber = request.data['phonenumber']
        input_type = test_phonenumer(phonenumber)
        if input_type != "phonenumber":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            message = get_message(phonenumber)
            msg = LoginMessage.objects.get(phonenumber=phonenumber)
            if msg:
                msg.message = message
                msg.save()
            else:
                LoginMessage.objects.create(message=message,
                                            phonenumber=phonenumber)
            data = dict(message=message, phonenumber=phonenumber)
            return Response(data)


class CheckMessageView(APIView):
    """校验验证码"""
    permission_classes = ()

    def post(self, request, **kwargs):
        phonenumber = request.data['phonenumber']
        message = request.data['message']
        input_type = test_phonenumer(phonenumber)
        if input_type != "phonenumber":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            msg = LoginMessage.objects.get(phonenumber=phonenumber)
            offset_naive_dt = msg.created_at.replace(tzinfo=None)
            # 校验时间是否已过期
            if datetime.now() - offset_naive_dt > timedelta(seconds=settings.EXPIRE_TIME):
                return Response(dict(detail="Time has expired"),
                         status=status.HTTP_401_UNAUTHORIZED)
            if msg.message == message:  # 校验验证码是否正确
                return Response(dict(detail="Authentication successful"))
            return Response(dict(detail="Authentication failure"),
                            status=status.HTTP_401_UNAUTHORIZED)


class LoginView(APIView):
    """用户登陆，支持用户名登陆、邮箱登陆、手机号登陆"""
    permission_classes = ()

    def post(self, request, **kwargs):
        inputvalue = request.data['username']
        password = request.data['password']
        input_type = what(inputvalue)
        username = inputvalue
        if input_type == "phonenumber":
            person = Person.objects.get(phonenumber=inputvalue)
            username = person.user.username
        elif input_type == "email":
            user = User.objects.get(email=inputvalue)
            username = user.username
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'detail': 'Login successful'})
        else:
            return Response(
                {'detail': 'Authentication failure'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    def delete(self, request):
        logout(request)
        return Response({'detail': 'Logout successful'})
