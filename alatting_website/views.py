# coding=utf-8

from django.http.response import HttpResponse, HttpResponseNotFound
from django.shortcuts import redirect
from django.views.generic import TemplateView, View, FormView, ListView
from django.views.generic.detail import DetailView
from django.core.urlresolvers import reverse
from django.db.models.query import Prefetch
from django.utils.http import urlquote_plus, urlquote
from alatting_website.model.poster import PosterMoreLink
from alatting_website.models import Poster, Rating, PosterStatistics, Category
from alatting_website.model.statistics import PosterLike, PosterFun, PosterFavorites, PosterSubscribe
from utils.db.utils import Utils as DBUtils
from utils.utils import Utils
from utils.qrcode import QrCode
from utils.clip import SvgClip
from alatting_website.logic.poster_service import PosterService
import datetime, pytz, json
from collections import OrderedDict


def get_first_category_list():
    return Category.objects.filter(parent__isnull=True).order_by('name')


class IndexView(TemplateView):
    template_name = 'alatting_website/index.html'

    def get_poster_sort_keys(self):
        req_sort = self.request.GET.get('sort', '')
        sort_key = ''
        if req_sort in ['hot', 'new']:
            if req_sort == 'hot':
                sort_key = '-poster_statistics__views_count'
            elif req_sort == 'new':
                sort_key = '-created_at'
        return sort_key

    def get_poster_list(self):
        qs = Poster.objects.filter(
            status=Poster.STATUS_PUBLISHED
        ).order_by('-created_at')
        sort_key = self.get_poster_sort_keys()
        if sort_key:
            qs = qs.order_by(sort_key)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super(IndexView, self).get_context_data(**kwargs)
        ctx['posters'] = self.get_poster_list()
        ctx['categorys'] = get_first_category_list()
        return ctx


class IndexCategoryView(TemplateView):
    template_name = 'alatting_website/index-category.html'

    def get_poster_sort_keys(self):
        req_sort = self.request.GET.get('sort', '')
        sort_key = ''
        if req_sort in ['hot', 'new']:
            if req_sort == 'hot':
                sort_key = '-poster_statistics__views_count'
            elif req_sort == 'new':
                sort_key = '-created_at'
        return sort_key

    def get_poster_list(self):
        qs = Poster.objects.filter(
            status=Poster.STATUS_PUBLISHED
        ).order_by('-created_at')
        cat_filter_key = self.request.GET.get('category', '')
        if cat_filter_key:
            qs = qs.filter(main_category  = cat_filter_key)
        sub_cat_filter_keys = self.request.GET.getlist('subcategory', '')
        if sub_cat_filter_keys:
            qs = qs.filter(sub_category__in = sub_cat_filter_keys)
        sort_key = self.get_poster_sort_keys()
        if sort_key:
            qs = qs.order_by(sort_key)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super(IndexCategoryView, self).get_context_data(**kwargs)
        ctx['posters'] = self.get_poster_list()
        ctx['categorys'] = get_first_category_list()
        return ctx


class PosterView(DetailView):
    template_name = 'website/poster.html'
    model = Poster
    COMMENT_SIZE = 20

    def get_queryset(self):
        queryset = super(PosterView, self).get_queryset()
        queryset = queryset.select_related(
            'creator__person',
            'poster_statistics', 'history_statistics'
        ).prefetch_related(
            'poster_images__image', 'poster_videos__video',
            'poster_pages__template__template_regions',
            'poster_more_links'
        ).select_subclasses()
        user = self.request.user
        if user.is_authenticated():
            queryset = queryset.prefetch_related(
                Prefetch(
                    'ratings',
                    queryset=Rating.objects.filter(creator=user)
                )
            )
            queryset = queryset.prefetch_related(
                Prefetch(
                    'poster_likes',
                    queryset=PosterLike.objects.filter(creator=user)
                )
            )
            queryset = queryset.prefetch_related(
                Prefetch(
                    'poster_favorites',
                    queryset=PosterFavorites.objects.filter(creator=user)
                )
            )
            queryset = queryset.prefetch_related(
                Prefetch(
                    'poster_subscriptions',
                    queryset=PosterSubscribe.objects.filter(follower=user)
                )
            )
        ip=Utils.get_client_ip(self.request)
        queryset = queryset.prefetch_related(
            Prefetch(
                'poster_funs',
                queryset=PosterFun.objects.filter(ip_address=ip)
            )
        )

        return queryset

    def get_object(self, queryset=None):
        obj = super(PosterView, self).get_object(queryset)
        # limit 20
        # obj.comments = obj.comment_set.all().select_related(
        # 'creator'
        # ).order_by('-created_at')[:self.COMMENT_SIZE]
        # stats
        queryset = PosterStatistics.objects.filter(pk=obj.pk)        
        fields = dict(views_count=1)
        if 'scan' in self.request.GET:
            fields['scans_count'] = 1
        DBUtils.increase_counts(queryset, fields)
        # orgnize elements
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

        poster_links = obj.poster_more_links.all().order_by('index', 'name')
        obj.more_links = poster_links

        if obj.html:
            PosterService.parse_media_file(obj.html.name, obj)
        
        obj.share = self.create_share(obj)
        user = self.request.user
        if user.is_authenticated():
            my_rating = obj.ratings.all()
            if my_rating:
                obj.my_rating = my_rating[0]
        # tailor mobile format, if no mobile then copy phone
        if not obj.mobile and obj.phone:
            obj.mobile = obj.phone
        if len(obj.mobile) <= 10:
            obj.mobile = '%s-%s-%s' % (
                obj.mobile[:3], obj.mobile[3:6], obj.mobile[6:]
            )
        # prepare email content to send
        url_detail = '\nquote:\n"%s\n%s\n"' % (
            obj.short_description,
            Utils.get_current_url(self.request)
        )
        title = obj.logo_title
        obj.email_content = 'subject=%s&body=%s' % (
            'To: ' + urlquote(title, ''),
            urlquote(url_detail, '')
        )
        # extract hours details and check whether available currently
        now = datetime.datetime.now(tz=pytz.utc)
        timezone = pytz.timezone(obj.lifetime_timezone)
        now = now.astimezone(timezone)
        day_now = now.strftime('%Y-%m-%d')
        obj.day_now = day_now
        hours_available = False
        hours_info = 'Hours Today: Disabled'
        hours_details = OrderedDict()
        try:
            hours_all = json.loads(obj.lifetime_value,
                                   object_pairs_hook=OrderedDict)
            hours = None
            if obj.lifetime_type == 'weekly':
                """ e.g.
                {
                    "Wednesday": {"disabled": 1, "time_start": "",
                                "time_end": ""},
                    "Monday": {"time_start": "08:00:00", "enabled": 1,
                                "time_end": "18:00:00"},
                    "Tuesday": {"enabled": 1, "time_start": "08:00:00",
                                "time_end": "18:00:00"}
                }
                """
                # the lifetime value of hours must be json format,
                # auto generated by program
                weekday = now.strftime('%A')    # 'Monday', or 'Tuesday'
                hours = hours_all[weekday]
            elif obj.lifetime_type == 'specific_days':
                """e.g.
                {
                "2015-11-20": {
                    "time_start": "08:00:00", "enabled": 1,
                    "time_end": "21:00:00",
                    "message": "Funding opening day and project demonstration"
                    }
                }
                """
                if day_now in hours_all.keys():
                    hours = hours_all[day_now]
            if hours:
                if 'enabled' in hours and hours['enabled']:
                    if 'time_start' in hours and hours['time_start']:
                        time_start = timezone.localize(
                            datetime.datetime.strptime(
                                day_now+' '+ hours['time_start'],
                                '%Y-%m-%d %I:%M %p'
                            )
                        )
                        time_end = timezone.localize(
                            datetime.datetime.strptime(
                                day_now+' '+hours['time_end'],
                                '%Y-%m-%d %I:%M %p')
                        )
                        hours_info = 'Hours Today: %s - %s' % (
                            time_start.strftime('%I:%M %p'),
                            time_end.strftime('%I:%M %p')
                        )
                        if time_start <= now <= time_end:
                            hours_available = True

            # extract details of hours
            for day, day_hours in hours_all.items():
                if 'enabled' in day_hours and day_hours['enabled']:
                    if 'time_start' in day_hours and day_hours['time_start']:
                        hours_detail = '%s - %s' % (
                            day_hours['time_start'], day_hours['time_end']
                        )
                    else:
                        hours_detail = '8:00 am - 6:00 pm'
                    if 'message'in day_hours and day_hours['message']:
                        hours_detail += '<br/>' + day_hours['message']
                else:
                    if 'time_start' in day_hours and day_hours['time_start']:
                        hours_detail = '%s - %s (closed temporarily)' % (
                            day_hours['time_start'],
                            day_hours['time_end']
                        )
                    else:
                        hours_detail = 'closed'
                hours_details[day] = hours_detail
        except ValueError:
                pass

        obj.hours_status = 'Open' if hours_available else 'Closed'
        obj.hours = hours_info
        obj.hours_details = hours_details
        # extract address info
        addr = obj.address
        obj.address_info = '%s, %s, %s %s' % (
            addr.address1, addr.city, addr.state, addr.post_code
        )
        obj.address_mapped = ('%s,%s %s' % (addr.address1,
                                            addr.city,
                                            addr.state)).replace(' ', '+')
        obj.description_first_line = obj.short_description[:60]
        obj.description_others = obj.short_description[60:]
        req_cookie = self.request.COOKIES


        if not obj.poster_funs.all():
            obj.abutton_fun_enabled = 1
        else:
            obj.abutton_fun_enabled = 0

        user = self.request.user
        if user.is_authenticated() and obj.poster_likes.all():
            obj.abutton_like_enabled = 0
        else:
            obj.abutton_like_enabled = 1
        if user.is_authenticated() and obj.poster_favorites.all():
            obj.abutton_bookmark_enabled = 0
        else:
            obj.abutton_bookmark_enabled = 1
        if user.is_authenticated() and obj.poster_subscriptions.all():
            obj.abutton_subscribe_enabled = 0
        else:
            obj.abutton_subscribe_enabled = 1

        return obj

    def create_share(self, obj):
        share = Utils.create_object()
        share.title = obj.logo_title
        share.description = obj.short_description
        share.url = Utils.get_current_url(self.request)
        encoded_url = urlquote_plus(share.url)
        title = obj.logo_title
        encoded_title = urlquote_plus(title)
        encoded_detail = urlquote_plus(obj.short_description)
        url_detail = obj.short_description + '\n\n' + share.url
        encoded_url_detail = urlquote_plus(url_detail)
        share.image_url = Utils.get_url(
            self.request,
            PosterService.poster_image_url(obj)
        )
        encoded_image_url = urlquote_plus(share.image_url)
        # email shouldn't encode space
        share.email = 'subject=%s&body=%s' % (
            urlquote(title, ''), urlquote(url_detail, '')
        )
        #
        share.fb = 'u=%s' % encoded_url
        #
        share.twitter = 'text=%s' % encoded_url_detail
        #
        share.google_plus = 'url=%s' % encoded_url
        #
        share.linkedin = 'url=%s&title=%s&summary=%s' % (
            encoded_url, encoded_title, encoded_detail
        )
        #
        share.pinterest = 'url=%s&media=%s&description=%s' % (
            encoded_url, encoded_image_url, encoded_detail
        )
        return share

    def get_context_data(self, **kwargs):
        context = super(PosterView, self).get_context_data(**kwargs)
        return context


class TestView(TemplateView):
    # def get(self, request):
    #   from alatting_website.logic.poster_service import PosterService
    #  ret = PosterService.collect_statistics()
    #  return HttpResponse('OK: %s' % ret)
    template_name = 'demo/test1.html'


class DemoView(TemplateView):
    template_name = 'demo/ng_repeat.html'


from utils.capture.screen_shot import ScreenShot


class CaptureView(FormView):
    from alatting_website.forms import CaptureForm
    form_class = CaptureForm
    template_name = 'demo/capture.html'

    def form_valid(self, form):
        path = ScreenShot.test(form.cleaned_data['url'])
        with open(path, "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")


class PosterCaptureView(View):
    def get(self, request, pk):
        current_poster = Poster.objects.get(pk=pk)
        image_url, pdf_url = PosterService.capture(
                self.request, current_poster, force='force' in self.request.GET
        )
        data = {}
        data['image_url'] = image_url
        data['pdf_url'] = pdf_url
        response = HttpResponse(json.dumps(data), content_type = "application/json")
        return response


class PosterCodeView(View):
    def get(self, request, pk):
        response = HttpResponse(content_type='image/png')
        url = request.scheme + '://' + request.get_host()
        url += reverse('website:poster', kwargs={'pk': pk})
        # url += '?scan=1'
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


class PosterListView(ListView):
    model = Poster
    template_name = 'web/posters.html'
    queryset = Poster.objects.filter(
        status=Poster.STATUS_PUBLISHED
    )

    def get_poster_sort_keys(self):
        req_sort = self.request.GET.get('sort', '')
        sort_key = ''
        if req_sort in ['hot', 'new', 'recommend']:
            if req_sort == 'hot':
                sort_key = '-poster_statistics__views_count'
            elif req_sort == 'new':
                sort_key = '-created_at'
        return sort_key

    def get_queryset(self):
        qs = Poster.objects.filter(
            status=Poster.STATUS_PUBLISHED
        ).order_by('-created_at')
        sort_key = self.get_poster_sort_keys()
        if sort_key:
            qs = qs.order_by(sort_key)
        return qs
