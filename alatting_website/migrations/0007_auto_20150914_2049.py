# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import utils.db.fields
import utils.file


class Migration(migrations.Migration):

    dependencies = [
        ('alatting_website', '0006_auto_20150908_2317'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='file',
            field=utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_image_path),
        ),
        migrations.AlterField(
            model_name='music',
            name='file',
            field=utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_music_path),
        ),
        migrations.AlterField(
            model_name='poster',
            name='css',
            field=utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_css_path),
        ),
        migrations.AlterField(
            model_name='poster',
            name='html',
            field=utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_html_path),
        ),
        migrations.AlterField(
            model_name='poster',
            name='script',
            field=utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_script_path),
        ),
        migrations.AlterField(
            model_name='posterimage',
            name='image',
            field=models.ForeignKey(to='alatting_website.Image', related_name='poster_images'),
        ),
        migrations.AlterField(
            model_name='posterimage',
            name='poster',
            field=models.ForeignKey(to='alatting_website.Poster', related_name='poster_images'),
        ),
        migrations.AlterField(
            model_name='postervideo',
            name='poster',
            field=models.ForeignKey(to='alatting_website.Poster', related_name='poster_videos'),
        ),
        migrations.AlterField(
            model_name='postervideo',
            name='video',
            field=models.ForeignKey(to='alatting_website.Video', related_name='poster_videos'),
        ),
        migrations.AlterField(
            model_name='video',
            name='file',
            field=utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_video_path),
        ),
    ]
