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
from alatting_website.model.poster import Poster
from survey import *

class IndexView(TemplateView):
	template_name = 'questionset.html'

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		return context

class StartView(RedirectView):
	def get_redirect_url(self, *args, **kwargs):
		poster = get_object_or_404(Poster, pk=self.kwargs['poster_id'])
		qu = Questionnaire.objects.filter(main_category=poster.main_category, 
			sub_category=poster.sub_category).first()
		try:
			qs = qu.questionsets()[0]
		except:
			pass

		su = self.request.user
		run = RunInfo(subject=su, questionset=qs, poster=poster)
		run.save()

		kwargs = {'runid': run.id}
		return reverse('survey:questionnaire', kwargs=kwargs)

class QuestionnaireDoneView(TemplateView):
	template_name = 'questionset_done.html'

	def get_context_data(self, **kwargs):
		context = super(QuestionnaireDoneView, self).get_context_data(**kwargs)
		return context
		

class QuestionnaireView(View):
	def get_progress(self, runinfo):
		position = 0
		total = 0
		qs = runinfo.questionset
		qs_sets = qs.questionnaire.questionsets()

		for q in qs_sets:
			total = total + 1
			if q.pk == qs.pk:
				position = total
		progress = float(position) / float(total) * 100.00
		return int(progress)

	def get_pre_ans(self, runinfo, question):
		ans = Answer.objects.filter(subject=runinfo.subject, 
			question=question, poster=runinfo.poster).order_by("-id")
		if ans:
			return ans[0].answer
		else:
			return None

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
			prev_ans = self.get_pre_ans(runinfo, question)
			qdict = {
				'template': 'questionnaire/%s.html' % (Type),
				'qtype': Type,
				'prev_ans': prev_ans,
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

		progress = self.get_progress(runinfo)

		contextdict = {'main_cat_name': main_cat_name,
						'sub_cat_name': sub_cat_name,
						'qs_title': qs_title,
						'questionset': questionset,
						'qlist': qlist,
						'prev_url': prev_url,
						'progress': progress,
						'errors': errors}
		return render_to_response('questionset.html', contextdict)

	def add_answer(self, runinfo, question, ans):
		answer = Answer()
		answer.question = question
		answer.subject = runinfo.subject	
		answer.poster = runinfo.poster
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
		#choice-radio: name="question_{{ question.sortid }}"
		#text/textarea: "question_{{ question.sortid }}"
		#ans: {'ANSWER': ...}
			if len(qssortid)==2:
				ans['ANSWER'] = value
		#checkbox: name="question_{{ question.sortid }}_{{choice.sortid}}"
		#ans: {choice.sortid: ..., choice.sortid: ... }
			elif len(qssortid)==3:
				ans[qssortid[2]] = value
		#input in choice-radio: name="question_{{ question.sortid }}_choice_radio"
		#input in choice-radio: name="question_{{ question.sortid }}_{{ choice.sortid}}_comment"
		#ans: {choice.sortid: {'ANSWER': ..., 'COMMENT': ...}}
			elif len(qssortid)==4 and qssortid[3] in ['radio', 'comment']:				
				if qssortid[3]=='radio':
					if value.startswith("_entry_"):
						choice_selected_value = value.replace("_entry_", "")
					else:
						choice_selected_value = value
					choice_selected = Choice.objects.filter(question = question,
						value = choice_selected_value).first()
					choice_selected_sortid = choice_selected.sortid
					if choice_selected_sortid not in ans:
						ans[choice_selected_sortid] = {}
					# if value.startswith("_entry_"):
					# 	ans[choice_selected_sortid]['ANSWER'] = "_entry_"
					# else:
					# 	ans[choice_selected_sortid]['ANSWER'] = value
					ans[choice_selected_sortid]['ANSWER'] = value
				elif qssortid[3]=='comment':
					choice_sortid = int(qssortid[2])
					if choice_sortid not in ans:
						ans[choice_sortid] = {}
					ans[choice_sortid]['COMMENT'] = value
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
		hist.poster = runinfo.poster
		hist.runid = runinfo.pk
		hist.completed = datetime.datetime.now()
		hist.questionnaire = questionnaire
		hist.save()
		runinfo.delete()
		return HttpResponseRedirect(reverse('survey:questionnairedone'))