# Generated by Django 4.0.5 on 2022-12-12 07:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0010_likes_delete_likesandcomments'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='likes',
            new_name='postLikes',
        ),
    ]
