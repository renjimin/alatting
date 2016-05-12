# coding=utf-8
import base64
import json

from django.contrib.auth.models import AnonymousUser, User
from django.views.generic import CreateView
from rest_framework.generics import (
    ListCreateAPIView, ListAPIView,
    RetrieveUpdateAPIView, UpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from alatting import settings
from alatting_website.model.poster import Poster, PosterPage
from poster.models import SystemImage, SystemBackground
from poster.serializer.poster import (
    PosterSerializer, PosterSimpleInfoSerializer,
    PosterPageSerializer, PosterPublishSerializer, SystemImageListSerializer, SystemBackgroundListSerializer,
    PosterSaveSerializer)
from poster.serializer.resource import AddressSerializer
from utils.file import handle_uploaded_file, get_image_path, save_file


def set_dev_request_user(request):
    if settings.IS_FRONTEND_DEV and isinstance(request.user, AnonymousUser):
        setattr(request, 'user', User.objects.filter(username='admin').first())
        pass


class PosterSimpleInfoListView(ListAPIView):
    model = Poster
    serializer_class = PosterSimpleInfoSerializer
    queryset = Poster.objects.all()

    def get_sort_keys(self):
        req_sort = self.request.GET.get('sort', '')
        sort_key = ''
        if req_sort in ['hot', 'new']:
            if req_sort == 'hot':
                sort_key = '-poster_statistics__views_count'
            elif req_sort == 'new':
                sort_key = '-created_at'
        return sort_key

    def get_category_kwargs(self):
        kwargs = {}
        main_category = self.request.GET.get('main_category', '')
        sub_category = self.request.GET.get('sub_category', '')
        if main_category:
            kwargs.update({'main_category': main_category})
        if sub_category:
            kwargs.update({'sub_category': sub_category})
        return kwargs

    def get_queryset(self):
        qs = super(PosterSimpleInfoListView, self).get_queryset()
        qs = qs.filter(**self.get_category_kwargs())
        sort_key = self.get_sort_keys()
        if sort_key:
            qs = qs.order_by(sort_key)
        return qs


class PosterListView(ListCreateAPIView):
    model = Poster
    serializer_class = PosterSerializer
    queryset = Poster.objects.filter(
        status=Poster.STATUS_PUBLISHED
    ).order_by('-created_at')
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        set_dev_request_user(request)
        return super(PosterListView, self).post(request, *args, **kwargs)

    def perform_create(self, serializer):
        address = self.request.data.get('address', None)
        if not address:
            pass

        address_serializer = AddressSerializer(data={'address1': address})
        address_serializer.is_valid(True)
        address_instance = address_serializer.save()

        serializer.save(
            creator_id=self.request.user.id,
            status=Poster.STATUS_DRAFT,
            address_id=address_instance.id
        )


class PosterDetailView(RetrieveUpdateAPIView):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterSerializer

    def get_queryset(self):
        qs = super(PosterDetailView, self).get_queryset()
        return qs.filter(creator=self.request.user)


class PosterPageListView(ListCreateAPIView):
    model = PosterPage
    queryset = PosterPage.objects.all()
    serializer_class = PosterPageSerializer

    def post(self, request, *args, **kwargs):
        return super(PosterPageListView, self).post(request, *args, **kwargs)

    def perform_create(self, serializer):
        poster_id = self.request.data.get('poster_id')
        template_id = self.request.data.get('template_id')
        pages = PosterPage.objects.filter(
            poster_id=poster_id, template_id=template_id
        ).order_by('-index')
        if pages.exists():
            index = int(pages.first().index) + 1
        else:
            index = 0
        serializer.save(
            index=index,
            name="p%s_t%s_i%s" % (poster_id, template_id, index)
        )


class CheckPosterUniqueNameView(APIView):

    def get(self, request, *args, **kwargs):
        name = request.GET.get('name', None)
        exists = True
        if name:
            if not Poster.objects.filter(unique_name=name).exists():
                exists = False
        return Response({'exists': exists})


class SystemImageListView(ListAPIView):
    model = SystemImage
    serializer_class = SystemImageListSerializer
    queryset = SystemImage.objects.all()


class SystemBackgroundListView(ListAPIView):
    model = SystemBackground
    serializer_class = SystemBackgroundListSerializer
    queryset = SystemBackground.objects.all()


class PosterPublishView(RetrieveUpdateAPIView):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterPublishSerializer

    def get_queryset(self):
        qs = super(PosterPublishView, self).get_queryset()
        return qs.filter(creator=self.request.user, pk=self.kwargs['pk'])

    def perform_update(self, serializer):
        pages = PosterPage.objects.filter(
            poster_id=serializer.instance.id
        ).order_by('-index')
        foo = lambda x, y: '{}/page.{}'.format(x, y)
        for page in pages:
            full_path = page.check_and_create_static_file_dir()
            page.html = save_file(foo(full_path, 'html'), page.temp_html)
            page.css = save_file(foo(full_path, 'css'), page.temp_css)
            page.script = save_file(foo(full_path, 'js'), page.temp_script)
            page.save()
        serializer.save(status=Poster.STATUS_PUBLISHED)


class PosterSaveView(RetrieveUpdateAPIView):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterSaveSerializer

    def get_queryset(self):
        qs = super(PosterSaveView, self).get_queryset()
        return qs.filter(creator=self.request.user, pk=self.kwargs['pk'])

    def _head_fields(self):
        "头部要保存的基本信息，不在此列表中的字段未变更"
        return ["mobile", "email", "phone", "logo_title", "short_description"]

    def _css_handler(self, old_css, new_css):
        "处理一下css内容， 把最新的css更改保存到数据库中"
        from utils.jsonutils import merge_json, css2json, json2css
        old_json = css2json(old_css)
        new_json = json.dumps(new_css)
        return json2css(merge_json(old_json, new_json))

    def perform_update(self, serializer):
        poster_id = serializer.instance.id
        json_data = self.request.data['yunyeTemplateData{:d}'.format(poster_id)]
        # 存储头部基本信息
        try:
            for k, v in json_data['head'].items():
                if k in self._head_fields():
                    setattr(serializer.instance, k, v)
        except KeyError:
            pass
        # 存储静态文件信息
        pages = PosterPage.objects.filter(poster_id=poster_id).order_by('-index')
        for page in pages:
            try:
                static_map = json_data['page']['poster_page_{:d}'.format(page.id)]
                page.temp_html = base64.b64decode(static_map['html'])
                page.temp_css = self._css_handler(page.temp_css, static_map['css'])
                page.save()
            except KeyError:
                pass
        serializer.save()
