# coding=utf-8
from django.views.generic import TemplateView
from django.views.generic.list import ListView
from alatting_website.models import Template, CategoryKeyword


class CategoryKeywordsView(ListView):
    model = CategoryKeyword
    template_name = 'poster/keywords.html'
    queryset = CategoryKeyword.objects.all()

    def get_queryset(self):
        qs = super(CategoryKeywordsView, self).get_queryset()

        return qs.filter(
            category_id=self.request.POST.get('category_id')
        ).order_by('verb', 'noun')


class CreateFormView(TemplateView):
    template_name = 'poster/create-form.html'


class SelectTemplateView(ListView):
    model = Template
    template_name = 'poster/select-template.html'
    queryset = Template.objects.all()
