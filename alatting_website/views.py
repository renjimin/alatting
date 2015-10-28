import codecs
from django.shortcuts import render
from django.http.response import HttpResponse, HttpResponseNotFound
from django.views.generic import TemplateView, View
from django.views.generic.detail import DetailView
from django.core.urlresolvers import reverse
from alatting_website.models import Poster
from utils.db.utils import Utils
from utils.qrcode import QrCode
from utils.clip import SvgClip
from alatting_website.logic.poster_service import PosterService


class PosterView(DetailView):
    template_name = 'website/poster.html'
    model = Poster

    def get_queryset(self):
        queryset = super(PosterView, self).get_queryset()
        queryset = queryset.select_related('music').\
            prefetch_related('poster_images__image', 'poster_videos__video', 'poster_pages__template__template_regions')\
            .select_subclasses()
        return queryset

    def get_object(self, queryset=None):
        obj = super(PosterView, self).get_object(queryset)
        queryset = self.model.objects.filter(pk=obj.pk)
        Utils.increase_counts(queryset, {'views_count': 1})
        images = dict()
        videos = dict()
        for poster_image in obj.poster_images.all():
            images[poster_image.name] = poster_image.image
        for poster_video in obj.poster_videos.all():
            videos[poster_video.name] = poster_video.video
        obj.images = images
        obj.videos = videos
        poster_pages = obj.poster_pages.all()
        pages = [None for poster_page in poster_pages]
        regions = []
        for poster_page in poster_pages:
            pages[poster_page.index] = poster_page
            poster_regions = []
            for template_region in poster_page.template.template_regions.all():
                poster_regions.append(template_region)
                regions.append(template_region)
            poster_page.regions = poster_regions
        obj.pages = pages
        obj.regions = regions
        PosterService.parse_meida_file(obj.html.name, obj)
        return obj

    def get_context_data(self, **kwargs):
        context = super(PosterView, self).get_context_data(**kwargs)
        return context


class IndexView(TemplateView):
    template_name = 'website/index.html'


class DemoView(TemplateView):
    template_name = 'demo/bubble.html'


class PosterCodeView(View):
    def get(self, request, pk):
        response = HttpResponse(content_type='image/png')
        url = request.scheme + '://' + request.get_host()
        url += reverse('website:poster', kwargs={'pk': pk})
        QrCode.save_png(url, response)
        return response


class SvgClipView(View):
    def get(self, request, layout_id, shape_index):
        xml = SvgClip.create_svg_clip_xml(int(layout_id), int(shape_index))
        if xml is None:
            response = HttpResponseNotFound('not found')
        else:
            response = HttpResponse(xml, content_type='image/svg+xml')
        return response