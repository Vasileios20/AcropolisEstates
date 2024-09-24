# Generated by Django 4.2.7 on 2024-09-18 10:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0033_remove_amenities_cctv_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='amenities',
            options={'verbose_name_plural': 'Amenities'},
        ),
        migrations.RemoveField(
            model_name='listing',
            name='heating_system_gr',
        ),
        migrations.RemoveField(
            model_name='listing',
            name='power_type_gr',
        ),
        migrations.AlterField(
            model_name='listing',
            name='heating_system',
            field=models.CharField(blank=True, choices=[('autonomous', 'Autonomous'), ('central', 'Central'), ('air_condition', 'Air Condition'), ('fireplace', 'Fireplace'), ('solar', 'Solar'), ('geothermal', 'Geothermal'), ('other', 'Other'), ('n/a', 'N/A')], max_length=255),
        ),
        migrations.AlterField(
            model_name='listing',
            name='power_type',
            field=models.CharField(blank=True, choices=[('electricity', 'Electricity'), ('gas', 'Gas'), ('natural_gas', 'Natural Gas'), ('heat_pump', 'Heat Pump'), ('other', 'Other'), ('n/a', 'N/A')], max_length=255),
        ),
    ]