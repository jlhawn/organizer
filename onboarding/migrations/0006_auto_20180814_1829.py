# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-08-14 18:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding', '0005_auto_20180810_0756'),
    ]

    operations = [
        migrations.AlterField(
            model_name='newneighbornotificationtarget',
            name='turfs',
            field=models.ManyToManyField(to='crm.Turf'),
        ),
    ]
