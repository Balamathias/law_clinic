from django.db import migrations, models


def backfill_format(apps, schema_editor):
    Publication = apps.get_model("publications", "Publication")
    Publication.objects.all().update(content_format="markdown")


class Migration(migrations.Migration):

    dependencies = [
        ("publications", "0002_publication_mins_read"),
    ]

    operations = [
        migrations.AddField(
            model_name="publication",
            name="content_format",
            field=models.CharField(
                choices=[("markdown", "Markdown"), ("html", "HTML")],
                default="html",
                max_length=10,
            ),
        ),
        migrations.RunPython(backfill_format, reverse_code=migrations.RunPython.noop),
    ]
