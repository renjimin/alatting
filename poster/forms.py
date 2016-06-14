#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django import forms
import re
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
    address_text = forms.CharField(
        max_length=64,
        widget=forms.TextInput
    )
    slug = forms.CharField(
        max_length=100,
        widget=forms.TextInput
    )

    class Meta:
        model = Poster
        fields = [
            'unique_name', 'short_description', 'phone', 'mobile', 'email',
            'main_category_id', 'sub_category_id', 'cate', 'subcate',
            'keywords', 'address_text', 'slug'
        ]
        
    def clean_slug(self):
        slug = self.cleaned_data.get('slug', '')
        if not slug:
            raise forms.ValidationError(u'请输入链接名称!')
        elif not re.search(u'^[_a-zA-Z0-9\-]+$', slug):
            raise forms.ValidationError(
                u'链接名称应由字母、数字、下划线或横线组成!'
            )
        return slug

