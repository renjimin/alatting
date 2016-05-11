# coding=utf-8

from django.conf.urls import url
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from poster.view.create import (CategoryKeywordsView, CreateFormView,
                                SelectTemplateView, PosterPageCreateView)
from poster.view.edit import PosterEditView


# 创建海报
from poster.view.show import PosterView

urlpatterns = [
    url(r'^keywords/$', login_required(CategoryKeywordsView.as_view()),
        name='keywords'),

    url(r'^create-form/$', login_required(CreateFormView.as_view()),
        name='create_form'),

    url(r'^select-template/$', login_required(SelectTemplateView.as_view()),
        name='select_template'),

    url(r'^posterpage/$', login_required(PosterPageCreateView.as_view()),
        name='posterpage'),
]

# 显示海报

urlpatterns += [
    # url(r'^(?P<pk>[\d]+)/$', PosterView.as_view(), name='poster'),
]

# 编辑海报url
urlpatterns += [
    url(r'^(?P<poster_pk>[\d]+)/edit/(?P<pk>[\d]+)$',
        login_required(PosterEditView.as_view()),
        name='edit'),

    url(r'^files-upload$',
        TemplateView.as_view(template_name='poster/files-upload.html'),
        name='edit'),
]
