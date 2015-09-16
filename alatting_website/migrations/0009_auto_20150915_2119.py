# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import utils.file
import utils.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('alatting_website', '0008_poster_views_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='height',
            field=models.PositiveSmallIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='image',
            name='width',
            field=models.PositiveSmallIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='image',
            name='file',
            field=utils.db.fields.OverWriteImageField(upload_to=utils.file.get_image_path, height_field='height', storage=utils.file.OverwriteStorage(), width_field='width'),
        ),
    ]
