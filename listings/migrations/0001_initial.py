# Generated by Django 3.2 on 2024-01-20 19:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=255)),
                ('sale_type', models.CharField(choices=[('sale', 'Sale'), ('rent', 'Rent')], default='sale', max_length=255)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('address_number', models.IntegerField()),
                ('address_street', models.CharField(max_length=255)),
                ('postcode', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('price', models.IntegerField()),
                ('surface', models.IntegerField()),
                ('levels', models.IntegerField()),
                ('bedrooms', models.IntegerField()),
                ('floor', models.IntegerField()),
                ('kitchens', models.IntegerField()),
                ('bathrooms', models.IntegerField()),
                ('living_rooms', models.IntegerField()),
                ('heating_system', models.CharField(max_length=255)),
                ('energy_class', models.CharField(max_length=255)),
                ('construction_year', models.IntegerField()),
                ('availability', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('approved', models.BooleanField(default=False)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Images',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('images', models.ImageField(default='../default_post_vnf7ym', null=True, upload_to='images/')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='listings.listing')),
            ],
        ),
    ]
