__author__ = 'tianhuyang'
from rest_framework import viewsets
from rest_framework import decorators
from rest_framework import permissions
from rest_framework.response import Response
from utils.utils import Utils
from alatting_website.models import Rating, PosterStatistics, PosterLike, PosterFun
from alatting_website.serializer.statistics_serializer import RatingSerializer, SimpleStatisticsSerializer
from alatting_website.serializer.statistics_serializer import PosterLikeSerializer, PosterFunSerializer


class RatingViewSet(viewsets.GenericViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = super(RatingViewSet, self).get_queryset()
        queryset = queryset.filter(poster=self.kwargs['poster_id'], creator=self.request.user)
        return queryset

    @decorators.list_route(methods=('post',))
    def rate(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = self.get_queryset()
        if len(queryset) == 1:
            serializer.instance = queryset[0]
            kwargs = dict()
        else:
            kwargs = dict(poster_id=kwargs['poster_id'], creator_id=request.user.id)
        serializer.save(**kwargs)
        return Response(serializer.data)


class PosterLikeViewSet(viewsets.GenericViewSet):
    queryset = PosterLike.objects.all()
    serializer_class = PosterLikeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = super(PosterLikeViewSet, self).get_queryset()
        queryset = queryset.filter(poster=self.kwargs['poster_id'], creator=self.request.user)
        return queryset

    @decorators.list_route(methods=('post',))
    def like(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = self.get_queryset()
        if len(queryset) == 1:
            serializer.instance = queryset[0]
            kwargs = dict()
        else:
            kwargs = dict(poster_id=kwargs['poster_id'], creator_id=request.user.id)
        serializer.save(**kwargs)
        return Response(serializer.data)


class PosterFunViewSet(viewsets.GenericViewSet):
    queryset = PosterFun.objects.all()
    serializer_class = PosterFunSerializer

    def get_queryset(self):
        queryset = super(PosterFunViewSet, self).get_queryset()
        queryset = queryset.filter(poster=self.kwargs['poster_id'], ip_address=Utils.get_client_ip(self.request._request))
        return queryset

    @decorators.list_route(methods=('post',))
    def fun(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = self.get_queryset()
        if len(queryset) == 1:
            serializer.instance = queryset[0]
        else:
            kwargs = dict(poster_id=kwargs['poster_id'], ip_address=Utils.get_client_ip(request._request))
            serializer.save(**kwargs)
        return Response(serializer.data)


class StatisticsViewSet(viewsets.GenericViewSet):
    queryset = PosterStatistics.objects.all()
    serializer_class = PosterLikeSerializer

    @decorators.list_route(methods=('post',))
    def shared(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = self.get_queryset()
        if len(queryset) == 1:
            serializer.instance = queryset[0]
            kwargs = dict()
        else:
            kwargs = dict(poster_id=kwargs['poster_id'], creator_id=request.user.id)
        serializer.save(**kwargs)
        return Response(serializer.data)

    @decorators.list_route(methods=('post',))
    def contacted(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = self.get_queryset()
        if len(queryset) == 1:
            serializer.instance = queryset[0]
            kwargs = dict()
        else:
            kwargs = dict(poster_id=kwargs['poster_id'], creator_id=request.user.id)
        serializer.save(**kwargs)
        return Response(serializer.data)


