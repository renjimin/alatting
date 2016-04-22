# coding=utf-8

from .settings_base import *

DEBUG = True

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
if DEBUG:
    DEFAULT_DB = {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'alatting',
        'HOST': 'localhost',
        'PORT': '3306',
        'USER': 'root',
        'PASSWORD': 'root',
    }
else:
    DEFAULT_DB = {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dev',
        'HOST': 'alatting-mysql.cd5aq1se5ngs.us-west-2.rds.amazonaws.com',
        'PORT': '3306',
        'USER': '',
        'PASSWORD': '',
    }

DATABASES = {
    'default': DEFAULT_DB
}