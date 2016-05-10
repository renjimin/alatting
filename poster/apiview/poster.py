# coding=utf-8
from django.contrib.auth.models import AnonymousUser, User
from django.views.generic import CreateView
from rest_framework.generics import (
    ListCreateAPIView, ListAPIView,
    RetrieveUpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from alatting import settings
from alatting_website.model.poster import Poster, PosterPage
from poster.models import SystemImage
from poster.serializer.poster import (
    PosterSerializer, PosterSimpleInfoSerializer,
    PosterPageSerializer, PosterPublishSerializer, SystemImageListSerializer)
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
        for page in pages:
            full_path = page.check_and_create_static_file_dir()
            save_file(full_path, 'page.html', page.temp_html)
            save_file(full_path, 'page.css', page.temp_css)
            save_file(full_path, 'page.js', page.temp_script)
        serializer.save(status=Poster.STATUS_PUBLISHED)


class SystemImageListView(ListAPIView):
    model = SystemImage
    serializer_class = SystemImageListSerializer
    queryset = SystemImage.objects.all()