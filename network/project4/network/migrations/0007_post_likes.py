# Generated by Django 4.0.5 on 2022-11-28 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0006_remove_post_likes'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.CharField(default='', max_length=84),
            preserve_default=False,
        ),
    ]
