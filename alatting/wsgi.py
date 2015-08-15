"""
WSGI config for web project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os
import sys
import site


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

sys.path.append(BASE_DIR)

VENV_DIR = os.path.join(os.path.dirname(BASE_DIR), 'venv')

site.addsitedir(os.path.join(VENV_DIR, 'lib/python3.4/site-packages'))

# Activate your virtual env
activate_env = os.path.join(VENV_DIR, 'bin/activate_this.py')

execfile(activate_env, dict(__file__=activate_env))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "alatting.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
