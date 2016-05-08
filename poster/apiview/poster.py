# coding=utf-8
import base64
from _datetime import datetime
import json

import pytz
from django.contrib.auth.models import AnonymousUser, User
from rest_framework.generics import (
    ListCreateAPIView, ListAPIView,
    RetrieveUpdateAPIView, UpdateAPIView, get_object_or_404)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from alatting import settings
from alatting_website.model.poster import Poster, PosterPage, PosterKeyword
from alatting_website.model.resource import Image
from alatting_website.models import CategoryKeyword
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


class PosterStatusView(APIView):
    """获取当前营业状态的api"""

    def get(self, request, *args, **kwargs):
        poster = get_object_or_404(Poster, id=self.kwargs['pk'])
        try:
            timezone = pytz.timezone(poster.lifetime_timezone)
        except pytz.UnknownTimeZoneError:
            timezone = "Asia/Shanghai"
        now = datetime.now(tz=timezone)
        day_now = now.strftime('%Y-%m-%d')
        status = 'Disable'
        lifetime_dict = json.loads(poster.lifetime_value)
        if poster.lifetime_type in ['specific_days', 'weekly']:
            make_time = lambda x, y: datetime.strptime(x + ' ' + y, '%Y-%m-%d %H:%M:%S')
            if poster.lifetime_type == 'specific_days':
                if day_now in lifetime_dict.keys() and lifetime_dict[day_now]['enabled']:
                    start_time = make_time(day_now, lifetime_dict[day_now]['time_start'])
                    end_time = make_time(day_now, lifetime_dict[day_now]['time_end'])
                    if timezone.localize(start_time) <= now <= timezone.localize(end_time):
                        status = 'Enable'
            else:
                weekday = now.strftime('%A')
                if weekday in lifetime_dict.keys() and lifetime_dict[weekday]['enabled']:
                    start_time = make_time(day_now, lifetime_dict[weekday]['time_start'])
                    end_time = make_time(day_now, lifetime_dict[weekday]['time_end'])
                    if timezone.localize(start_time) <= now <= timezone.localize(end_time):
                        status = 'Enable'
        return Response({'detail': status})


class SystemImageListView(ListAPIView):
    model = SystemImage
    serializer_class = SystemImageListSerializer
    queryset = SystemImage.objects.all()


class SystemBackgroundListView(ListAPIView):
    model = SystemBackground
    serializer_class = SystemBackgroundListSerializer
    queryset = SystemBackground.objects.all()


class PosterSaveContentMixin(object):
    """
    保存编辑修改的海报内容
    """
    def _head_fields(self):
        "头部要保存的基本信息，不在此列表中的字段未变更"
        return ["mobile", "email", "phone", "logo_title",
                "short_description", "category_keyword"]

    def _css_handler(self, old_css, new_css):
        "处理一下css内容， 把最新的css更改保存到数据库中"
        from utils.jsonutils import merge_json, css2json, json2css
        old_json = css2json(old_css)
        new_json = json.dumps(new_css)
        return json2css(merge_json(old_json, new_json))

    def _save_head_info(self, instance, head_json):
        for k, v in head_json.items():
            if k in self._head_fields():  # 存储头部其他字段
                setattr(instance, k, v)
            if k == "logo_image":  # 设置log照片
                try:
                    image = Image.objects.get(id=v['id'])
                except Image.DoesNotExist:
                    image = Image.objects.get(id=1)  # 设置默认logo图片
                setattr(instance, k, image)
            if k == "address":  # 设置地理位置
                address = instance.address
                address.address1 = head_json[k]
                address.save()
            if k == "lifetime":  # 设置生存期结构体
                for l, lv in head_json[k].items():
                    setattr(instance, l, lv)
                    if l == 'lifetime_value':
                        setattr(instance, l, json.dumps(lv))
            if k == "category_keyword":
                PosterKeyword.objects.filter(poster=instance).delete()  # 先移除所有的关键词字段
                for ck in head_json[k]:  # 一个个添加关键词
                    try:
                        ck_obj = CategoryKeyword.objects.get(id=int(ck))
                        if ck_obj is not None:
                            PosterKeyword.objects.create(poster=instance, category_keyword=ck_obj)
                    except CategoryKeyword.DoesNotExist:
                        pass  # 写error log

    def _save_pages_info(self, instance, pages_json):
        pages = PosterPage.objects.filter(poster_id=instance.id).order_by('-index')
        for page in pages:
            try:
                static_map = pages_json['{:d}'.format(page.id)]
                page.temp_html = base64.b64decode(static_map['html'])
                page.temp_css = self._css_handler(page.temp_css, static_map['css'])
                page.save()
            except KeyError:
                pass

    def save_json_info(self, instance, json_data):
        # 存储头部基本信息
        if 'head' in json_data.keys():
            self._save_head_info(instance, json_data['head'])
        if 'page' in json_data.keys():
            self._save_pages_info(instance, json_data['page'])


class PosterPublishView(RetrieveUpdateAPIView, PosterSaveContentMixin):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterPublishSerializer

    def get_queryset(self):
        qs = super(PosterPublishView, self).get_queryset()
        return qs.filter(creator=self.request.user, pk=self.kwargs['pk'])

    def perform_update(self, serializer):
        # 先把改动的数据保存下来
        json_data = self.request.data['yunyeTemplateData{:d}'.format(serializer.instance.id)]
        self.save_json_info(serializer.instance, json_data)
        # 将改动的数据写到文件发布出来
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


class PosterSaveView(RetrieveUpdateAPIView, PosterSaveContentMixin):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterSaveSerializer

    def get_queryset(self):
        qs = super(PosterSaveView, self).get_queryset()
        return qs.filter(creator=self.request.user, pk=self.kwargs['pk'])

    def perform_update(self, serializer):
        json_data = self.request.data['yunyeTemplateData{:d}'.format(serializer.instance.id)]
        self.save_json_info(serializer.instance, json_data)
        serializer.save()
