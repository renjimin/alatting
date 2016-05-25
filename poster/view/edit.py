# coding=utf-8
from django.core.exceptions import PermissionDenied
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView
from alatting_website.model.poster import Poster, PosterPage
from alatting_website.models import CategoryKeyword


class PosterEditView(DetailView):
    model = PosterPage
    template_name = 'poster/edit/edit.html'

    def get_object(self, queryset=None):
        poster = Poster.objects.filter(
            pk=self.kwargs.get('poster_pk'),
            creator=self.request.user
        ).first()
        if not poster:
            raise PermissionDenied
        return get_object_or_404(
            PosterPage,
            pk=self.kwargs.get('pk'),
            poster=poster
        )

    def get_context_data(self, **kwargs):
        ctx = super(PosterEditView, self).get_context_data(**kwargs)
        ctx['poster'] = self.object.poster
        ctx['categorykeyword_list'] = CategoryKeyword.objects.filter(
            category_id=self.object.poster.sub_category_id
        ).order_by('verb', 'noun')
        return ctx
