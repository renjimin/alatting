#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django import forms
from alatting_website.model.poster import Poster

__author__ = 'lyhapple'


class PosterCreateForm(forms.ModelForm):
    class Meta:
        model = Poster
        fields = ['unique_name', 'short_description',
                  'phone', 'mobile', 'email']