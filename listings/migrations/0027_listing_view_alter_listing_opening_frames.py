# Generated by Django 4.2.7 on 2024-06-13 08:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0026_listing_address_street_gr_listing_county_gr_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='view',
            field=models.CharField(blank=True, choices=[('sea', 'Sea'), ('mountain', 'Mountain'), ('city', 'City'), ('other', 'Other')], default='sea', max_length=255),
        ),
        migrations.AlterField(
            model_name='listing',
            name='opening_frames',
            field=models.CharField(blank=True, choices=[('aluminium', 'Aluminium'), ('wooden', 'Wooden'), ('iron', 'Iron'), ('PVC', 'PVC')], default='aluminium', max_length=255),
        ),
    ]
