# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-05-07 22:49
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0012_person_is_captain'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='turfmembership',
            name='is_captain',
        ),
    ]
