import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0003_helprequest"),
    ]

    operations = [
        migrations.AddField(
            model_name="helprequest",
            name="status",
            field=models.CharField(
                choices=[
                    ("new", "New"),
                    ("in_review", "In review"),
                    ("assigned", "Assigned"),
                    ("resolved", "Resolved"),
                    ("closed", "Closed"),
                ],
                default="new",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="helprequest",
            name="assigned_to",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="assigned_help_requests",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="helprequest",
            name="internal_notes",
            field=models.TextField(blank=True, null=True),
        ),
    ]
