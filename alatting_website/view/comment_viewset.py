__author__ = 'tianhuyang'
from rest_framework import viewsets
from rest_framework import pagination
from rest_framework import permissions
from alatting_website.models import Comment
from alatting_website.serializer.comment_serializer import CommentSerializer


class PageNumberPagination(pagination.PageNumberPagination):
    max_page_size = 100
    page_size = 3
    page_size_query_param = 'page_size'


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    pagination_class = PageNumberPagination
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        queryset = super(CommentViewSet, self).get_queryset()
        queryset = queryset.filter(poster=self.kwargs['poster_id']).\
            select_related('creator__person').order_by('-created_at')
        return queryset


