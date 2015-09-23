# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('alatting_website', '0002_auto_20150923_1945'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='poster',
            name='desc',
        ),
    ]
