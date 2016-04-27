# coding=utf-8

from rest_framework.generics import ListAPIView, ListCreateAPIView
from alatting_website.model.poster import Poster
from alatting_website.model.statistics import PosterStatistics
from alatting_website.models import Category, CategoryKeyword
from poster.serializer.index import (
    CategorySerializer,
    CategoryKeywordSerializer)


class CategoryListView(ListAPIView):
    model = Category
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        qs = super(CategoryListView, self).get_queryset()
        parent = self.request.GET.get('parent', "-1")
        kwargs = {}
        if parent != "-1":
            if parent == "0":
                kwargs.update({'parent__isnull': True})
            else:
                kwargs.update({'parent': parent})
        return qs.filter(**kwargs).order_by('name')


class CategoryKeywordListView(ListCreateAPIView):
    model = CategoryKeyword
    queryset = CategoryKeyword.objects.all()
    serializer_class = CategoryKeywordSerializer

    def get_queryset(self):
        qs = super(CategoryKeywordListView, self).get_queryset()
        category = self.kwargs.get('pk', None)
        qs = qs.filter(category=category).order_by('verb', 'noun')
        return qs

    def perform_create(self, serializer):
        serializer.save(
            category_id=self.kwargs.get('pk')
        )
