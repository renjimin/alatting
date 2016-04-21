#!/usr/bin/env python
# -*- coding: utf-8 -*-
from rest_framework import serializers
from alatting_website.model.poster import Poster
from alatting_website.serializer.statistics_serializer import \
    PosterStatisticsSerializer, HistoryStatisticsSerializer


__author__ = 'liyinhui'


class PosterSerializer(serializers.ModelSerializer):
    poster_statistics = PosterStatisticsSerializer()
    history_statistics = HistoryStatisticsSerializer()

    class Meta:
        model = Poster
