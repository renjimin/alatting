# coding=utf-8
from django.views.generic import DetailView
from alatting_website.model.poster import Poster, PosterPage


class PosterView(DetailView):
    model = Poster
    template_name = 'poster/poster.html'
    queryset = Poster.objects.filter(
        status=Poster.STATUS_PUBLISHED
    )

    def get_context_data(self, **kwargs):
        ctx = super(PosterView, self).get_context_data(**kwargs)
        pages = PosterPage.objects.filter(
            poster=self.object
        ).order_by('index')
        ctx['pages'] = pages
        ctx['index_page'] = pages.first()
        return ctx

