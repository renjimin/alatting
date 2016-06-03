# coding=utf-8

import base64
from datetime import datetime
import json
import logging
import os
import pytz

from django.conf import settings
from rest_framework import status
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView, RetrieveUpdateAPIView, get_object_or_404,
    ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
)
from rest_framework.permissions import IsAuthenticated
from alatting_website.logic.poster_service import PosterService
from alatting_website.model.resource import Image, Video, Music
from alatting_website.model.poster import Poster, PosterPage, PosterKeyword
from alatting_website.models import Category, CategoryKeyword, Template
from alatting_website.serializer.edit_serializer import ImageSerializer, \
    MusicSerializer
from alatting_website.serializer.edit_serializer import VideoSerializer
from poster.models import SystemImage, SystemBackground, SystemMusic
from poster.serializer.permissions import IsOwnerOrReadOnly
from utils.file import (
    save_file, read_template_file_content,
    get_file_ext_name, get_image_path,
    get_video_path, get_music_path, rotate_image, get_video_preview_image_url
)
from poster.serializer.poster import (
    PosterSerializer, PosterSimpleInfoSerializer,
    PosterPageSerializer, PosterPublishSerializer, SystemImageListSerializer,
    SystemBackgroundListSerializer,
    PosterSaveSerializer, SystemMusicListSerializer)
from poster.serializer.resource import (
    CategorySerializer, CategoryKeywordSerializer, TemplateSerializer,
    AddressSerializer
)
from survey.models import RunInfoHistory
from survey.serializer.survey import RunInfoHistorySerializer

logger = logging.getLogger('common')


FILE_MODEL_CLASS_MAPPING = {
    'image': (Image, ImageSerializer, get_image_path),
    'video': (Video, VideoSerializer, get_video_path),
    'audio': (Music, MusicSerializer, get_music_path)
}


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


class PosterDetailView(RetrieveUpdateDestroyAPIView):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)


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
            poster_id=poster_id
        ).order_by('-index')
        if pages.exists():
            index = int(pages.first().index) + 1
        else:
            index = 0

        template = get_object_or_404(Template, pk=template_id)
        html = read_template_file_content(template.html_path())
        css = read_template_file_content(template.css_path())
        js = read_template_file_content(template.js_path())
        posterpage = serializer.save(
            index=index,
            name="p%s_t%s_i%s" % (poster_id, template_id, index),
            temp_html=html,
            temp_css=css,
            temp_script=js
        )
        posterpage.check_and_create_static_file_dir()


class PosterPageDetailView(RetrieveUpdateAPIView):
    model = PosterPage,
    queryset = PosterPage.objects.all()
    serializer_class = PosterPageSerializer

    def perform_update(self, serializer):
        posterpage = self.get_object()
        poster_id = self.request.data.get('poster_id')
        template_id = self.request.data.get('template_id')
        template = get_object_or_404(Template, pk=template_id)
        html = read_template_file_content(template.html_path())
        css = read_template_file_content(template.css_path())
        js = read_template_file_content(template.js_path())
        posterpage = serializer.save(
            name="p%s_t%s_i%s" % (poster_id, template_id, posterpage.index),
            temp_html=html,
            temp_css=css,
            temp_script=js,
            html=None,
            css=None,
            script=None
        )
        posterpage.check_and_create_static_file_dir()


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
        if poster.lifetime_type in [Poster.LIFETIME_SPECIFIC_DAYS,
                                    Poster.LIFETIME_WEEKLY]:
            make_time = lambda x, y: datetime.strptime(x + ' ' + y,
                                                       '%Y-%m-%d %H:%M:%S')

            time_keys = lifetime_dict.keys()
            if poster.lifetime_type == Poster.LIFETIME_SPECIFIC_DAYS:
                if day_now in time_keys and lifetime_dict[day_now]['enabled']:
                    start_time = make_time(day_now,
                                           lifetime_dict[day_now]['start'])
                    end_time = make_time(day_now,
                                         lifetime_dict[day_now]['end'])
                    start_time = timezone.localize(start_time)
                    end_time = timezone.localize(end_time)
                    if start_time <= now <= end_time:
                        status = 'Enable'
            else:
                weekday = now.strftime('%A')
                if weekday in time_keys and lifetime_dict[weekday]['enabled']:
                    start_time = make_time(day_now,
                                           lifetime_dict[weekday]['start'])
                    end_time = make_time(day_now,
                                         lifetime_dict[weekday]['end'])
                    start_time = timezone.localize(start_time)
                    end_time = timezone.localize(end_time)
                    if start_time <= now <= end_time:
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


class SystemMusicListView(ListAPIView):
    model = SystemMusic
    serializer_class = SystemMusicListSerializer
    queryset = SystemMusic.objects.all()


class PosterSaveContentMixin(object):
    """
    保存编辑修改的海报内容
    """
    def _head_fields(self):
        "头部要保存的基本信息，不在此列表中的字段未变更"
        return ["mobile", "email", "phone", "unique_name", "music",
                "short_description"]

    def _logo_handler(self, instance, head_json):
        if head_json["logoTitleType"] == 'image':
            try:
                image = Image.objects.get(
                    file=head_json["logo_image"]['url'].replace('/media/', '')
                )
                setattr(instance, "logo_image", image)
                setattr(instance, "logo_title", '')
            except Exception:
                pass # 后续加上设置默认logo图片
        if head_json["logoTitleType"] == 'text':
            setattr(instance, "logo_title", head_json["logo_title"])

    def _css_handler(self, old_css, new_css):
        "处理一下css内容， 把最新的css更改保存到数据库中"
        from utils.jsonutils import merge_json, css2json, json2css
        old_json = css2json(old_css)
        new_json = json.dumps(new_css)
        return json2css(merge_json(old_json, new_json))

    def _save_head_info(self, instance, head_json):
        self._logo_handler(instance, head_json)  # 存一下logo信息
        for k, v in head_json.items():
            if k in self._head_fields():  # 存储头部其他字段
                setattr(instance, k, v)

            obj = head_json.get(k, {})
            if k == "address":  # 设置地理位置
                address = instance.address
                address.address1 = obj.get('address', '')
                if obj.get('city', ''):
                    address.city = obj.get('city')
                if obj.get('province', ''):
                    address.province = obj.get('province')
                address.save()
            if k == "lifetime":  # 设置生存期结构体
                setattr(instance, 'lifetime_timezone', 'Asia/Shanghai')
                special = obj.get('lifetime_special', {})
                weekly = obj.get('lifetime_weekly', {})
                if special:
                    life_type = Poster.LIFETIME_SPECIFIC_DAYS
                    life_value = special
                else:
                    life_type = Poster.LIFETIME_WEEKLY
                    life_value = weekly
                setattr(instance, 'lifetime_type', life_type)
                setattr(instance, 'lifetime_value', json.dumps(life_value))

            if k == "category_keyword":
                PosterKeyword.objects.filter(poster=instance).delete()  # 先移除所有的关键词字段
                for ck in obj:  # 一个个添加关键词
                    try:
                        ck_obj = CategoryKeyword.objects.get(id=int(ck))
                        if ck_obj is not None:
                            PosterKeyword.objects.create(
                                poster=instance, category_keyword=ck_obj
                            )
                    except CategoryKeyword.DoesNotExist:
                        pass

    def _save_pages_info(self, instance, pages_json):
        pages = PosterPage.objects.filter(
            poster_id=instance.id
        ).order_by('-index')
        for page in pages:
            try:
                static_map = pages_json['{:d}'.format(page.id)]
                if 'html' in static_map.keys() \
                        and len(static_map['html']) != 0:
                    html = str(base64.b64decode(static_map['html']),
                               encoding='utf-8', errors='ignore')
                    page.temp_html = html
                if 'css' in static_map.keys() \
                        and len(static_map['css']) != 0:
                    page.temp_css = self._css_handler(page.temp_css,
                                                      static_map['css'])
                page.save()
            except KeyError:
                pass

    def save_json_info(self, instance, request_data):
        # 存储头部基本信息
        try:
            json_data = json.loads(request_data['data'])
            if 'head' in json_data.keys():
                self._save_head_info(instance, json_data['head'])
            if 'pages' in json_data.keys():
                self._save_pages_info(instance, json_data['pages'])
        except Exception as e:
            logger.exception(e)
            raise e


class PosterPublishView(RetrieveUpdateAPIView, PosterSaveContentMixin):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterPublishSerializer

    def get_queryset(self):
        qs = super(PosterPublishView, self).get_queryset()
        return qs.filter(creator=self.request.user, pk=self.kwargs['pk'])

    def perform_update(self, serializer):
        # 先把改动的数据保存下来
        self.save_json_info(serializer.instance, self.request.data)
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
        try:
            image_url, pdf_url = PosterService.capture(
                self.request, serializer.instance,
                force='force' in self.request.GET
            )
            if image_url:
                serializer.instance.snapshot = image_url
                serializer.instance.save(update_fields=['snapshot'])
            print(image_url)
            print(pdf_url)
        except Exception as e:
            logger.exception(e)
            raise e


class PosterSaveView(RetrieveUpdateAPIView, PosterSaveContentMixin):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterSaveSerializer

    def get_queryset(self):
        qs = super(PosterSaveView, self).get_queryset()
        return qs.filter(creator=self.request.user, pk=self.kwargs['pk'])

    def perform_update(self, serializer):
        self.save_json_info(serializer.instance, self.request.data)
        serializer.save()


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
                 path_method) = FILE_MODEL_CLASS_MAPPING[key]
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

        return save_full_path

    @staticmethod
    def response(data, status_code=status.HTTP_400_BAD_REQUEST):
        return Response(data, status=status_code)

    def check_file_size(self, upload_file):
        if upload_file.size > settings.UPLOAD_FILE_SIZE_LIMIT:
            mb = settings.UPLOAD_FILE_SIZE_LIMIT / 1024 / 1024
            return self.response({'detail': '上传的单个文件不能大于 %sM' % mb})
        return None

    def post(self, request, *args, **kwargs):
        upload_file = request.FILES['file']
        ext_type = get_file_ext_name(upload_file.name)
        accept_types = self.get_accept_file_mime_type()
        if ext_type not in accept_types:
            return self.response({'detail': '不支持上传%s文件类型' % ext_type})

        check_resp = self.check_file_size(upload_file)
        if check_resp:
            return check_resp

        model, serializer_model, path_method = self.get_models(ext_type)
        if not model:
            return self.response({'detail': 'no model mapping'})

        instance = model()
        save_path = path_method(instance, upload_file.name)
        full_path = self.storage_file(upload_file, save_path)
        instance.file = save_path

        if model.__name__ == 'Video':
            preview_url = get_video_preview_image_url(instance.file)
            instance.preview = preview_url
        elif model.__name__ == 'Image':
            rotate_image(full_path)

        instance.creator = self.request.user
        instance.save()
        serializer = serializer_model(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryListView(ListAPIView):
    model = Category
    queryset = Category.objects.filter(
        audit_status=Category.AUDIT_STATUS_PASS
    )
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

    def create(self, request, *args, **kwargs):
        qs = CategoryKeyword.objects.filter(
            verb=request.data['verb'],
            noun=request.data['noun']
        )
        if qs.exists():
            CategoryKeywordSerializer()
            return Response({
                'exists': True, 'id': qs.first().id,
                'keyword': CategoryKeywordSerializer(qs.first()).data
            }, status=status.HTTP_200_OK)
        else:
            return super(CategoryKeywordListView, self).create(
                request, *args, **kwargs
            )


class TemplateListView(ListAPIView):
    model = Template
    queryset = Template.objects.filter(
        data_status=Template.USABLE
    ).order_by('name')
    serializer_class = TemplateSerializer

    def get_queryset(self):
        qs = super(TemplateListView, self).get_queryset()
        if self.request.GET.get('exclude', ''):
            qs = qs.exclude(pk__in=self.request.GET.get('exclude'))
        return qs


class CategoryKeywordDetailView(RetrieveUpdateDestroyAPIView):
    model = CategoryKeyword
    serializer_class = CategoryKeywordSerializer
    queryset = CategoryKeyword.objects.all()


class TemplateDetailView(RetrieveAPIView):
    model = Template
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer


class SurveyConsumerAnswersView(ListAPIView):
    model = RunInfoHistory
    queryset = RunInfoHistory.objects.all()
    serializer_class = RunInfoHistorySerializer

    def get_queryset(self):
        qs = super(SurveyConsumerAnswersView, self).get_queryset()
        return qs.filter(
            poster_id=self.kwargs['pk'], questionnaire__role = 'consumer', 
            isactive = True
        )
    

class SurveyConsumerAnsView(ListAPIView):
    model = RunInfoHistory
    queryset = RunInfoHistory.objects.all()
    serializer_class = RunInfoHistorySerializer

    def get_queryset(self):
        qs = super(SurveyConsumerAnsView, self).get_queryset()
        return qs.filter(
            poster_id=self.kwargs['pk'], subject_id=self.request.user.id, 
            questionnaire__role = 'consumer', isactive = True
        )