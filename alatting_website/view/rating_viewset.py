__author__ = 'tianhuyang'
from rest_framework import viewsets
from rest_framework import decorators
from rest_framework import permissions
from rest_framework.response import Response
from alatting_website.models import Rating, Poster, User
from alatting_website.serializer.rating_serializer import RatingSerializer


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


