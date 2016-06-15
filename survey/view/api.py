from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from survey.serializer.survey import *
from survey.models import *

class QuestionCreateAPIView(CreateAPIView):
	def post(self, request, *args, **kwargs):
		qs_text = request.data['qs_text']
		return Response({'qs_text': qs_text}, status=status.HTTP_200_OK)


class ChoiceCreateAPIView(CreateAPIView):
	def post(self, request, *args, **kwargs):

		import json
		data=json.dumps({'status':'success'})
		return Response(data, status=status.HTTP_200_OK)