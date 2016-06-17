from rest_framework.generics import CreateAPIView
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from survey.models import *
import logging
logger = logging.getLogger(__name__)


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
		data = {'q_id': q.pk, 'q_text':q.text}
		return Response(data, status=status.HTTP_200_OK)

class ItemSerializer(serializers.Serializer):
	"""Custom Serializer"""
	c_texts = serializers.ListField(child=serializers.CharField())

class ChoiceCreateAPIView(APIView):
	def post(self, request, *args, **kwargs):
		q_id = self.kwargs['q_id']
		if not q_id:
			data = {'error':'参数错误'}
			return Response(data, status=status.HTTP_404_NOT_FOUND)
		q = Question.objects.filter(pk=q_id).first()
		item_serializer = ItemSerializer(data=request.data)
		item_serializer.is_valid(raise_exception=True)
		c_texts = item_serializer.data['c_texts']
		if len(c_texts) != len(set(c_texts)):
			data = {'error':'选项不能相同'}
			return Response(data, status=status.HTTP_404_NOT_FOUND)

		for c_text in c_texts:
			if not c_text:
				data = {'error':'请填写选项'}
				return Response(data, status=status.HTTP_404_NOT_FOUND)
			c = Choice()
			c.question = q
			c.sortid = q.choices_count() + 1
			c.text = c_text
			c.value = c_text
			c.save()
		return Response(status=status.HTTP_200_OK)


class ChoiceInputCreateAPIView(APIView):
	def post(self, request, *args, **kwargs):
		q_id = self.kwargs['q_id']
		if not q_id:
			data = {'error':'参数错误'}
			return Response(data, status=status.HTTP_404_NOT_FOUND)
		q = Question.objects.filter(pk=q_id).first()

		c_texts = request.data["c_texts"]
		logger.debug('c_texts')
		logger.debug(c_texts)
		for c_text in c_texts:
			logger.debug('c_text')
			logger.debug(c_text)
			logger.debug('c_text_text')
			logger.debug(c_text['c_text'])
			logger.debug(c_text['c_input'])
		return Response(status=status.HTTP_200_OK)