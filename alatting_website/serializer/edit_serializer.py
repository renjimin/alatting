from rest_framework import serializers
from alatting_website.models import Poster


class EditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poster


class TemplatesHTMLSerializer(serializers.Serializer):
    style = serializers.CharField()
    svg = serializers.CharField()
