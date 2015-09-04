# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0003_auto_20150904_2118'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='height',
        ),
        migrations.RemoveField(
            model_name='image',
            name='width',
        ),
        migrations.AlterField(
            model_name='image',
            name='file',
            field=models.ImageField(upload_to='images/%Y/%m/%d'),
        ),
    ]
