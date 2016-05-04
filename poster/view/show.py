# coding=utf-8
from django.views.generic import DetailView
from alatting_website.model.poster import Poster


class PosterView(DetailView):
    model = Poster
    template_name = 'poster/poster.html'

