# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import utils.file


class Migration(migrations.Migration):

    dependencies = [
        ('alatting_website', '0005_auto_20150904_2224'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='file',
            field=models.FileField(upload_to=utils.file.get_image_path),
        ),
    ]
