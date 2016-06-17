# coding=utf-8
import base64
from django.core.urlresolvers import reverse
from rest_framework import serializers
from account.serializers import AccountProfileSimpleSerializer
from alatting_website.model.poster import Poster, PosterPage
from alatting_website.model.statistics import PosterFavorites
from alatting_website.serializer.edit_serializer import ImageSerializer
from alatting_website.serializer.statistics_serializer import \
    PosterStatisticsSerializer, HistoryStatisticsSerializer
from poster.models import SystemImage, SystemMusic, ServiceBargain, Chat, \
    ServiceComment, CommonQA, CustomerService, VisitHistory
from poster.serializer.resource import CategorySerializer, \
    CategoryKeywordSerializer, TemplateSerializer, AddressSerializer


class PosterSimpleInfoSerializer(serializers.ModelSerializer):
    thumb = serializers.SerializerMethodField()
    home_page = serializers.SerializerMethodField()
    views_count = serializers.SerializerMethodField()

    def get_thumb(self, obj):
        if obj.snapshot:
            return obj.snapshot.url
        return ''

    def get_home_page(self, obj):
        return obj.get_absolute_url()

    def get_views_count(self, obj):
        return obj.poster_statistics.views_count

    class Meta:
        model = Poster
        fields = ('id', 'home_page', 'thumb', 'views_count', 'created_at')


class PosterSerializer(serializers.ModelSerializer):
    main_category = CategorySerializer(read_only=True)
    main_category_id = serializers.IntegerField(write_only=True)

    sub_category = CategorySerializer(read_only=True)
    sub_category_id = serializers.IntegerField(write_only=True)

    logo_image = ImageSerializer(read_only=True)
    logo_image_id = serializers.IntegerField(write_only=True)

    address = AddressSerializer(read_only=True)

    category_keyword = CategoryKeywordSerializer(read_only=True)
    category_keyword_id = serializers.IntegerField(write_only=True)

    mobile_edit_url = serializers.SerializerMethodField(read_only=True)
    pc_edit_url = serializers.SerializerMethodField(read_only=True)

    def get_mobile_edit_url(self, obj):
        return obj.get_mobile_edit_url()

    def get_pc_edit_url(self, obj):
        return obj.get_pc_edit_url()

    def get_logo_image_url(self, obj):
        return obj.logo_image.file.url if obj.logo_image else ''

    class Meta:
        model = Poster
        exclude = ('data', 'html', 'css', 'script')
        read_only_fields = ('main_category', 'sub_category',
                            'logo_image', 'status',
                            'address', 'created_at', 'creator')


class PosterPageSerializer(serializers.ModelSerializer):
    poster = PosterSerializer(read_only=True)
    poster_id = serializers.IntegerField(write_only=True)

    template = TemplateSerializer(read_only=True)
    template_id = serializers.IntegerField(write_only=True)

    temp_html = serializers.SerializerMethodField()
    temp_css = serializers.SerializerMethodField()

    image_url = serializers.SerializerMethodField()

    css_url = serializers.SerializerMethodField()

    def get_css_url(self, obj):
        if obj.css:
            return obj.css.url
        return ''

    def get_image_url(self, obj):
        if obj.template:
            try:
                return '/media/{}'.format(obj.template.image.file.name)
            except Exception:
                return ''
        return ''

    def get_temp_html(self, obj):
        html = obj.temp_html
        if html:
            b_html = html.encode(encoding='utf-8', errors='ignore')
            return bytes.decode(base64.b64encode(b_html))
        return ""

    def get_temp_css(self, obj):
        css = obj.temp_css
        if css:
            b_css = css.encode(encoding='utf-8', errors='ignore')
            return bytes.decode(base64.b64encode(b_css))
        return ""

    class Meta:
        model = PosterPage
        exclude = ('temp_script', 'html', 'css', 'script')
        read_only_fields = ('id', 'index', 'name', 'temp_html', 'temp_css')


class PosterPublishSerializer(serializers.ModelSerializer):
    status = serializers.CharField()

    class Meta:
        model = Poster
        fields = ('status', )


class SystemImageListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return obj.image.file.url if obj.image else ''

    class Meta:
        model = SystemImage
        fields = ('image', 'name', 'image_url', 'text')


class SystemMusicListSerializer(serializers.ModelSerializer):
    music_url = serializers.SerializerMethodField()

    def get_music_url(self, obj):
        print(obj.music.file.url)
        return obj.music.file.url if obj.music else ''

    class Meta:
        model = SystemMusic
        fields = ('music', 'name', 'music_url')


class SystemBackgroundListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return obj.image.file.url if obj.image else ''

    def get_thumbnail_url(self, obj):
        return obj.thumbnail_img.file.url if obj.thumbnail_img else ''

    class Meta:
        model = SystemImage
        fields = ('image', 'image_url', 'thumbnail_url')


class PosterSaveSerializer(serializers.ModelSerializer):
    pages_statics = serializers.SerializerMethodField()

    def get_pages_statics(self, obj):
        return PosterPage.objects.filter(poster_id=obj.id).\
            values('id', 'temp_html', 'temp_css', 'temp_script')

    class Meta:
        model = Poster
        fields = ('pages_statics',)


class ServiceBargainSerializer(serializers.ModelSerializer):
    consumer_id = serializers.IntegerField(write_only=True, required=False)
    server = AccountProfileSimpleSerializer(read_only=True)
    consumer = AccountProfileSimpleSerializer(read_only=True)
    creator = AccountProfileSimpleSerializer(read_only=True)
    accepted = serializers.BooleanField()
    refused = serializers.BooleanField()

    class Meta:
        model = ServiceBargain
        read_only_fields = ('poster', 'server', 'consumer')


class ChatSerializer(serializers.ModelSerializer):
    sender = AccountProfileSimpleSerializer(read_only=True)
    receiver = AccountProfileSimpleSerializer(read_only=True)

    class Meta:
        model = Chat
        read_only_fields = ('poster', 'sender', 'receiver')


class StatisticsDataSerializer(serializers.ModelSerializer):
    poster_statistics = PosterStatisticsSerializer()
    history_statistics = HistoryStatisticsSerializer()

    class Meta:
        model = Poster
        fields = ('poster_statistics', 'history_statistics')


class ServiceCommentSerializer(serializers.ModelSerializer):
    creator = AccountProfileSimpleSerializer(read_only=True)

    class Meta:
        model = ServiceComment
        read_only_fields = ('creator', 'poster')


class CommonQASerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonQA
        read_only_fields = ['created_at', 'updated_at']


class CustomerServiceSerializer(serializers.ModelSerializer):
    user = AccountProfileSimpleSerializer(read_only=True)
    updated_at = serializers.SerializerMethodField()

    def get_updated_at(self, obj):
        if not obj.reply:
            return None
        else:
            return obj.updated_at

    class Meta:
        model = CustomerService
        read_only_fields = ['created_at', 'updated_at', 'reply']


class VisitHistorySerializer(serializers.ModelSerializer):
    mobile_url = serializers.SerializerMethodField()
    pc_url = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()

    def get_title(self, obj):
        return obj.poster.unique_name

    def get_pc_url(self, obj):
        return obj.poster.get_pc_url()

    def get_mobile_url(self, obj):
        return obj.poster.get_mobile_url()

    class Meta:
        model = VisitHistory
        read_only_fields = ['created_at', 'updated_at']


class PosterFavoritesSerializer(serializers.ModelSerializer):
    poster = PosterSerializer()

    class Meta:
        model = PosterFavorites

