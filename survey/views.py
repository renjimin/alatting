# coding=utf-8
from django.shortcuts import render_to_response, \
get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.views.generic import View, TemplateView, RedirectView
from django.views.generic.edit import FormView
from django.template import RequestContext
from django.contrib.auth.models import User
from survey.models import *
from survey import QuestionProcessors


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
		qs_title = questionset.heading
		questions = runinfo.questionset.questions()
		qlist = []
		for question in questions:
			Type = question.get_type()
			qdict = {
				'template': 'questionnaire/%s.html' % (Type),
				'qtype': Type,
			}
			if Type in QuestionProcessors:
				qdict.update(QuestionProcessors[Type](request, question))
			qlist.append((question, qdict))

		contextdict = {'runid': self.kwargs['runid'],
						'main_cat_name': main_cat_name,
						'sub_cat_name': sub_cat_name,
						'qs_title': qs_title,
						'questionset': questionset,
						'qlist': qlist}
		return render_to_response('questionset.html', contextdict)

	def post(self, request, **kwargs):
		runid = self.kwargs['runid']
		runinfo = RunInfo.objects.get(pk=runid)
		questionset = runinfo.questionset
		questionnaire = questionset.questionnaire

		items = request.POST.items()
		extra = {}
		# generate the answer_dict for each question, and place in extra
		for item in items:
			key, value = item[0], item[1]
			if key.startswith('question_'):
				answer = key.split("_", 2)
			question = Question.objects.filter(sortid=answer[1], 
				questionset=questionset, 
				questionset__questionnaire=questionnaire).first()
			if not question:
				continue
			if (len(answer) == 2):
				ans = value
			else:
				continue
			extra[question] = ans
		for question, ans in extra.items():
			answer = Answer()
			answer.question = question
			answer.answer = ans
			answer.subject = runinfo.subject	
			answer.runid = runinfo.pk	
			Answer.objects.filter(subject=runinfo.subject, 
				runid=runinfo.pk, question=question).delete()
			answer.save()

		next = questionset.next()
		runinfo.questionset = next
		runinfo.save()

		if next:
			kwargs = {'runid': runinfo.id}
			return HttpResponseRedirect(reverse('survey:questionnaire', kwargs=kwargs))

		return HttpResponseRedirect(reverse('survey:questionnairedone'))





