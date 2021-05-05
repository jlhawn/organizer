# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-08-02 08:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0001_initial'),
        ('crm', '0002_auto_20180729_2011_squashed_0005_auto_20180729_2125'),
    ]

    operations = [
        migrations.CreateModel(
            name='Turf',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('locality', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='address.Locality')),
            ],
        ),
        migrations.CreateModel(
            name='TurfMembership',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('joined_on', models.DateField()),
                ('is_captain', models.BooleanField()),
            ],
        ),
        migrations.RemoveField(
            model_name='person',
            name='neighborhood',
        ),
        migrations.AddField(
            model_name='turfmembership',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='turf_memberships', to='crm.Person'),
        ),
        migrations.AddField(
            model_name='turfmembership',
            name='turf',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='members', to='crm.Turf'),
        ),
        migrations.AlterField(
            model_name='turfmembership',
            name='is_captain',
            field=models.BooleanField(default=False),
        ),
    ]
