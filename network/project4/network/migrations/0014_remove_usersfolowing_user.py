# Generated by Django 4.0.5 on 2022-12-14 09:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0013_alter_post_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usersfolowing',
            name='user',
        ),
    ]