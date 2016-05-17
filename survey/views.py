# coding=utf-8
from django.shortcuts import render_to_response, \
get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.views.generic import View, TemplateView, RedirectView
from django.views.generic.edit import FormView
from django.template import RequestContext
from survey.models import *
from django.contrib.auth.models import User

class IndexView(TemplateView):
	template_name = 'survey/survey-base.html'

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		return context

class StartView(RedirectView):
	def get_redirect_url(self, *args, **kwargs):
		qu = get_object_or_404(Questionnaire, id=self.kwargs['questionnaire_id'])
		qs = qu.questionsets()[0]

		su = get_object_or_404(User, pk=self.kwargs['user_id'])

		run = RunInfo(subject=su, questionset=qs)
		run.save()

		kwargs = {'runid': run.id}
		return reverse('survey:questionnaire', kwargs=kwargs)

class QuestionnaireDoneView(TemplateView):
	template_name = 'questionset_done.html'

	def get_context_data(self, **kwargs):
		context = super(QuestionnaireDoneView, self).get_context_data(**kwargs)
		return context

class QuestionnaireView(View):
	def get(self, request, **kwargs):
		runid = self.kwargs['runid']
		runinfo = RunInfo.objects.get(pk=runid)
		questionset = runinfo.questionset
		main_cat_name = questionset.questionnaire.main_category.name
		sub_cat_name = questionset.questionnaire.sub_category.name
		questions = runinfo.questionset.questions()
		qlist = []
		for question in questions:
			Type = question.get_type()
			qdict = {
				'template': 'questionnaire/%s.html' % (Type),
				'qtype': Type,
			}
			qlist.append((question, qdict))

		contextdict = {'runid': self.kwargs['runid'],
						'main_cat_name': main_cat_name,
						'sub_cat_name': sub_cat_name,
						'questionset': questionset,
						'qlist': qlist}
		return render_to_response('questionset.html', contextdict)

	def post(self, request, **kwargs):
		return HttpResponseRedirect(reverse('survey:questionnairedone'))





