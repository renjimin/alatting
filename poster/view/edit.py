# coding=utf-8
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView
from alatting_website.model.poster import Poster


class PosterEditView(DetailView):
    model = Poster
    template_name = 'poster/edit.html'
    context_object_name = 'poster'

    # def get_object(self, queryset=None):
    #     return get_object_or_404(Poster, pk=self.kwargs['pk'])