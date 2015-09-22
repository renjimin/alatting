import codecs
from django.shortcuts import render
from django.http.response import HttpResponse
from django.views.generic import TemplateView, View
from django.views.generic.detail import DetailView
from django.core.urlresolvers import reverse
from alatting_website.models import Poster
from utils.db.utils import Utils
from utils.qrcode import QrCode


class PosterView(DetailView):
    template_name = 'website/poster.html'
    model = Poster

    def get_queryset(self):
        queryset = super(PosterView, self).get_queryset()
        queryset = queryset.select_related('music').\
            prefetch_related('poster_images__image', 'poster_videos__video').select_subclasses()
        return queryset

    def get_object(self, queryset=None):
        obj = super(PosterView, self).get_object(queryset)
        queryset = self.model.objects.filter(pk=obj.pk)
        Utils.increase_counts(queryset, {'views_count': 1})
        images = dict()
        videos = dict()
        for poster_image in obj.poster_images.all():
            images[poster_image.image.id] = poster_image.image
        for poster_video in obj.poster_videos.all():
            videos[poster_video.video.id] = poster_video.video
        obj.images = images
        obj.videos = videos
        return obj


class IndexView(TemplateView):
    template_name = 'website/swipe_photo.html'


class PosterCodeView(View):
    def get(self, request, pk):
        response = HttpResponse(content_type='image/png')
        url = request.scheme + '://' + request.get_host()
        url += reverse('website:poster', kwargs={'pk': pk})
        QrCode.save_png(url, response)
        return response