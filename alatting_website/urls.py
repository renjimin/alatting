__author__ = 'tianhuyang'
from django.conf.urls import include, url
from alatting_website.views import PosterView, IndexView, PosterCodeView, SvgClipView


urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^poster/(?P<pk>\d+)/$', PosterView.as_view(), name='poster'),
    url(r'^api/qr_code/poster/(?P<pk>\d+)/$', PosterCodeView.as_view(), name='code_poster'),
    url(r'^api/svg_clip/(?P<layout_id>\d+)/(?P<shape_index>\d+).svg$', SvgClipView.as_view(), name='svg_clip'),
]
