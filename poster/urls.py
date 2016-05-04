# coding=utf-8

from django.conf.urls import url
from poster.view.create import (CategoryKeywordsView, CreateFormView,
                                SelectTemplateView)
from poster.view.edit import PosterEditView


# 创建海报
from poster.view.show import PosterView

urlpatterns = [
    url(r'^keywords/$', CategoryKeywordsView.as_view(), name='keywords'),

    url(r'^create-form/$', CreateFormView.as_view(), name='create_form'),

    url(r'^select-template/$', SelectTemplateView.as_view(),
        name='select_template'),
]

# 显示海报

urlpatterns += [
    url(r'^(?P<pk>[\d]+)/$', PosterView.as_view(), name='poster'),
]

# 编辑海报url
urlpatterns += [
    url(r'^(?P<pk>[\d]+)/edit/$', PosterEditView.as_view(), name='edit'),
]
