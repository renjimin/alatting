# coding=utf-8
from rest_framework import serializers
from alatting_website.model.resource import Image
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

    def get_image_url(self, obj):
        return '/media/{}'.format(obj.image.file.name)

    class Meta:
        model = Template
        fields = ('id', 'name', 'image_url')


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address