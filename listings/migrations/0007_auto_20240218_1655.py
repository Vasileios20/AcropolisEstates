# Generated by Django 3.2.4 on 2024-02-18 16:55

from django.db import migrations, models
import listings.models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0006_rename_images_images_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='address_number',
            field=models.IntegerField(validators=[listings.models.validate_zero]),
        ),
        migrations.AlterField(
            model_name='listing',
            name='bathrooms',
            field=models.IntegerField(validators=[listings.models.validate_zero]),
        ),
        migrations.AlterField(
            model_name='listing',
            name='bedrooms',
            field=models.IntegerField(validators=[listings.models.validate_zero]),
        ),
        migrations.AlterField(
            model_name='listing',
            name='kitchens',
            field=models.IntegerField(validators=[listings.models.validate_zero]),
        ),
        migrations.AlterField(
            model_name='listing',
            name='levels',
            field=models.IntegerField(validators=[listings.models.validate_zero]),
        ),
        migrations.AlterField(
            model_name='listing',
            name='living_rooms',
            field=models.IntegerField(validators=[listings.models.validate_zero]),
        ),
        migrations.AlterField(
            model_name='listing',
            name='price',
            field=models.IntegerField(validators=[listings.models.validate_zero]),
        ),
        migrations.AlterField(
            model_name='listing',
            name='surface',
            field=models.IntegerField(validators=[listings.models.validate_zero]),
        ),
    ]