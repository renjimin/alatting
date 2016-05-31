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
	template_name = 'survey/mobile/questionset.html'

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		return context


class QuestionnaireBlankView(View):
	def get(self, request, **kwargs):
		poster = get_object_or_404(Poster, pk=self.kwargs['poster_id'])
		qs_title = "没有此类别的调查问卷"
		role = self.request.GET.get('role', '')
		contextdict = {'qs_title': qs_title,
						'poster_id': poster.pk,
						'role': role}
		return render_to_response('survey/mobile/questionset_blank.html', contextdict)

	def post(self, request, **kwargs):
		role = self.request.GET.get('role', '')
		if role == "creator":
			return HttpResponseRedirect('%s?poster_id=%s' % (
			reverse('poster:select_template'),
			self.kwargs['poster_id']))
		else:
			kwargs = {'pk': self.kwargs['poster_id']}
			return HttpResponseRedirect(reverse('posters:show', kwargs=kwargs))


class StartView(RedirectView):
	def get_redirect_url(self, *args, **kwargs):
		poster = get_object_or_404(Poster, pk=self.kwargs['poster_id'])
		role = self.request.GET.get('role', '')
		qu = Questionnaire.objects.filter(main_category=poster.main_category, 
			role=role).first()
		if not qu:
			kwargs = {'poster_id': poster.pk}
			return '%s?role=%s' % (reverse('survey:questionnaireblank', kwargs=kwargs), role)

		su = self.request.user
		prev_run = RunInfo.objects.filter(subject=su, questionset__in = qu.questionsets,
			poster=poster).order_by("-id").first()
		if prev_run:
			qs = qu.questionsets()[0]
			run = prev_run
			run.questionset = qs
			run.save()
		else:
			qs = qu.questionsets()[0]
			run = RunInfo(subject=su, questionset=qs, poster=poster)
			run.save()

		kwargs = {'runid': run.id}
		return reverse('survey:questionnaire', kwargs=kwargs)


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
			question=question, poster=runinfo.poster, 
			runid=runinfo.pk).order_by("-id")
		if ans:
			return ans[0].answer
		else:
			return None

	def show_questionnaire(self, request, runinfo, errors={}):
		questionset = runinfo.questionset
		questionnaire = questionset.questionnaire
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
		else:
			if runinfo.questionset.questionnaire.role == "creator":
				kwargs = {'pk': runinfo.poster.pk}
				prev_url = reverse('poster:update_form', kwargs=kwargs)
			else:
				kwargs = {'pk': runinfo.poster.pk}
				prev_url = reverse('posters:show', kwargs=kwargs)

		progress = self.get_progress(runinfo)

		islast_consumer_repeat = False
		if questionset.is_last() and questionnaire.role=="consumer":
			prev_hist = RunInfoHistory.objects.filter(subject=runinfo.subject, 
			questionnaire = questionnaire, poster=runinfo.poster)
			if prev_hist:
				islast_consumer_repeat = True

		islast_consumer = False
		if questionset.is_last() and questionnaire.role=="consumer":
			islast_consumer = True

		contextdict = {'qs_title': qs_title,
						'questionset': questionset,
						'qlist': qlist,
						'prev_url': prev_url,
						'progress': progress,
						'errors': errors,
						'islast_consumer_repeat': islast_consumer_repeat,
						'islast_consumer': islast_consumer}
		return render_to_response('survey/mobile/questionset.html', contextdict)

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

		prev_hist = RunInfoHistory.objects.filter(subject=runinfo.subject, 
			questionnaire = questionnaire, poster=runinfo.poster).all()
		for ph in prev_hist:
			ph.isactive = False
			ph.save()

		hist = RunInfoHistory()
		hist.subject = runinfo.subject
		hist.poster = runinfo.poster
		hist.runid = runinfo.pk
		hist.completed = datetime.datetime.now()
		hist.questionnaire = questionnaire
		hist.isactive = True
		hist.save()

		RunInfo.objects.filter(subject=hist.subject, questionset__in = hist.questionnaire.questionsets,
			poster=hist.poster).delete()
		if hist.questionnaire.role == "creator":
			return HttpResponseRedirect('%s?poster_id=%s' % (reverse('poster:select_template'), hist.poster.pk))
		else:
			kwargs = {'pk': runinfo.poster.pk}
			return HttpResponseRedirect(reverse('posters:show', kwargs=kwargs))


class AnswerDetailView(TemplateView):

	template_name = "survey/mobile/answer_detail.html"

	def get_context_data(self, **kwargs):
		context = super(AnswerDetailView, self).get_context_data(**kwargs)
		poster_id = self.kwargs['poster_id']
		role = self.request.GET.get('role', '')

		context['poster'] = Poster.objects.filter(pk=poster_id).first()

		results = {}
		for his in RunInfoHistory.objects.filter(
			poster_id = poster_id, questionnaire__role = role, isactive = True).order_by('-completed'):
			results.setdefault(his, [])
			for ans in Answer.objects.filter(runid=his.runid):
				results[his].append(ans)
		context['results'] = results
		return context