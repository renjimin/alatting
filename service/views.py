# coding=utf-8

from django.shortcuts import render
from django.views.generic import ListView
from alatting_website.model.poster import Poster
from alatting_website.models import Category


class ServiceIndexListView(ListView):
    model = Poster
    template_name = 'service/index.html'
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
        if self.request.GET.get('q'):
            qs = qs.filter(
                unique_name__contains=self.request.GET.get('q')
            )
        sort_key = self.get_poster_sort_keys()
        if sort_key:
            qs = qs.order_by(sort_key)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super(ServiceIndexListView, self).get_context_data(**kwargs)
        ctx['categorys'] = Category.objects.filter(
            parent__isnull=True
        ).order_by('name')
        return ctx