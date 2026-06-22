from django.db import connection

from .models import Publication


def ensure_publication_content_format_column():
    if connection.vendor != "postgresql":
        return

    table_name = Publication._meta.db_table
    field = Publication._meta.get_field("content_format")

    try:
        with connection.cursor() as cursor:
            columns = {
                column.name
                for column in connection.introspection.get_table_description(cursor, table_name)
            }
    except Exception:
        return

    if field.column in columns:
        return

    default_value = str(field.default).replace("'", "''")
    quoted_table_name = connection.ops.quote_name(table_name)
    quoted_column_name = connection.ops.quote_name(field.column)
    column_type = field.db_type(connection)

    with connection.cursor() as cursor:
        cursor.execute(
            f"ALTER TABLE {quoted_table_name} ADD COLUMN IF NOT EXISTS {quoted_column_name} {column_type} "
            f"DEFAULT '{default_value}' NOT NULL"
        )

    Publication.objects.update(content_format="markdown")