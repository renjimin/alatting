from django.http.response import HttpResponse, HttpResponseNotFound
from django.views.generic import TemplateView, View, FormView
from django.views.generic.detail import DetailView
from django.core.urlresolvers import reverse
from django.db.models.query import Prefetch
from django.utils.http import urlquote_plus, urlquote
from alatting_website.models import Poster, Rating
from utils.db.utils import Utils as DBUtils
from utils.utils import Utils
from utils.qrcode import QrCode
from utils.clip import SvgClip
from alatting_website.logic.poster_service import PosterService


class PosterView(DetailView):
    template_name = 'website/poster.html'
    model = Poster
    COMMENT_SIZE = 20

    def get_queryset(self):
        queryset = super(PosterView, self).get_queryset()
        queryset = queryset.select_related('music', 'creator__person', 'poster_rating').\
            prefetch_related('poster_images__image', 'poster_videos__video', 'poster_pages__template__template_regions',)\
            .select_subclasses()
        user = self.request.user
        if user.is_authenticated():
            queryset = queryset.prefetch_related(Prefetch('ratings', queryset=Rating.objects.filter(creator=user)))
        return queryset

    def get_object(self, queryset=None):
        obj = super(PosterView, self).get_object(queryset)
        # limit 20
        # obj.comments = obj.comment_set.all().select_related('creator').order_by('-created_at')[:self.COMMENT_SIZE]
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
        obj.capture = 'capture' in self.request.GET
        PosterService.parse_media_file(obj.html.name, obj)
        obj.image_url, obj.pdf_url = PosterService.capture(self.request, obj, force='force' in self.request.GET)
        obj.share = self.create_share(obj)
        user = self.request.user
        if user.is_authenticated():
            my_rating = obj.ratings.all()
            if my_rating:
                obj.my_rating = my_rating[0]
        # tailor mobile format, if no mobile then copy phone
        if not obj.mobile and obj.phone:
            obj.mobile = obj.phone
        if len(obj.mobile)<=10:
            obj.mobile = obj.mobile[:4]+'-'+obj.mobile[4:7]+'-'+obj.mobile[7:]
        # prepare email content to send
        url_detail = '\nquote:\n"'+obj.short_description+'\n'+Utils.get_current_url(self.request)+'\n"'
        title = obj.unique_name
        obj.email_content = 'subject=%s&body=%s' % ('To: '+urlquote(title, ''), urlquote(url_detail, ''))
        # extract hours details and check whether available currently
        if obj.lifetime_type == 'weekly':
            weekly_hours = json.loads(obj.lifetime_value) # the lifetime value of hours must be json format
            for day,hours in weekly_hours:
                None

        return obj

    def create_share(self, obj):
        share = Utils.create_object()
        share.title = obj.unique_name
        share.description = obj.short_description
        share.url = Utils.get_current_url(self.request)
        encoded_url = urlquote_plus(share.url)
        title = obj.unique_name
        encoded_title = urlquote_plus(title)
        encoded_detail = urlquote_plus(obj.short_description)
        url_detail = obj.short_description + '\n\n' + share.url
        encoded_url_detail = urlquote_plus(url_detail)
        share.image_url = Utils.get_url(self.request, PosterService.poster_image_url(obj))
        encoded_image_url = urlquote_plus(share.image_url)
        # email shouldn't encode space
        share.email = 'subject=%s&body=%s' % (urlquote(title, ''), urlquote(url_detail, ''))
        #
        share.fb = 'u=%s' % encoded_url
        #
        share.twitter = 'text=%s' % encoded_url_detail
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