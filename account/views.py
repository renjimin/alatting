# coding=utf-8
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


def not_found(request):
    return JsonResponse({'detail': u'Page Not Found'}, status=404)


class LoginView(APIView):
    permission_classes = ()

    def post(self, request, **kwargs):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'detail': 'Login successful'})
        else:
            return Response(
                {'detail': 'Authentication failure'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    def delete(self, request):
        logout(request)
        return Response({'detail': 'Logout successful'})
