# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0002_auto_20150904_1719'),
    ]

    operations = [
        migrations.RenameField(
            model_name='poster',
            old_name='comment_cnt',
            new_name='comments_count',
        ),
        migrations.RemoveField(
            model_name='image',
            name='url',
        ),
        migrations.AddField(
            model_name='image',
            name='file',
            field=models.FileField(default='', upload_to='images/%Y/%m/%d'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='category',
            name='parent',
            field=models.ForeignKey(null=True, blank=True, to='logic.Category'),
        ),
        migrations.AlterField(
            model_name='category',
            name='type',
            field=models.CharField(max_length=15, choices=[('Invite', 'Invite'), ('Activity', 'Activity'), ('Product', 'Product'), ('Expert', 'Expert'), ('Resume', 'Resume'), ('Website', 'Website'), ('Business', 'Business')]),
        ),
        migrations.AlterField(
            model_name='person',
            name='gender',
            field=models.CharField(default='unknown', max_length=15, choices=[('Unknown', 'Unknown'), ('Male', 'Male'), ('Female', 'Female')]),
        ),
        migrations.AlterField(
            model_name='poster',
            name='html',
            field=models.FileField(max_length=4095, upload_to=''),
        ),
        migrations.AlterField(
            model_name='poster',
            name='music',
            field=models.ForeignKey(null=True, blank=True, to='logic.Music'),
        ),
        migrations.AlterField(
            model_name='poster',
            name='status',
            field=models.CharField(max_length=15, choices=[('Draft', 'Draft'), ('Published', 'Published')]),
        ),
    ]
