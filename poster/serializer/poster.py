# coding=utf-8
from rest_framework import serializers
from alatting_website.model.poster import Poster, PosterPage
from alatting_website.serializer.edit_serializer import ImageSerializer
from poster.models import SystemImage, SystemMusic
from poster.serializer.resource import CategorySerializer, \
    CategoryKeywordSerializer, TemplateSerializer, AddressSerializer


class PosterSimpleInfoSerializer(serializers.ModelSerializer):
    thumb = serializers.SerializerMethodField()
    home_page = serializers.SerializerMethodField()
    views_count = serializers.SerializerMethodField()

    def get_thumb(self, obj):
        # todo:lyh:修改真实海报截图
        return '/media/images/2016/04/15/15588b5bb19f4518abb21269eccc9ba7.png'

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
