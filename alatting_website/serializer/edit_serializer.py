from rest_framework import serializers
from alatting_website.models import Poster, Image, Video, Music, PosterPage, Template, TemplateRegion, PosterImage,\
    PosterVideo, PageText
from alatting_website.serializer.template_serializer import TemplateRegionSerializer


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


class TemplateSerializer(serializers.ModelSerializer):
    template_regions = TemplateRegionSerializer(many=True)

    class Meta:
        model = Template


class PageTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageText


class PosterPageSerializer(serializers.ModelSerializer):
    template = TemplateSerializer()
    page_texts= PageTextSerializer(many=True)

    class Meta:
        model = PosterPage


class EditSerializer(serializers.ModelSerializer):
    music = MusicSerializer()
    poster_images = PosterImageSerializer(many=True)
    poster_videos = PosterVideoSerializer(many=True)
    poster_pages = PosterPageSerializer(many=True)
    # images = serializers.DictField(child=ImageSerializer())
    # videos = serializers.DictField(child=VideoSerializer())
    # pages = PosterPageSerializer(many=True)
    # regions = TemplateRegionSerializer(many=True)

    class Meta:
        model = Poster


class TemplatesHTMLSerializer(serializers.Serializer):
    style = serializers.CharField()
    svg = serializers.CharField()
