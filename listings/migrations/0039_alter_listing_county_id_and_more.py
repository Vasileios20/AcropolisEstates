# Generated by Django 4.2.7 on 2025-01-03 22:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0038_listing_county_id_listing_municipality_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='county_id',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='listing',
            name='municipality_id',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='listing',
            name='region_id',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]
