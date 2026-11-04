from django.db import migrations

# Legacy French status labels -> English values
STATUS_MAP = {
    'En attente': 'Pending',
    'Expédié': 'Shipped',
    'Payé': 'Paid',
    'Annulé': 'Cancelled',
}


def to_english(apps, schema_editor):
    Order = apps.get_model('orders', 'Order')
    for old, new in STATUS_MAP.items():
        Order.objects.filter(status=old).update(status=new)


def to_french(apps, schema_editor):
    Order = apps.get_model('orders', 'Order')
    for old, new in STATUS_MAP.items():
        Order.objects.filter(status=new).update(status=old)


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_alter_order_id_alter_order_status_alter_orderitem_id'),
    ]

    operations = [
        migrations.RunPython(to_english, to_french),
    ]
