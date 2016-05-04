# coding=utf-8
from django.views.generic import TemplateView


class KeywordsView(TemplateView):
    template_name = 'poster/keywords.html'


class CreateFormView(TemplateView):
    template_name = 'poster/create-form.html'


class SelectTemplateView(TemplateView):
    template_name = 'poster/select-template.html'