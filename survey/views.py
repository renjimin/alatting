# coding=utf-8
from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.views.generic import TemplateView, RedirectView
from survey.models import *


class IndexView(TemplateView):
	template_name = 'survey/survey-base.html'

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		return context

class StartView(RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        return reverse('survey:questionnaire')

class QuestionnaireView(TemplateView):
	template_name = 'questionset.html'

	def get_context_data(self, **kwargs):
		context = super(QuestionnaireView, self).get_context_data(**kwargs)
		return context
		