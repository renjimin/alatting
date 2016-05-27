#!/usr/bin/env python
# -*- coding: utf-8 -*-
from rest_framework.generics import ListCreateAPIView
from alatting_website.model.poster import Poster
from poster.serializer.poster import PosterSerializer


class AccountPostersListView(ListCreateAPIView):
    model = Poster
    queryset = Poster.objects.all()
    serializer_class = PosterSerializer

    def get_queryset(self):
        qs = super(AccountPostersListView, self).get_queryset()
        return qs.filter(creator=self.request.user).order_by('-created_at')
