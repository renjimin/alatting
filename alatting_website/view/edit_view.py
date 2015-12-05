import json
import pytz
import datetime
import os
from django.core.files.uploadedfile import UploadedFile, TemporaryUploadedFile
from django.utils.http import urlquote_plus, urlquote
from django.core.urlresolvers import reverse
from collections import OrderedDict
from django.views.generic import DetailView, CreateView
from django.db.models.query import Prefetch
from alatting_website.models import Poster, Rating, PosterStatistics, PosterPage
from alatting_website.logic.poster_service import PosterService
from utils.utils import Utils
from utils.views import LoginRequiredMixin
from django.conf import settings


class CreatePosterView(LoginRequiredMixin, CreateView):
    template_name = 'website/create.html'
    model = Poster
    fields = ('unique_name', 'main_category', 'sub_category', 'data', 'html', 'css', 'script')

    def get_success_url(self):
        url = reverse('website:edit', kwargs=dict(pk=self.object.id))
        return url

    def get_file(self, name):
        file = os.path.join(settings.MEDIA_ROOT, name)
        file = open(file, 'rb')
        size = os.fstat(file.fileno()).st_size
        file = UploadedFile(file=file, size=size, name=name, content_type='application/json', charset='utf-8')
        return file

    def get_form_kwargs(self):
        kwargs = super(CreatePosterView, self).get_form_kwargs()
        files = kwargs.get('files')
        if files is not None:
            if 'data' not in files:
                files['data'] = self.get_file('html5/poster.json')
            if 'html' not in files:
                files['html'] = self.get_file('html5/poster.html')
            if 'css' not in files:
                files['css'] = self.get_file('html5/poster.css')
            if 'script' not in files:
                files['script'] = self.get_file('html5/poster.js')
        return kwargs

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.creator = self.request.user
        return super(CreatePosterView, self).form_valid(form)


class EditView(DetailView):
    template_name = 'website/edit.html'
    model = Poster
    COMMENT_SIZE = 20

    def get_queryset(self):
        prefetch = Prefetch('poster_pages', PosterPage.objects.all().order_by('index'))
        queryset = super(EditView, self).get_queryset()
        queryset = queryset.select_related('music', 'creator__person',).\
            prefetch_related('poster_images__image', 'poster_videos__video', prefetch, 'poster_pages__template__template_regions')\
            .select_subclasses()
        return queryset

    def get_object(self, queryset=None):
        obj = super(EditView, self).get_object(queryset)
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
        PosterService.parse_media_file(obj.data.name, obj)
        # tailor mobile format, if no mobile then copy phone
        if not obj.mobile and obj.phone:
            obj.mobile = obj.phone
        if len(obj.mobile)<=10:
            obj.mobile = obj.mobile[:3]+'-'+obj.mobile[3:6]+'-'+obj.mobile[6:]
        # prepare email content to send
        url_detail = '\nquote:\n"'+obj.short_description+'\n'+Utils.get_current_url(self.request)+'\n"'
        title = obj.unique_name
        obj.email_content = 'subject=%s&body=%s' % ('To: '+urlquote(title, ''), urlquote(url_detail, ''))
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
            hours_all = json.loads(obj.lifetime_value,object_pairs_hook=OrderedDict)
            hours = None
            if obj.lifetime_type == 'weekly':
                """ e.g. {"Wednesday": {"disabled": 1, "time_start": "", "time_end": ""}, "Monday":
                {"time_start": "08:00:00", "enabled": 1, "time_end": "18:00:00"}, "Tuesday": {"
                enabled": 1, "time_start": "08:00:00", "time_end": "18:00:00"}}
                """
                # the lifetime value of hours must be json format, auto generated by program
                weekday = now.strftime('%A')# 'Monday', or 'Tuesday'
                hours = hours_all[weekday]
            elif obj.lifetime_type == 'specific_days':
                """e.g. {"2015-11-20": {"time_start": "08:00:00", "enabled": 1,
                "time_end": "21:00:00", "message": "Funding opening day and project demonstration"}}
                """
                if day_now in hours_all.keys():
                    hours = hours_all[day_now]
            if hours:
                if 'enabled' in hours and hours['enabled']:
                    if 'time_start' in hours and hours['time_start']:
                        time_start = timezone.localize(datetime.datetime.strptime(day_now+' '+hours['time_start'],'%Y-%m-%d %I:%M %p'))
                        time_end = timezone.localize(datetime.datetime.strptime(day_now+' '+hours['time_end'],'%Y-%m-%d %I:%M %p'))
                        hours_info = 'Hours Today: '+ time_start.strftime('%I:%M %p') + ' - ' + time_end.strftime('%I:%M %p')
                        if time_start <= now <= time_end:
                            hours_available = True

            # extract details of hours
            for day, day_hours in hours_all.items():
                if 'enabled' in day_hours and day_hours['enabled']:
                    if 'time_start' in day_hours and day_hours['time_start']:
                        hours_detail = day_hours['time_start'] + ' - '+day_hours['time_end']
                    else:
                        hours_detail =  '8:00 am - 6:00 pm'
                    if 'message'in day_hours and day_hours['message']:
                        hours_detail += '<br/>' + day_hours['message']
                else:
                    if 'time_start' in day_hours and day_hours['time_start']:
                        hours_detail = day_hours['time_start'] + ' - ' +\
                                                    day_hours['time_end'] + ' (closed temporarily)'
                    else:
                        hours_detail = 'closed'
                hours_details[day] = hours_detail
        except ValueError:
                None
        if hours_available:
            obj.hours_status = 'Open'
        else:
            obj.hours_status = 'Closed'
        obj.hours = hours_info
        obj.hours_details = hours_details
        # extract address info
        if obj.address:
            addr = obj.address
            obj.address_info = addr.address1 + ', ' + addr.city + ', ' + addr.state + ' ' + addr.post_code
            obj.address_mapped = (addr.address1 + ','+addr.city + ' '+addr.state).replace(' ', '+')
            obj.description_first_line = obj.short_description[:60]
            obj.description_others = obj.short_description[60:]

        return obj

    def get_context_data(self, **kwargs):
        context = super(EditView, self).get_context_data(**kwargs)
        return context