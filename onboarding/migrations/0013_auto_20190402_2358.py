# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-04-02 23:58
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding', '0012_auto_20181107_2352'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='signups', to='events.Event'),
        ),
    ]
