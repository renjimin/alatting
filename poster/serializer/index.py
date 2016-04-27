# coding=utf-8
from rest_framework import serializers
from alatting_website.model.poster import Poster
from alatting_website.models import Category, CategoryKeyword, Template


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category


class CategoryKeywordSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = CategoryKeyword


class TemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Template


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

