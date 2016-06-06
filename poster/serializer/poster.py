# coding=utf-8
from django.core.urlresolvers import reverse
from rest_framework import serializers
from account.serializers import AccountProfileSimpleSerializer
from alatting_website.model.poster import Poster, PosterPage
from alatting_website.serializer.edit_serializer import ImageSerializer
from alatting_website.serializer.statistics_serializer import \
    PosterStatisticsSerializer, HistoryStatisticsSerializer
from poster.models import SystemImage, SystemMusic, ServiceBargain, Chat, \
    ServiceComment
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

    class Meta:
        model = PosterPage
        exclude = ('temp_html', 'temp_css', 'temp_script')
        read_only_fields = ('id', 'poster', 'template', 'index', 'name')


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

    class Meta:
        model = ServiceBargain
        read_only_fields = ('poster', 'server', 'consumer')


class ChatSerializer(serializers.ModelSerializer):
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
