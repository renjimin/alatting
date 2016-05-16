#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django import forms
from alatting_website.model.poster import Poster

__author__ = 'lyhapple'


class PosterCreateForm(forms.ModelForm):
    main_category_id = forms.CharField(
        widget=forms.HiddenInput
    )
    sub_category_id = forms.CharField(
        widget=forms.HiddenInput
    )
    cate = forms.CharField(
        widget=forms.HiddenInput
    )
    subcate = forms.CharField(
        widget=forms.HiddenInput
    )
    keywords = forms.CharField(
        widget=forms.HiddenInput
    )

    class Meta:
        model = Poster
        fields = [
            'unique_name', 'short_description', 'phone', 'mobile', 'email',
            'main_category_id', 'sub_category_id', 'cate', 'subcate',
            'keywords'
        ]