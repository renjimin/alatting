#!/home/ubuntu/web/venv/bin/python
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

exec(compile(open(activate_env).read(), activate_env, 'exec'), dict(__file__=activate_env))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "alatting.settings")

TEST = False

if not TEST:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
else:
    import json

    def application(environ, start_response):
        status = '200 OK'
        output = 'sys.prefix = %s\n' % repr(sys.prefix)
        output += 'sys.path = %s\n' % repr(sys.path)
        response_headers = [('Content-type', 'text/plain'),
                            ('Content-Length', str(len(output)))]
        start_response(status, response_headers)

        return [output]
