# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=63)),
                ('desc', models.CharField(max_length=127)),
                ('parent', models.ForeignKey(to='logic.Category')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(max_length=127)),
                ('desc', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('url', models.URLField()),
                ('width', models.PositiveSmallIntegerField()),
                ('height', models.PositiveSmallIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Music',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('url', models.URLField(max_length=2047)),
                ('format', models.CharField(max_length=31)),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('user', models.OneToOneField(db_column='id', to=settings.AUTH_USER_MODEL, primary_key=True, serialize=False)),
                ('gender', models.PositiveSmallIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Poster',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('type', models.PositiveSmallIntegerField()),
                ('status', models.PositiveSmallIntegerField()),
                ('width', models.PositiveSmallIntegerField()),
                ('height', models.PositiveSmallIntegerField()),
                ('title', models.CharField(max_length=127)),
                ('desc', models.CharField(max_length=255)),
                ('likes_cnt', models.IntegerField(default=0)),
                ('cmnt_cnt', models.IntegerField(default=0)),
                ('html', models.TextField(max_length=4095)),
                ('css', models.TextField(max_length=4095)),
                ('script', models.TextField(max_length=4095)),
            ],
        ),
        migrations.CreateModel(
            name='PosterImage',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('image', models.ForeignKey(to='logic.Image')),
            ],
        ),
        migrations.CreateModel(
            name='PosterLike',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('person', models.ForeignKey(to='logic.Person')),
            ],
        ),
        migrations.CreateModel(
            name='PosterVideo',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('url', models.URLField(max_length=2047)),
                ('format', models.CharField(max_length=31)),
            ],
        ),
        migrations.CreateModel(
            name='Invite',
            fields=[
                ('poster_ptr', models.OneToOneField(to='logic.Poster', parent_link=True, auto_created=True, primary_key=True, serialize=False)),
            ],
            bases=('logic.poster',),
        ),
        migrations.AddField(
            model_name='postervideo',
            name='poster',
            field=models.ForeignKey(to='logic.Poster'),
        ),
        migrations.AddField(
            model_name='postervideo',
            name='video',
            field=models.ForeignKey(to='logic.Video'),
        ),
        migrations.AddField(
            model_name='posterlike',
            name='poster',
            field=models.ForeignKey(to='logic.Poster'),
        ),
        migrations.AddField(
            model_name='posterimage',
            name='poster',
            field=models.ForeignKey(to='logic.Poster'),
        ),
        migrations.AddField(
            model_name='poster',
            name='category',
            field=models.ForeignKey(to='logic.Category'),
        ),
        migrations.AddField(
            model_name='poster',
            name='creator',
            field=models.ForeignKey(to='logic.Person'),
        ),
        migrations.AddField(
            model_name='poster',
            name='music',
            field=models.ForeignKey(to='logic.Music'),
        ),
        migrations.AddField(
            model_name='comment',
            name='person',
            field=models.ForeignKey(to='logic.Person'),
        ),
        migrations.AddField(
            model_name='comment',
            name='poster',
            field=models.ForeignKey(to='logic.Poster'),
        ),
        migrations.AlterUniqueTogether(
            name='postervideo',
            unique_together=set([('poster', 'video')]),
        ),
        migrations.AlterUniqueTogether(
            name='posterlike',
            unique_together=set([('poster', 'person')]),
        ),
        migrations.AlterUniqueTogether(
            name='posterimage',
            unique_together=set([('poster', 'image')]),
        ),
    ]
