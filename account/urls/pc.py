#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from django.conf.urls import url
from account.views.pc import alatting_logout, LoginView

__author__ = 'lyhapple'


urlpatterns = [
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', alatting_logout, name='logout'),

]