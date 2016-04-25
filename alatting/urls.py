# utf-8

"""alatting URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""

import os
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = []

if settings.DEBUG:
    # 开发模式时才开启前端访问链接，生产环境时使用apache跑静态页面
    urlpatterns += static(
        '/web/',
        document_root=os.path.join(settings.BASE_DIR, 'frontend')
    )

# 以下是API路由配置
urlpatterns += [
    url(r'^api/v1/account/', include('account.urls', namespace='account')),
    url(r'^api/v1/poster/', include('poster.urls', namespace='poster'))

]


# 以下是全局配置
urlpatterns += [
    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('alatting_website.urls', namespace='website')),
    url(r'', include('alatting.api_urls', namespace='api')),

    url(r'^api/.*', 'account.views.not_found'),

    url('^', include('django.contrib.auth.urls', namespace='auth'))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
