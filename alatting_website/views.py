import codecs
from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from alatting_website.models import Poster
from django.conf import settings


class PosterView(DetailView):
    template_name = 'front/poster.html'
    model = Poster

    def get_queryset(self):
        queryset = super(PosterView, self).get_queryset()
        queryset = queryset.select_related('music').\
            prefetch_related('poster_images__image', 'poster_videos__video').select_subclasses()
        return queryset

    def get_object(self, queryset=None):
        obj = super(PosterView, self).get_object(queryset)
        images = dict()
        videos = dict()
        for poster_image in obj.poster_images.all():
            images[poster_image.image.id] = poster_image.image
        for poster_video in obj.poster_videos.all():
            videos[poster_video.video.id] = poster_video.video
        obj.images = images
        obj.videos = videos
        self.template_name = obj.html.name
        return obj
