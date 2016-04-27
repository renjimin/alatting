# coding=utf-8
from rest_framework import serializers
from alatting_website.model.resource import Image
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


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
