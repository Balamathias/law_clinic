# Generated by Django 5.1.6 on 2025-05-09 23:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_settings', '0005_sponsor_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sponsor',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
