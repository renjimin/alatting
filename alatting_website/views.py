import codecs
# codecs is not used in this views.py,suggest to remove this import
from django.shortcuts import render
# render is not used in this views.py,suggest to remove
from django.http.response import HttpResponse, HttpResponseNotFound
from django.views.generic import TemplateView, View, FormView
from django.views.generic.detail import DetailView
from django.core.urlresolvers import reverse
from django.utils.http import urlquote
from alatting_website.models import Poster
from utils.db.utils import Utils as DBUtils
from utils.utils import Utils
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
        DBUtils.increase_counts(queryset, {'views_count': 1})
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
        PosterService.parse_media_file(obj.html.name, obj)
        obj.image_url, obj.pdf_url = PosterService.capture(self.request, obj, force='capture' in self.request.GET)
        obj.share = self.create_share(obj)
        return obj

    def create_share(self, obj):
        share = Utils.create_object()
        share.title = obj.unique_name
        share.description = obj.short_description
        share.url = Utils.get_current_url(self.request)
        encoded_url = urlquote(share.url)
        encoded_title = urlquote(obj.unique_name)
        encoded_detail = urlquote(obj.short_description)
        encoded_url_detail = urlquote(obj.short_description + '\n\n' + share.url)
        share.image_url = Utils.get_url(self.request, PosterService.poster_image_url(obj))
        encoded_image_url = urlquote(share.image_url)
        #
        share.email = 'subject=%s&body=%s' % (encoded_title, encoded_url_detail)
        #
        share.fb = 'u=%s' % encoded_url
        #
        share.twitter = 'status=%s' % encoded_url_detail
        #
        share.google_plus = 'url=%s' % encoded_url
        #
        share.linkedin = 'url=%s&title=%s&summary=%s' % (encoded_url, encoded_title, encoded_detail)
        #
        share.pinterest = 'url=%s&media=%s&description=%s' % (encoded_url, encoded_image_url, encoded_detail)
        return share

    def get_context_data(self, **kwargs):
        context = super(PosterView, self).get_context_data(**kwargs)
        return context


class IndexView(TemplateView):
    template_name = 'website/index.html'


class DemoView(TemplateView):
    template_name = 'demo/bubble.html'

from utils.capture.screen_shot import ScreenShot


class CaptureView(FormView):
    from alatting_website.forms import CaptureForm
    form_class = CaptureForm
    template_name = 'demo/capture.html'

    def form_valid(self, form):
        path = ScreenShot.test(form.cleaned_data['url'])
        with open(path, "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")


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