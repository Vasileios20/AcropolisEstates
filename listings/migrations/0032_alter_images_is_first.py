# Generated by Django 4.2.7 on 2024-09-13 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0031_images_is_first'),
    ]

    operations = [
        migrations.AlterField(
            model_name='images',
            name='is_first',
            field=models.BooleanField(default=False, null=True),
        ),
    ]
