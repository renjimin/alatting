# coding=utf-8
from django.shortcuts import render
from django.views.generic import TemplateView

class IndexView(TemplateView):
	template_name = 'survey/survey-base.html'

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		return context

