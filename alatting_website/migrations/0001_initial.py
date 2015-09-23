# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import utils.file
from django.conf import settings
import utils.db.utils
import utils.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', utils.db.fields.BigAutoField(primary_key=True, serialize=False)),
                ('address1', models.CharField(max_length=128)),
                ('address2', models.CharField(max_length=128, default='', blank=True)),
                ('city', models.CharField(max_length=128)),
                ('state', models.CharField(max_length=128)),
                ('country', models.CharField(max_length=16)),
                ('post_code', models.CharField(max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=63)),
                ('description', models.CharField(max_length=127)),
                ('tags', models.CharField(max_length=2048)),
                ('parent', models.ForeignKey(blank=True, null=True, to='alatting_website.Category')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', utils.db.fields.BigAutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('content', models.CharField(max_length=2048)),
                ('parent', utils.db.fields.BigForeignKey(blank=True, related_name='children', null=True, to='alatting_website.Comment')),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('uuid', models.CharField(max_length=64, default=utils.db.utils.generate_uuid)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('file', utils.db.fields.OverWriteImageField(width_field='width', storage=utils.file.OverwriteStorage(), height_field='height', upload_to=utils.file.get_image_path)),
                ('width', models.PositiveSmallIntegerField(blank=True)),
                ('height', models.PositiveSmallIntegerField(blank=True)),
                ('format', models.CharField(max_length=10, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Music',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('uuid', models.CharField(max_length=64, default=utils.db.utils.generate_uuid)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('file', utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_music_path)),
                ('format', models.CharField(max_length=10, default='mp3')),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('user', models.OneToOneField(primary_key=True, db_column='id', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('gender', models.CharField(max_length=15, default='unknown', choices=[('Unknown', 'Unknown'), ('Male', 'Male'), ('Female', 'Female')])),
            ],
        ),
        migrations.CreateModel(
            name='Poster',
            fields=[
                ('id', utils.db.fields.BigAutoField(primary_key=True, serialize=False)),
                ('unique_name', models.CharField(max_length=512, unique=True)),
                ('url', models.CharField(max_length=512)),
                ('logo_title', models.CharField(max_length=512)),
                ('short_description', models.CharField(max_length=1024)),
                ('phone', models.CharField(max_length=16)),
                ('mobile', models.CharField(max_length=16, default='', blank=True)),
                ('email', models.EmailField(max_length=254, default='', blank=True)),
                ('lifetime_type', models.CharField(max_length=15, default='specific', choices=[('weekly', 'weekly'), ('specific', 'specific')])),
                ('lifetime_value', models.CharField(max_length=1024)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(max_length=15, choices=[('Draft', 'Draft'), ('Published', 'Published'), ('Active', 'Active'), ('Inactive', 'Inactive')])),
                ('width', models.PositiveSmallIntegerField(default=800)),
                ('height', models.PositiveSmallIntegerField(default=1024)),
                ('desc', models.CharField(max_length=255)),
                ('views_count', models.IntegerField(default=0)),
                ('likes_count', models.IntegerField(default=0)),
                ('comments_count', models.IntegerField(default=0)),
                ('forwarded_count', models.IntegerField(default=0)),
                ('reviews_score', models.SmallIntegerField(default=0)),
                ('html', utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_html_path)),
                ('css', utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_css_path)),
                ('script', utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_script_path)),
                ('tags', models.CharField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='PosterImage',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('image', models.ForeignKey(related_name='poster_images', to='alatting_website.Image')),
            ],
        ),
        migrations.CreateModel(
            name='PosterLike',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='PosterVideo',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('uuid', models.CharField(max_length=64, default=utils.db.utils.generate_uuid)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('file', utils.db.fields.OverWriteFileField(storage=utils.file.OverwriteStorage(), upload_to=utils.file.get_video_path)),
                ('format', models.CharField(max_length=31, default='mp4')),
            ],
        ),
        migrations.CreateModel(
            name='ActivityInvitation',
            fields=[
                ('poster', utils.db.fields.BigOneToOneField(primary_key=True, serialize=False, parent_link=True, to='alatting_website.Poster')),
                ('activity_status', models.CharField(max_length=15, default='coming', choices=[('coming', 'coming'), ('now', 'now'), ('finished', 'finished'), ('cancelled', 'cancelled')])),
                ('invitation_message', models.CharField(max_length=512)),
                ('activity_start_time', models.DateTimeField()),
                ('activity_end_time', models.DateTimeField()),
                ('special_description', models.CharField(max_length=1024, default='', blank=True)),
                ('activity_reminder_message', models.CharField(max_length=1024, default='', blank=True)),
                ('parking_notice_message', models.CharField(max_length=1024, default='', blank=True)),
                ('accepted_count', models.IntegerField(default=0)),
                ('rejected_count', models.IntegerField(default=0)),
                ('need_pre_notification', models.BooleanField(default=True)),
                ('pre_minutes_to_notify', models.IntegerField(default=0)),
            ],
            bases=('alatting_website.poster',),
        ),
        migrations.CreateModel(
            name='Business',
            fields=[
                ('poster_ptr', models.OneToOneField(primary_key=True, serialize=False, to='alatting_website.Poster', auto_created=True, parent_link=True)),
            ],
            bases=('alatting_website.poster',),
        ),
        migrations.CreateModel(
            name='BusinessMarketing',
            fields=[
                ('poster', utils.db.fields.BigOneToOneField(primary_key=True, serialize=False, parent_link=True, to='alatting_website.Poster')),
                ('slogan', models.CharField(max_length=128, default='', blank=True)),
                ('parking_notice_message', models.CharField(max_length=1024, default='', blank=True)),
                ('need_reservation', models.BooleanField(default=True)),
                ('business_keywords', models.CharField(max_length=512, default='', blank=True)),
            ],
            bases=('alatting_website.poster',),
        ),
        migrations.CreateModel(
            name='ExpertShow',
            fields=[
                ('poster', utils.db.fields.BigOneToOneField(primary_key=True, serialize=False, parent_link=True, to='alatting_website.Poster')),
                ('first_name', models.CharField(max_length=64)),
                ('last_name', models.CharField(max_length=64)),
                ('sex', models.CharField(max_length=10, choices=[('male', 'male'), ('female', 'female')])),
                ('birthday', models.DateField(null=True, blank=True)),
                ('profession', models.CharField(max_length=128)),
                ('working_years', models.IntegerField()),
                ('degree', models.CharField(max_length=64, choices=[('Bachelor', 'Bachelor'), ('Master', 'Master'), ('PHD', 'PHD')])),
                ('university', models.CharField(max_length=128, default='', blank=True)),
                ('awards', models.CharField(max_length=2048, default='', blank=True)),
                ('experince_description', models.CharField(max_length=2048)),
                ('industry', models.CharField(max_length=128)),
                ('specials', models.CharField(max_length=1024, default='', blank=True)),
                ('available_hours', models.CharField(max_length=64, default='', blank=True)),
                ('need_reservation', models.BooleanField(default=False)),
                ('expert_keywords', models.CharField(max_length=512, default='', blank=True)),
                ('parking_notice_message', models.CharField(max_length=512, default='', blank=True)),
                ('resume', utils.db.fields.OverWriteFileField(null=True, storage=utils.file.OverwriteStorage(), blank=True, upload_to='')),
            ],
            bases=('alatting_website.poster',),
        ),
        migrations.CreateModel(
            name='ProductSell',
            fields=[
                ('poster', utils.db.fields.BigOneToOneField(primary_key=True, serialize=False, parent_link=True, to='alatting_website.Poster')),
                ('price', models.FloatField(default=0)),
                ('is_negotiable', models.BooleanField(default=False)),
                ('is_express_delivery', models.BooleanField(default=False)),
                ('size_length', models.IntegerField(default=0)),
                ('size_width', models.IntegerField(default=0)),
                ('size_height', models.IntegerField(default=0)),
                ('is_product_available', models.BooleanField(default=False)),
                ('is_product_on_sale', models.BooleanField(default=False)),
                ('appearance_description', models.CharField(max_length=1024, default='', blank=True)),
                ('material_description', models.CharField(max_length=32, default='', blank=True)),
                ('color', models.CharField(max_length=32, default='', blank=True)),
            ],
            bases=('alatting_website.poster',),
        ),
        migrations.CreateModel(
            name='Resume',
            fields=[
                ('poster_ptr', models.OneToOneField(primary_key=True, serialize=False, to='alatting_website.Poster', auto_created=True, parent_link=True)),
            ],
            bases=('alatting_website.poster',),
        ),
        migrations.CreateModel(
            name='Website',
            fields=[
                ('poster_ptr', models.OneToOneField(primary_key=True, serialize=False, to='alatting_website.Poster', auto_created=True, parent_link=True)),
            ],
            bases=('alatting_website.poster',),
        ),
        migrations.AddField(
            model_name='postervideo',
            name='poster',
            field=utils.db.fields.BigForeignKey(related_name='poster_videos', to='alatting_website.Poster'),
        ),
        migrations.AddField(
            model_name='postervideo',
            name='video',
            field=models.ForeignKey(related_name='poster_videos', to='alatting_website.Video'),
        ),
        migrations.AddField(
            model_name='posterlike',
            name='poster',
            field=utils.db.fields.BigForeignKey(to='alatting_website.Poster'),
        ),
        migrations.AddField(
            model_name='posterlike',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='posterimage',
            name='poster',
            field=utils.db.fields.BigForeignKey(related_name='poster_images', to='alatting_website.Poster'),
        ),
        migrations.AddField(
            model_name='poster',
            name='address',
            field=utils.db.fields.BigForeignKey(related_name='posters', to='alatting_website.Address'),
        ),
        migrations.AddField(
            model_name='poster',
            name='creator',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='poster',
            name='logo_image',
            field=models.ForeignKey(related_name='poster_logo_images', to='alatting_website.Image'),
        ),
        migrations.AddField(
            model_name='poster',
            name='main_category',
            field=models.ForeignKey(related_name='main_posters', to='alatting_website.Category'),
        ),
        migrations.AddField(
            model_name='poster',
            name='music',
            field=models.ForeignKey(blank=True, null=True, to='alatting_website.Music'),
        ),
        migrations.AddField(
            model_name='poster',
            name='sub_category',
            field=models.ForeignKey(related_name='sub_posters', to='alatting_website.Category'),
        ),
        migrations.AddField(
            model_name='comment',
            name='poster',
            field=utils.db.fields.BigForeignKey(to='alatting_website.Poster'),
        ),
        migrations.AddField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='postervideo',
            unique_together=set([('poster', 'video')]),
        ),
        migrations.AlterUniqueTogether(
            name='posterlike',
            unique_together=set([('poster', 'user')]),
        ),
        migrations.AlterUniqueTogether(
            name='posterimage',
            unique_together=set([('poster', 'image')]),
        ),
    ]
