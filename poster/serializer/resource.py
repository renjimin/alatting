# coding=utf-8
from rest_framework import serializers
from alatting_website.model.resource import Image, Video, Music
from alatting_website.models import Category, CategoryKeyword, Template, \
    Address


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category


class CategoryKeywordSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = CategoryKeyword


class TemplateSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    file_exists = serializers.SerializerMethodField()

    def get_file_exists(self, obj):
        return obj.static_file_exists()

    def get_image_url(self, obj):
        try:
            return '/media/{}'.format(obj.image.file.name)
        except Exception:
            return ''

    class Meta:
        model = Template
        fields = ('id', 'name', 'image_url', 'file_exists')


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video


class MusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Music