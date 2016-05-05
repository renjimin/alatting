# coding=utf-8
from django.core.urlresolvers import reverse_lazy, reverse
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView, CreateView
from django.views.generic.list import ListView
from alatting_website.model.poster import Poster
from alatting_website.models import Template, CategoryKeyword, Address
from poster.serializer.resource import AddressSerializer


class CategoryKeywordsView(ListView):
    model = CategoryKeyword
    template_name = 'poster/keywords.html'
    queryset = CategoryKeyword.objects.all()

    def get_queryset(self):
        qs = super(CategoryKeywordsView, self).get_queryset()

        return qs.filter(
            category_id=self.request.POST.get('category_id')
        ).order_by('verb', 'noun')


class CreateFormView(CreateView):
    model = Poster
    template_name = 'poster/create-form.html'
    fields = ['unique_name', 'logo_image', 'short_description',
              'phone', 'mobile', 'email', 'main_category',
              'sub_category']

    def form_valid(self, form):
        address = Address()
        address.address1 = self.request.POST.get('address')
        address.save()
        address.refresh_from_db()
        obj = form.instance
        obj.creator_id = self.request.user.id,
        obj.status = Poster.STATUS_DRAFT,
        obj.address = address
        keywords = self.request.POST.get('keywords', '').split(',')
        for kid in keywords:
            try:
                keyword = get_object_or_404(CategoryKeyword, id=kid)
                obj.poster_keywords.add(keyword)
            except:
                pass

        return super(CreateFormView, self).form_valid(form)

    def get_success_url(self):
        return '%s?poster_id=%s' % (
            reverse('poster:select_template'),
            self.object.id
        )

    def post(self, request, *args, **kwargs):
        return super(CreateFormView, self).post(request, *args, **kwargs)


class SelectTemplateView(ListView):
    model = Template
    template_name = 'poster/select-template.html'
    queryset = Template.objects.all()
