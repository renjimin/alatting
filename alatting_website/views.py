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
        queryset = queryset.select_subclasses()
        return queryset

    def get_object(self, queryset=None):
        obj = super(PosterView, self).get_object(queryset)
        self.template_name = obj.html.name
        return obj
