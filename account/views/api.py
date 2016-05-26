# coding=utf-8
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import status

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, \
    ListAPIView, get_object_or_404, GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from account.email import send_verify_email
from account.models import Person, UserFriends, LoginMessage, UserCategory
from account.serializers import AccountProfileSerializer, \
    AccountFriendsListSerializer
from alatting_website.model.poster import Poster
from alatting_website.model.resource import Image, Video, Music
from alatting_website.serializer.edit_serializer import ImageSerializer, \
    VideoSerializer, MusicSerializer
from poster.serializer.poster import PosterSerializer
from utils.file import get_image_path, get_video_path, get_music_path
from utils.message import get_message
from utils.userinput import what


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
            return Response({'detail': '参数错误'},
                            status=status.HTTP_400_BAD_REQUEST)

        input_type, is_user_existed = self.is_user_existed(inputvalue)
        if input_type is None:
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
        if input_type is None:
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


class PostersServerListView(ListCreateAPIView):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterSerializer

    def get_queryset(self):
        qs = super(PostersServerListView, self).get_queryset()
        return qs.filter(creator=self.request.user).order_by('-created_at')


class PostersConsumerListView(ListAPIView):
    model = Poster
    queryset = Poster.objects.filter(
        status=Poster.STATUS_PUBLISHED
    )
    serializer_class = PosterSerializer

    def get_queryset(self):
        qs = super(PostersConsumerListView, self).get_queryset()
        sub_ids = UserCategory.objects.filter(
            user=self.request.user,
            data_status=UserCategory.DATA_STATUS_USABLE
        ).values_list('sub_category_id', flat=True)
        if sub_ids:
            qs = qs.filter(
                sub_category_id__in=sub_ids
            ).exclude(
                creator=self.request.user
            ).order_by('-created_at')
        return qs


class ProfileView(RetrieveUpdateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = AccountProfileSerializer

    def get_object(self):
        return get_object_or_404(User, pk=self.request.user.id)


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


FILE_MODEL_CLASS_MAPPING = {
    'image': (Image, ImageSerializer, get_image_path),
    'video': (Video, VideoSerializer, get_video_path),
    'audio': (Music, MusicSerializer, get_music_path)
}


class FilesListView(ListAPIView):
    model = Image
    serializer_class = ImageSerializer
    queryset = Image.objects.none()

    def get(self, request, *args, **kwargs):
        q = request.GET.get('q', '')
        if q and q in FILE_MODEL_CLASS_MAPPING.keys():
            models = FILE_MODEL_CLASS_MAPPING.get(q)
            self.model = models[0]
            self.serializer_class = models[1]
            self.queryset = self.model.objects.filter(
                creator=self.request.user
            ).order_by("-created_at")
        return super(FilesListView, self).get(request, *args, **kwargs)
