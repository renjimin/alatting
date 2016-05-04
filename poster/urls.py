# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from poster.view.create import (CategoryKeywordsView, CreateFormView,
                                SelectTemplateView)
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
]

# 显示海报

urlpatterns += [
    # url(r'^(?P<pk>[\d]+)/$', PosterView.as_view(), name='poster'),
]

# 编辑海报url
urlpatterns += [
    url(r'^(?P<pk>[\d]+)/edit/$', login_required(PosterEditView.as_view()),
        name='edit'),
]
