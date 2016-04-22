#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from fabric.context_managers import cd, prefix
from fabric.operations import sudo, put
from fabric.state import env
import os

__author__ = 'lyhapple'

env.hosts = ['root@120.24.41.202']
env.key_filename = "~/.ssh/id_rsa_alatting"

GIT_URL = 'https://github.com/alatting/alatting.git'
APACHE_CONF = 'alatting.conf'

DEPLOY_ROOT_PRO = '/home/alatting'
VENV_ROOT = '/home/venv'
env.activate_pro = 'source /home/venv/bin/activate'

DEPLOY_LOGS_DIR = '/data/deploy/logs'

FAB_BASE_DIR = os.path.dirname(__file__)


def restart():
    sudo('service apache2 restart')


def update_dev():
    with cd(DEPLOY_ROOT_PRO):
        with prefix(env.activate_pro):
            sudo('git pull origin dev')
            sudo('pip3 install -r requirements.txt')
            sudo('python manage.py makemigrations')
            sudo('python manage.py migrate')
            sudo('python manage.py collectstatic --noinput')
    restart()


def re_deploy():
    sudo('python manage.py loaddata fixtures/initial_data.json')

