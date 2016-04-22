# coding=utf-8
from django.http import JsonResponse

from django.shortcuts import render
from rest_framework.views import APIView


def not_found(request):
    return JsonResponse({'detail': u'Page Not Found'}, status=404)


class LoginView(APIView):
    pass