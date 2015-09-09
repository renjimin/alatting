# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import utils.file


class Migration(migrations.Migration):

    dependencies = [
        ('alatting_website', '0004_auto_20150904_2125'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='music',
            name='url',
        ),
        migrations.RemoveField(
            model_name='video',
            name='url',
        ),
        migrations.AddField(
            model_name='music',
            name='file',
            field=models.FileField(default='', upload_to=utils.file.get_music_path),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='video',
            name='file',
            field=models.FileField(default='', upload_to=utils.file.get_video_path),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='image',
            name='file',
            field=models.ImageField(upload_to=utils.file.get_image_path),
        ),
        migrations.AlterField(
            model_name='music',
            name='format',
            field=models.CharField(default='mp3', max_length=31),
        ),
        migrations.AlterField(
            model_name='poster',
            name='css',
            field=models.FileField(upload_to=utils.file.get_css_path),
        ),
        migrations.AlterField(
            model_name='poster',
            name='html',
            field=models.FileField(upload_to=utils.file.get_html_path),
        ),
        migrations.AlterField(
            model_name='poster',
            name='script',
            field=models.FileField(upload_to=utils.file.get_script_path),
        ),
        migrations.AlterField(
            model_name='video',
            name='format',
            field=models.CharField(default='mp4', max_length=31),
        ),
    ]
