# coding=utf-8

from django.conf.urls import include, url
from alatting_website.views import PosterView, IndexView, PosterCodeView, SvgClipView, DemoView, CaptureView, TestView, PosterCaptureView
from alatting_website.view.edit_view import EditView, CreatePosterView
from alatting_website.feeds import PosterUpdateFeed

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
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

    url(r'^search$', DemoView.as_view(), name='search'),
    url(r'^category$', DemoView.as_view(), name='category'),

]