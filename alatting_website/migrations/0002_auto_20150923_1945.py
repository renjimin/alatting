# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('alatting_website', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='posterimage',
            name='name',
            field=models.CharField(max_length=63, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='postervideo',
            name='name',
            field=models.CharField(max_length=63, default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='category',
            name='description',
            field=models.CharField(blank=True, max_length=127, default=''),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(unique=True, blank=True, max_length=63, default=''),
        ),
        migrations.AlterField(
            model_name='category',
            name='tags',
            field=models.CharField(blank=True, max_length=2048, default=''),
        ),
        migrations.AlterField(
            model_name='poster',
            name='tags',
            field=models.CharField(blank=True, max_length=128, default=''),
        ),
        migrations.AlterUniqueTogether(
            name='posterimage',
            unique_together=set([('poster', 'name')]),
        ),
        migrations.AlterUniqueTogether(
            name='postervideo',
            unique_together=set([('poster', 'name')]),
        ),
    ]
