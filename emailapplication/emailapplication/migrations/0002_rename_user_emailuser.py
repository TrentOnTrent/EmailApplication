# Generated by Django 5.1.1 on 2024-09-29 13:18

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('emailapplication', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='User',
            new_name='EmailUser',
        ),
    ]