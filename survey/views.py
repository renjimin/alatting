# coding=utf-8
import datetime               
from django.shortcuts import render_to_response, \
get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.views.generic import View, TemplateView, RedirectView
from django.views.generic.edit import FormView
from django.template import RequestContext
from django.contrib.auth.models import User
from survey.models import *
from survey import *

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
	def show_questionnaire(self, request, runinfo, errors={}):
		questionset = runinfo.questionset
		questionnaire = questionset.questionnaire
		main_cat_name = questionset.questionnaire.main_category.name
		sub_cat_name = questionset.questionnaire.sub_category.name
		qs_title = questionset.heading
		questions = questionset.questions()
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

		prev_url = "javascript:void(0)"
		if questionset.prev():
			prev = questionset.prev()
			sortid = prev.sortid
			kwargs = {'runid': runinfo.id,
					'qs_sortid': sortid}
			prev_url = reverse('survey:questionset', kwargs=kwargs)

		contextdict = {'main_cat_name': main_cat_name,
						'sub_cat_name': sub_cat_name,
						'qs_title': qs_title,
						'questionset': questionset,
						'qlist': qlist,
						'prev_url': prev_url,
						'errors': errors}
		return render_to_response('questionset.html', contextdict)

	def add_answer(self, runinfo, question, ans):
		answer = Answer()
		answer.question = question
		answer.subject = runinfo.subject	
		answer.runid = runinfo.pk	
		answer.answer = ans
		Answer.objects.filter(subject=runinfo.subject, 
			runid=runinfo.pk, question=question).delete()
		answer.save()
		return True


	def get(self, request, **kwargs):
		runid = self.kwargs['runid']
		runinfo = RunInfo.objects.get(pk=runid)

		if 'qs_sortid' in self.kwargs:
			questionset = QuestionSet.objects.filter(
				questionnaire = runinfo.questionset.questionnaire,
				sortid = self.kwargs['qs_sortid']).first()
			runinfo.questionset = questionset
			runinfo.save()

		return self.show_questionnaire(request, runinfo)


	def post(self, request, **kwargs):
		runid = self.kwargs['runid']
		runinfo = RunInfo.objects.get(pk=runid)
		questionset = runinfo.questionset
		questionnaire = questionset.questionnaire

		if 'qs_sortid' in self.kwargs:
			questionset = QuestionSet.objects.filter(
				questionnaire = questionnaire,
				sortid = self.kwargs['qs_sortid']).first()
		runinfo.questionset = questionset
		runinfo.save()

		items = request.POST.items()
		extra = {}
		# generate the answer_dict for each posted question, and place in extra
		posted_ids = []
		for item in items:
			key, value = item[0], item[1]

			if key.startswith('question_'):
				qssortid = key.split("_", 3)
			question = Question.objects.filter(sortid=qssortid[1], 
				questionset=questionset, 
				questionset__questionnaire=questionnaire).first()
			posted_ids.append(int(qssortid[1]))
			if not question:
				continue
			ans = {}
			if question in extra:
				ans = extra.get(question)
			if len(qssortid)==2:
				ans['ANSWER'] = value
			elif len(qssortid)==4 and qssortid[3]=='comment':
				if value:
					ans['COMMENT'] = value
			extra[question] = ans
		#generate none for each empty quesiton, and place in extra
		expected = questionset.questions()
		empty_ids = []
		for q in expected:
			if q.sortid in posted_ids:
				continue
			empty_ids.append(q.sortid)
		for q in empty_ids:
			question = Question.objects.filter(sortid=q, 
				questionset=questionset, 
				questionset__questionnaire=questionnaire).first()
			if not question:
				continue
			extra[question] = None

		errors = {}
		for question, ans in extra.items():
			Type = question.type
			exception = False
			ans_tp = ""
			try:
				ans_tp = Processors[Type](question, ans)
			except AnswerException as e:
				exception = True
				errors[question.sortid] = str(e)
			if(exception==False):
				self.add_answer(runinfo, question, ans_tp)
		if len(errors)>0:
			return self.show_questionnaire(request, runinfo, errors)

		next = questionset.next()
		if next:
			runinfo.questionset = next
			runinfo.save()
			kwargs = {'runid': runinfo.id}
			return HttpResponseRedirect(reverse('survey:questionnaire', kwargs=kwargs))

		hist = RunInfoHistory()
		hist.subject = runinfo.subject
		hist.runid = runinfo.pk
		hist.completed = datetime.datetime.now()
		hist.questionnaire = questionnaire
		hist.save()
		runinfo.delete()
		return HttpResponseRedirect(reverse('survey:questionnairedone'))