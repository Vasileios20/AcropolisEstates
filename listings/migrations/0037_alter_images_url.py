# Generated by Django 4.2.7 on 2024-12-26 11:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0036_images_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='images',
            name='url',
            field=models.URLField(blank=True, max_length=255, null=True),
        ),
    ]