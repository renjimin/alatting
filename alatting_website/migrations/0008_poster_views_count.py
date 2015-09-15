# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('alatting_website', '0007_auto_20150914_2049'),
    ]

    operations = [
        migrations.AddField(
            model_name='poster',
            name='views_count',
            field=models.IntegerField(default=0),
        ),
    ]
