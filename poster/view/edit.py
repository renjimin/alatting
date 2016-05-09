# coding=utf-8
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView
from alatting_website.model.poster import Poster, PosterPage


class PosterEditView(DetailView):
    model = PosterPage
    template_name = 'poster/edit.html'

    def get_context_data(self, **kwargs):
        ctx = super(PosterEditView, self).get_context_data(**kwargs)
        ctx['poster'] = self.object.poster
        return ctx
