# coding=utf-8
from django.views.generic import TemplateView
from django.views.generic.list import ListView
from alatting_website.models import Template


class KeywordsView(TemplateView):
    template_name = 'poster/keywords.html'


class CreateFormView(TemplateView):
    template_name = 'poster/create-form.html'


class SelectTemplateView(ListView):
    model = Template
    template_name = 'poster/select-template.html'

    def get_context_data(self, **kwargs):
        context = super(SelectTemplateView, self).get_context_data(**kwargs)
        return context
