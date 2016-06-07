# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from poster.view.mobile import (
    PosterEditView, PosterView,
    CategoryKeywordsView, CreateFormView,
    SelectTemplateView, PosterPageCreateView,
    UpdateFormView
)


# 创建海报
urlpatterns = [
    url(r'^keywords/$', login_required(CategoryKeywordsView.as_view()),
        name='keywords'),

    url(r'^create-form/$', login_required(CreateFormView.as_view()),
        name='create_form'),

    url(r'^update-form/(?P<pk>[\d]+)/$',
        login_required(UpdateFormView.as_view()),
        name='update_form'),

    url(r'^select-template/(?P<poster_pk>[\d]+)$',
        login_required(SelectTemplateView.as_view()),
        name='select_template'),

    url(r'^posterpage/$', login_required(PosterPageCreateView.as_view()),
        name='posterpage'),
]

# 显示海报
urlpatterns += [
    url(r'^(?P<pk>[\d]+)/$', PosterView.as_view(), name='show'),
]

# 编辑海报url
urlpatterns += [
    url(r'^(?P<poster_pk>[\d]+)/edit$',
        login_required(PosterEditView.as_view()),
        name='edit'),
]