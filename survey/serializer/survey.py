# coding=utf-8
from rest_framework import serializers
from survey.models import *
from account.serializers import AccountPersonSerializer

class QuestionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Question
		fields = ('short_text',)


class AnswerSerializer(serializers.ModelSerializer):
	question = QuestionSerializer()
	class Meta:
		model = Answer
		fields = ('question', 'answer', 'runid')

class RuninfoSubjectSerializer(serializers.ModelSerializer):
	person = AccountPersonSerializer(read_only=True)
	class Meta:
		model = User
		fields = (
			'id', 'username', 'first_name', 'last_name', 'email', 'person'
		)

class RunInfoHistorySerializer(serializers.ModelSerializer):
	subject = RuninfoSubjectSerializer()
	ans = serializers.SerializerMethodField()

	class Meta:
		model = RunInfoHistory
		fields = ('subject', 'completed', 'runid', 'ans')

	def get_ans(self, RunInfoHistory):
		ans = Answer.objects.filter(poster_id=RunInfoHistory.poster.id,
			question__questionset__questionnaire__role=RunInfoHistory.questionnaire.role, 
			runid=RunInfoHistory.runid)
		serializer = AnswerSerializer(instance=ans, many=True)
		return serializer.data