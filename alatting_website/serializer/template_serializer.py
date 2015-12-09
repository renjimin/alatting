from rest_framework import serializers
from alatting_website.models import Template, TemplateRegion


class TemplateRegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateRegion


class TemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Template


class RetrieveTemplateSerializer(serializers.ModelSerializer):
    template_regions = TemplateRegionSerializer(many=True)

    class Meta:
        model = Template
