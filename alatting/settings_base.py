#!/usr/bin/env python
# coding=utf-8


import os
import datetime

DEBUG = True

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = '!0wb8m-o^pew*o)hyho^zzy7f8m-94v%)4cxn4sa%e!gmp3+vw'

ALLOWED_HOSTS = ['*']

import alatting.pre_init

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'django.contrib.gis',
    'django.contrib.humanize',
    'rest_framework',
    'djcelery',
    'corsheaders',

    'alatting_website',
    'alatting_admin',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

if DEBUG:
    MIDDLEWARE_CLASSES += ('utils.db.middleware.DatabaseMiddleware',)

ROOT_URLCONF = 'alatting.urls'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR + MEDIA_URL

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR + STATIC_URL

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [MEDIA_ROOT],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'alatting.wsgi.application'


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/
LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'

# STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'

# CELERY
from celery.schedules import crontab
CELERY_RESULT_BACKEND='djcelery.backends.database:DatabaseBackend'
CELERYBEAT_SCHEDULE = {
    'refresh-poster-everyday': {
        'task': 'alatting_website.tasks.poster',
        'schedule': crontab(hour=1, minute=58),
    },
}

# rest framework config
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        # 'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'rest_framework.filters.DjangoFilterBackend',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'account.auth.JSONWebTokenAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'alatting.pagination.LinkHeaderPagination',
    'PAGE_SIZE': 100,
    'DATETIME_FORMAT': '%Y-%m-%d %H:%M:%S',
    'DATETIME_INPUT_FORMATS': ('%Y-%m-%d %H:%M:%S',),
    'DATE_FORMAT': '%Y-%m-%d',
    'DATE_INPUT_FORMATS': ('%Y-%m-%d',),
    'TIME_FORMAT': '%H:%M:%S',
    'TIME_INPUT_FORMATS': ('%H:%M:%S',),
    'LANGUAGES': (
        ('zh-hans', 'Simplified Chinese'),
    ),
    'LANGUAGE_CODE': 'zh-hans',
    'NON_FIELD_ERRORS_KEY': 'detail',
}

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=3),
    'JWT_ALLOW_REFRESH': True
}

# import djcelery
# djcelery.setup_loader()

from alatting import post_init