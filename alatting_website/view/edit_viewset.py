from django.db.models.query import Prefetch
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework import permissions
from alatting_website.models import Poster, PosterPage
from alatting_website.serializer.template_serializer import TemplateSerializer
from alatting_website.serializer.edit_serializer import EditSerializer, TemplatesHTMLSerializer


class EditViewSet(viewsets.GenericViewSet):
    queryset = Poster.objects.all()
    serializer_class = EditSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        queryset = self.queryset.filter(creator=self.request.user)
        queryset = queryset.select_related('music', 'creator__person',).\
            prefetch_related('poster_images__image', 'poster_videos__video', 'poster_pages__template__template_regions')\
            .select_subclasses()
        self.queryset = queryset
        queryset = super(EditViewSet, self).get_queryset()
        return queryset

    def get_object(self):
        self.lookup_url_kwarg = 'poster_id'
        obj = super(EditViewSet, self).get_object()
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
        return obj

    @list_route(methods=('get',))
    def poster(self, request, *args, **kwargs):
        return viewsets.mixins.RetrieveModelMixin.retrieve(self, request, *args, **kwargs)

    @list_route(methods=('get',), serializer_class=TemplatesHTMLSerializer)
    def templates_html(self, request, *args, **kwargs):
        self.queryset = self.queryset.prefetch_related('poster_pages__template__template_regions')
        obj = self.get_object()
