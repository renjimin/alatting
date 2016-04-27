# coding=utf-8
from rest_framework import serializers
from alatting_website.model.poster import Poster
from poster.serializer.resource import CategorySerializer, ImageSerializer


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
    main_category = CategorySerializer()
    sub_category = CategorySerializer()
    logo_image = ImageSerializer()
    logo_image_id = serializers.IntegerField(write_only=True)

    def get_logo_image_url(self, obj):
        return obj.logo_image.file.url if obj.logo_image else ''

    class Meta:
        model = Poster
        exclude = ('data', 'html', 'css', 'script')
        read_only_fields = ('created_at', 'creator')