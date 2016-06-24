from rest_framework.generics import CreateAPIView, DestroyAPIView
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from survey.models import *


def get_qu_from_poster(poster_id, role):

    poster = get_object_or_404(Poster, pk=poster_id)
    qu = Questionnaire.objects.filter(main_category=poster.main_category,
                                      sub_category=poster.sub_category,
                                      role=role).first()
    if not qu:
        qu = Questionnaire.objects.filter(
            main_category=poster.main_category,
            sub_category__isnull=True,
            role=role).first()
    return qu


class QuestionCreateAPIView(APIView):

    def post(self, request, format=None):
        qs_text = request.data["qs_text"]
        if not qs_text:
            data = {'error': '请填写问题描述'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        qs_short_text = request.data["qs_short_text"]
        if not qs_short_text:
            data = {'error': '请填写问题简短描述'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        elif len(qs_short_text) > 6:
            data = {'error': '问题简短描述不超过6个字'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        qs_type = request.data["qs_type"]
        if not qs_type:
            data = {'error': '请填写问题类型'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)

        poster_id = request.data["poster_id"]
        qu = get_qu_from_poster(poster_id, 'consumer')
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
        data = {'q_id': q.pk, 'q_text': q.text}
        return Response(data, status=status.HTTP_200_OK)


class ItemSerializer(serializers.Serializer):

    """Custom Serializer"""
    c_texts = serializers.ListField(child=serializers.CharField())


class ChoiceCreateAPIView(APIView):

    def post(self, request, *args, **kwargs):
        q_id = self.kwargs['q_id']
        if not q_id:
            data = {'error': '参数错误'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        q = Question.objects.filter(pk=q_id).first()
        item_serializer = ItemSerializer(data=request.data)
        item_serializer.is_valid(raise_exception=True)
        c_texts = item_serializer.data['c_texts']
        if len(c_texts) != len(set(c_texts)):
            data = {'error': '选项不能相同'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)

        for c_text in c_texts:
            if not c_text:
                data = {'error': '请填写选项'}
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
            data = {'error': '参数错误'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        q = Question.objects.filter(pk=q_id).first()

        c_texts = request.data["c_texts"]

        c_text_dup = []
        for c_text in c_texts:
            if not c_text['c_text']:
                data = {'error': '请填写选项'}
                return Response(data, status=status.HTTP_404_NOT_FOUND)
            c_text_dup.append(c_text['c_text'])
        if len(c_text_dup) != len(set(c_text_dup)):
            data = {'error': '选项不能相同'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)

        for c_text in c_texts:
            c = Choice()
            c.question = q
            c.sortid = q.choices_count() + 1
            c.text = c_text['c_text']
            c.value = c_text['c_text']
            c.save()
            if c_text['c_input']:
                inp = Input()
                inp.choice = c
                inp.save()
        return Response(status=status.HTTP_200_OK)


class QuestionDeleteAPIView(DestroyAPIView):

    def delete(self, request, *args, **kwargs):
        q_id = self.kwargs['q_id']
        if not q_id:
            data = {'error': '参数错误'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        q = Question.objects.filter(pk=q_id).first()
        q.delete()
        return Response(status=status.HTTP_200_OK)


class QuestionnaireDetailAPIView(APIView):

    def get_c_detail(self, c):
        c_detail = {"text": c.text, "sortid": c.sortid}
        if c.inputs():
            c_detail["inputs"] = []
            inp = c.inputs().first()
            inp.detail = {
                'placeholder': inp.placeholder, 'type': inp.type}
            c_detail["inputs"].append(inp.detail)
        return c_detail

    def get_q_detail(self, q):
        q_detail = {"text": q.text, "sortid": q.sortid}
        if q.choices_count() > 0:
            q_detail["choices"] = []
            choices = q.choices()
            for each_c in choices:
                q_detail["choices"].append(self.get_c_detail(each_c))
        return q_detail

    def get_qs_detail(self, qs, poster_id):
        q = qs.questions_in_poster(poster_id)
        qs_detail = {
            "sortid": qs.sortid, "heading": qs.heading, "questions": []}
        for each_q in q:
            qs_detail["questions"].append(self.get_q_detail(each_q))
        return qs_detail

    def get(self, request, *args, **kwargs):
        poster_id = self.kwargs['poster_id']
        role = self.kwargs['role']
        qu = get_qu_from_poster(poster_id, role)
        if not qu:
            return Response({}, status=status.HTTP_200_OK)

        data = {"id": qu.pk, "name": qu.name, "qs": []}
        qs = qu.questionsets()
        for each_qs in qs:
            data["qs"].append(self.get_qs_detail(each_qs, poster_id))
        return Response(data, status=status.HTTP_200_OK)
