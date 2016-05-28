# coding=utf-8

from django.views.generic import TemplateView, DetailView
from alatting_website.model.poster import Poster


class PosterShowFrameView(DetailView):
    model = Poster
    queryset = Poster.objects.filter(
        status=Poster.STATUS_PUBLISHED
    )
    template_name = 'poster/pc/showpc.html'
