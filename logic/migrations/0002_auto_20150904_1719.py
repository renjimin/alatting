# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('poster_ptr', models.OneToOneField(auto_created=True, primary_key=True, to='logic.Poster', serialize=False, parent_link=True)),
            ],
            bases=('logic.poster',),
        ),
        migrations.CreateModel(
            name='Business',
            fields=[
                ('poster_ptr', models.OneToOneField(auto_created=True, primary_key=True, to='logic.Poster', serialize=False, parent_link=True)),
            ],
            bases=('logic.poster',),
        ),
        migrations.CreateModel(
            name='Expert',
            fields=[
                ('poster_ptr', models.OneToOneField(auto_created=True, primary_key=True, to='logic.Poster', serialize=False, parent_link=True)),
            ],
            bases=('logic.poster',),
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('poster_ptr', models.OneToOneField(auto_created=True, primary_key=True, to='logic.Poster', serialize=False, parent_link=True)),
            ],
            bases=('logic.poster',),
        ),
        migrations.CreateModel(
            name='Resume',
            fields=[
                ('poster_ptr', models.OneToOneField(auto_created=True, primary_key=True, to='logic.Poster', serialize=False, parent_link=True)),
            ],
            bases=('logic.poster',),
        ),
        migrations.CreateModel(
            name='Website',
            fields=[
                ('poster_ptr', models.OneToOneField(auto_created=True, primary_key=True, to='logic.Poster', serialize=False, parent_link=True)),
            ],
            bases=('logic.poster',),
        ),
        migrations.RenameField(
            model_name='poster',
            old_name='cmnt_cnt',
            new_name='comment_cnt',
        ),
        migrations.RenameField(
            model_name='poster',
            old_name='likes_cnt',
            new_name='likes_count',
        ),
        migrations.RemoveField(
            model_name='poster',
            name='type',
        ),
        migrations.AddField(
            model_name='category',
            name='type',
            field=models.CharField(default='invite', max_length=15, choices=[('invite', 'invite'), ('activity', 'activity'), ('product', 'product'), ('expert', 'expert'), ('resume', 'resume'), ('website', 'website'), ('business', 'business')]),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='category',
            name='parent',
            field=models.ForeignKey(to='logic.Category', null=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='gender',
            field=models.CharField(default='unknown', max_length=15, choices=[('unknown', 'unknown'), ('male', 'male'), ('female', 'female')]),
        ),
        migrations.AlterField(
            model_name='poster',
            name='height',
            field=models.PositiveSmallIntegerField(default=1024),
        ),
        migrations.AlterField(
            model_name='poster',
            name='music',
            field=models.ForeignKey(to='logic.Music', null=True),
        ),
        migrations.AlterField(
            model_name='poster',
            name='width',
            field=models.PositiveSmallIntegerField(default=800),
        ),
    ]
