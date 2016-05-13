# coding=utf-8
from django.shortcuts import render
from django.views.generic import TemplateView
from survey.models import Survey
from utils.file import read_template_file_content

class IndexView(TemplateView):
	template_name = 'survey/index.html'

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		return context

class SurveyDetailView(TemplateView):
	template_name = 'survey/survey-base.html'

	def get_context_data(self, **kwargs):
		obj = Survey.objects.filter(main_category = self.kwargs['main_cat_pk'], \
			sub_category = self.kwargs['sub_cat_pk']).order_by('id').first()

		context = super(SurveyDetailView, self).get_context_data(**kwargs)

		if obj:
			context['survey_html'] = read_template_file_content(obj.html_path())
			context['survey_css'] = read_template_file_content(obj.css_path())
			context['survey_js'] = read_template_file_content(obj.js_path())
		return context
