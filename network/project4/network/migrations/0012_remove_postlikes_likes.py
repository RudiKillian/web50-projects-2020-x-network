# Generated by Django 4.0.5 on 2022-12-12 07:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0011_rename_likes_postlikes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='postlikes',
            name='likes',
        ),
    ]
