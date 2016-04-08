from __future__ import absolute_import

from celery import shared_task
from alatting_website.logic.poster_service import PosterService
# sudo apt-get install rabbitmq-server
# celery -A alatting beat -l info (for develop)
# celery -A alatting worker -l info (for develop)
# http://docs.celeryproject.org/en/latest/tutorials/daemonizing.html#daemonizing

# /etc/init.d/celeryd start
# /etc/init.d/celerybeat start


@shared_task
def poster():
    return PosterService.collect_statistics()

# print(poster.name)
