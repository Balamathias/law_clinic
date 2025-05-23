# Generated by Django 5.1.6 on 2025-05-09 08:41

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_rename_joined_user_date_joined'),
    ]

    operations = [
        migrations.CreateModel(
            name='HelpRequest',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('full_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=20)),
                ('legal_issue_type', models.CharField(max_length=100)),
                ('had_previous_help', models.CharField(choices=[('yes', 'Yes'), ('no', 'No')], max_length=50)),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Help Request',
                'verbose_name_plural': 'Help Requests',
                'ordering': ['-created_at'],
            },
        ),
    ]
