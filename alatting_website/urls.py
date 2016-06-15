# coding=utf-8

from django.conf.urls import include, url
from django.views.generic import TemplateView
from alatting_website.views import (
    PosterView, MobileIndexView, IndexCategoryView,
    PosterCodeView, SvgClipView, DemoView,
    CaptureView, TestView, PosterCaptureView,
    SearchView)
from alatting_website.view.edit_view import CreatePosterView
from alatting_website.feeds import PosterUpdateFeed


# 首页配置
urlpatterns = [
    url(r'^$',
        TemplateView.as_view(template_name='company/index.html'),
        name='index'),

    url(r'^mobile.html$',
        TemplateView.as_view(template_name='company/mobile.html'),
        name='mobile_index'),

    url(r'^mobile/$',
        MobileIndexView.as_view(), name='mobile_poster_index'),

    url(r'^mobile/search/$', SearchView.as_view(), name='mobile_search'),

    url(r'^mobile/category/$', IndexCategoryView.as_view(),
        name='mobile_category'),
]


urlpatterns += [
    url(r'^demo$', DemoView.as_view(), name='demo'),
    url(r'^test$', TestView.as_view(), name='test'),
    url(r'^capture$', CaptureView.as_view(), name='capture'),
    url(r'^poster/(?P<pk>\d+)/$', PosterView.as_view(), name='poster'),
    url(r'^poster/(?P<pk>\d+)/capture/$', PosterCaptureView.as_view(), name='posterCapture'),
    url(r'^poster/rss$', PosterUpdateFeed()),
    # url(r'^poster/(?P<pk>\d+)/edit$', EditView.as_view(), name='edit'),
    url(r'^poster/create$', CreatePosterView.as_view(), name='create'),
    url(r'^api/poster/(?P<pk>\d+)/qr_code/$', PosterCodeView.as_view(),
        name='code_poster'),
    url(r'^api/svg_clip/(?P<layout_id>\d+)/(?P<shape_index>\d+).svg$',
        SvgClipView.as_view(), name='svg_clip'),

    # url(r'^search$', DemoView.as_view(), name='search'),

]
