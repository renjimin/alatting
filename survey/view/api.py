from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from survey.models import *
import json

class QuestionCreateAPIView(APIView):

	def post(self, request, format=None):
		qs_text = request.data["qs_text"]
		if not qs_text:
			data = {'error':'请填写问题描述'}
			return Response(data, status=status.HTTP_404_NOT_FOUND)
		qs_short_text = request.data["qs_short_text"]
		if not qs_short_text:
			data = {'error':'请填写问题简短描述'}
			return Response(data, status=status.HTTP_404_NOT_FOUND)
		elif len(qs_short_text)>6:
			data = {'error':'问题简短描述不超过6个字'}
			return Response(data, status=status.HTTP_404_NOT_FOUND)
		qs_type = request.data["qs_type"]
		if not qs_type:
			data = {'error':'请填写问题类型'}
			return Response(data, status=status.HTTP_404_NOT_FOUND)

		

		poster_id = request.data["poster_id"]
		poster = get_object_or_404(Poster, pk=poster_id)
		qu = Questionnaire.objects.filter(main_category=poster.main_category,
										sub_category=poster.sub_category,
										role='consumer').first()
		if not qu:
			qu = Questionnaire.objects.filter(main_category=poster.main_category,
											sub_category__isnull=True,
											role='consumer').first()
		qs = qu.questionsets().last()

		q = Question()
		q.questionset = qs
		q.sortid = qs.questions_count() + 1
		q.type = qs_type
		q.text = qs_text
		q.short_text = qs_short_text
		q.required = False
		q.audit_status = 0
		q.poster = poster
		q.save()
		data = {'status': 'success'}
		return Response(data, status=status.HTTP_200_OK)


class ChoiceCreateAPIView(CreateAPIView):
	def post(self, request, *args, **kwargs):

		data=json.dumps({'status':'success'})
		return Response(data, status=status.HTTP_200_OK)