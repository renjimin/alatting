# coding=utf-8
import uuid
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
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import AllowAny
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
            try:
                msg = LoginMessage.objects.get(phonenumber=phonenumber)
                msg.message = message
                msg.save()
            except LoginMessage.DoesNotExist:
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
            try:
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
            except LoginMessage.DoesNotExist:
                return Response(dict(detail="no message"),
                                status=status.HTTP_404_NOT_FOUND)


class RegisterView(APIView):
    """
    注册接口,支持手机注册和邮箱注册，手机注册之前已校验验证码，邮箱注册成功返回激活邮件地址
    """
    permission_classes = (AllowAny,)
    authentication_classes = (BasicAuthentication,)

    def check_request_data(self, data):
        """判断用户入参是否完整"""
        try:
            if not all([data['username'], data['password']]):
                return -1
        except Exception as e:
            return -1

    def check_input_value(self, username):
        """判断用户是输入用户名还是email,手机号注册"""
        aquery = {}
        input_type = what(username)
        if input_type is None:  # 用户名注册
            if len(username) > 30:
                return -1
            input_type = 'username'
            aquery = {'username': username}
        else:  # 邮箱或者手机号注册
            if input_type == "email":  # 如果用户是用邮箱注册的
                aquery = {'email': username}
            elif input_type == "phonenumber":  # 如果用户是用手机号注册的
                aquery = {'phonenumber': username}
        return [ input_type, aquery ]

    def check_user_exist(self, input_type, aquery):
        """判断用户是否重复注册"""
        if input_type == "phonenumber":
            try:
                user = Person.objects.get(**aquery)
            except Person.DoesNotExist:
                return 0
        else:
            try:
                user = User.objects.get(**aquery)
            except User.DoesNotExist:
                return 0
        return -1


    def post(self, request, format=None):
        """注册接口"""
        ret = self.check_request_data(request.data)
        if ret == -1:
            return Response({'detail': '参数错误'}, status=status.HTTP_400_BAD_REQUEST)

        ret = self.check_input_value(request.data['username'])
        if ret == -1:
            return Response({'detail': '用户名不能超过30字节'}, status=status.HTTP_400_BAD_REQUEST)
        input_type, aquery = ret
        ret = self.check_user_exist(input_type, aquery)
        if ret == -1:
            return Response({'detail': '重复注册'}, status=status.HTTP_403_FORBIDDEN)

        randstr = lambda: str(uuid.uuid1()).split('-')[0]
        if input_type == "username":  # 用用户名注册的直接使用用户名加用户
            username = request.data['username']
        else:  # 用邮箱或者手机注册的生成一个用户名
            username = '{}_{}'.format(request.data['username'], randstr())
        resdata = {'detail': 'Register successful'}
        user = User.objects.create(username=username)
        user.set_password(request.data['password'])
        if input_type == 'email':
            user.email = request.data['username']
            user.is_active = False
            resdata['active_url'] = ""  # TODO 增加邮箱的激活地址
        if input_type == 'phonenumber':
            Person.objects.create(phonenumber=request.data['username'], user=user)
        user.save()
        return Response(resdata)


class LoginView(APIView):
    """用户登陆，支持用户名登陆、邮箱登陆、手机号登陆"""
    permission_classes = ()

    def post(self, request, **kwargs):
        inputvalue = request.data['username']
        password = request.data['password']
        input_type = what(inputvalue)
        username = inputvalue
        if input_type == "phonenumber":
            try:
                person = Person.objects.get(phonenumber=inputvalue)
                username = person.user.username
            except Person.DoesNotExist:
                return Response({'detail': 'no users'}, status=status.HTTP_404_NOT_FOUND)
        elif input_type == "email":
            try:
                user = User.objects.get(email=inputvalue)
                username = user.username
            except User.DoesNotExist:
                return Response({'detail': 'no users'}, status=status.HTTP_404_NOT_FOUND)
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


class ResetPasswordView(APIView):
    """重设密码"""
    permission_classes = ()

    def post(self, request, **kwargs):
        inputvalue = request.data['username']
        password = request.data['password']
        input_type = what(inputvalue)
        if input_type == "phonenumber":  # 手机号重置密码
            try:
                person = Person.objects.get(phonenumber=inputvalue)
                user = person.user
            except Person.DoesNotExist:
                return Response({'detail': 'no users'}, status=status.HTTP_404_NOT_FOUND)
        else:  # 邮箱重置密码
            try:
                if input_type == "email":
                    user = User.objects.get(email=inputvalue)
                else:
                    user = User.objects.get(username=inputvalue)
            except User.DoesNotExist:
                return Response({'detail': 'no users'}, status=status.HTTP_404_NOT_FOUND)
        user.set_password(password)
        user.save()
        return Response({'detail': 'Reset successful'})