from rest_framework import serializers
from alatting_website.models import Poster, Image, Video, Music, PosterPage, Template, TemplateRegion, PosterImage,\
    PosterVideo


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image


class PosterImageSerializer(serializers.ModelSerializer):
    image = ImageSerializer()

    class Meta:
        model = PosterImage


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video


class PosterVideoSerializer(serializers.ModelSerializer):
    video = VideoSerializer()

    class Meta:
        model = PosterVideo


class MusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Music


class TemplateRegionSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField()
    element_id = serializers.CharField()
    path_id = serializers.CharField()
    points = serializers.CharField()

    class Meta:
        model = TemplateRegion


class TemplateSerializer(serializers.ModelSerializer):
    template_regions = TemplateRegionSerializer(many=True)

    class Meta:
        model = Template


class PosterPageSerializer(serializers.ModelSerializer):
    template = TemplateSerializer()
    regions = TemplateRegionSerializer(many=True)

    class Meta:
        model = PosterPage


class EditSerializer(serializers.ModelSerializer):
    music = MusicSerializer()
    # poster_images = PosterImageSerializer(many=True)
    # poster_videos = PosterVideoSerializer(many=True)
    # poster_pages = PosterPageSerializer(many=True)
    images = serializers.DictField(child=ImageSerializer())
    videos = serializers.DictField(child=VideoSerializer())
    pages = PosterPageSerializer(many=True)
    regions = TemplateRegionSerializer(many=True)

    class Meta:
        model = Poster


class TemplatesHTMLSerializer(serializers.Serializer):
    style = serializers.CharField()
    svg = serializers.CharField()
