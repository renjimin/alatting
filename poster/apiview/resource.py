# coding=utf-8
import os
from django.conf import settings
from django.core.files import File
from rest_framework import status

from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from alatting_website.model.resource import Image, Video, Music
from alatting_website.models import Category, CategoryKeyword, Template
from poster.serializer.resource import (
    CategorySerializer, CategoryKeywordSerializer, TemplateSerializer,
    ImageSerializer, VideoSerializer, MusicSerializer)
from utils.file import get_file_ext_name, get_image_path, get_video_path, \
    get_music_path


UPLOAD_FILE_MODEL_CLASS_MAPPING = {
    'image': (Image,  ImageSerializer, get_image_path),
    'video': (Video, VideoSerializer, get_video_path),
    'audio': (Music, MusicSerializer, get_music_path)
}


class UploadFileView(APIView):
    parser_classes = (FileUploadParser,)

    def get_accept_file_mime_type(self):
        type_values = settings.UPLOAD_ACCEPT_FILE_TYPES.values()
        accept_types = []
        for x in type_values:
            accept_types.extend(x)
        return accept_types

    @staticmethod
    def get_models(file_type):
        model, serializer_model, path_method = None, None, None
        file_keys = settings.UPLOAD_ACCEPT_FILE_TYPES.keys()
        for key in file_keys:
            if file_type in settings.UPLOAD_ACCEPT_FILE_TYPES[key]:
                (model, serializer_model,
                 path_method) = UPLOAD_FILE_MODEL_CLASS_MAPPING[key]
        return model, serializer_model, path_method

    @staticmethod
    def storage_file(upload_file, save_path):
        save_full_path = os.path.join(
            settings.MEDIA_ROOT, save_path
        )
        parent_path = os.path.dirname(save_full_path)
        if not os.path.exists(parent_path):
            os.makedirs(parent_path)

        with open(save_full_path, 'wb+') as destination:
            for chunk in upload_file.chunks():
                destination.write(chunk)

    @staticmethod
    def response(data, status_code=status.HTTP_400_BAD_REQUEST):
        return Response(data, status=status_code)

    def post(self, request, *args, **kwargs):
        page_key = kwargs.get('page_key')
        if page_key not in settings.UPLOAD_SUPPORT_PAGE_KEY:
            return self.response({'detail': 'unsupport page key'})

        upload_file = request.FILES['file']
        ext_type = get_file_ext_name(upload_file.name)
        accept_types = self.get_accept_file_mime_type()
        if ext_type not in accept_types:
            return self.response({'detail': 'unsupport file mimetype'})

        model, serializer_model, path_method = self.get_models(ext_type)
        if not model:
            return self.response({'detail': 'no model mapping'})

        instance = model()
        save_path = path_method(instance, upload_file.name)
        self.storage_file(upload_file, save_path)
        instance.file = save_path
        instance.save()
        serializer = serializer_model(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryListView(ListAPIView):
    model = Category
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        qs = super(CategoryListView, self).get_queryset()
        parent = self.request.GET.get('parent', "-1")
        kwargs = {}
        if parent != "-1":
            if parent == "0":
                kwargs.update({'parent__isnull': True})
            else:
                kwargs.update({'parent': parent})
        return qs.filter(**kwargs).order_by('name')


class CategoryKeywordListView(ListCreateAPIView):
    model = CategoryKeyword
    queryset = CategoryKeyword.objects.all()
    serializer_class = CategoryKeywordSerializer

    def get_queryset(self):
        qs = super(CategoryKeywordListView, self).get_queryset()
        category = self.kwargs.get('pk', None)
        qs = qs.filter(category=category).order_by('verb', 'noun')
        return qs

    def perform_create(self, serializer):
        serializer.save(
            category_id=self.kwargs.get('pk')
        )


class TemplateListView(ListAPIView):
    model = Template
    queryset = Template.objects.all().order_by('name')
    serializer_class = TemplateSerializer
