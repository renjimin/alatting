#!/usr/bin/env python
# coding=utf-8


import os

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
    'account',
    'poster',
    'survey',
    'alatting_website',
    'alatting_admin',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'alatting.middleware.DisableCSRF',
    # 'django.middleware.csrf.CsrfViewMiddleware',
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
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
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

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOGOUT_URL = '/account/logout/'
LOGIN_URL = '/account/login/'
LOGIN_REDIRECT_URL = '/'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '[%(asctime)s][%(levelname)s][%(module)s][%(filename)s][func:%(funcName)s][line:%(lineno)d]: %(message)s'
        }
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            # django自带的日志处理类，通过邮件发送
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'common_handler': {
            'level': 'DEBUG',
            # python自带的logging handler
            'class': 'logging.handlers.RotatingFileHandler',
            # 日志存储的地址
            'filename': os.path.join(BASE_DIR, 'logs', 'alatting.log'),
            # 日志记录的格式，需要引用formatters中定义的格式，否则无法启动项目
            'formatter': 'default',
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],  # 通过邮件发送错误日志
            'level': 'ERROR',
            'propagate': True,
        },
        'common': {
            'handlers': ['common_handler'],  # 引用handlers中配置的handler
            'level': 'DEBUG',  # 日志记录级别
            'propagate': False
        }
    }
}

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
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
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
        # 'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
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


CORS_ORIGIN_ALLOW_ALL = True

# 验证码过期时间,单位：秒
EXPIRE_TIME = 60 * 10


# 发送验证码的邮箱配置
EMAIL_HOST = 'smtp.mxhichina.com'
EMAIL_HOST_USER = 'service@yunye123.com'
EMAIL_HOST_PASSWORD = 'Yunye0128'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
REGISTRATION_EMAIL_HTML = False


# 上传文件类型白名单
UPLOAD_ACCEPT_FILE_TYPES = {
    'image': ['jpg', 'jpeg', 'png', 'gif'],
    'video': ['mp4', 'ogv', 'webm'],
    'audio': ['mp3']
}

# 上传文件大小限制为 5M
UPLOAD_FILE_SIZE_LIMIT = 5 * 1024 * 1024

# import djcelery
# djcelery.setup_loader()

from alatting import post_init
