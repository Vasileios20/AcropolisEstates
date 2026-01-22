from .utils import generate_unique_filename
from .services import upload_to_backblaze
from .models import Images, ShortTermListing
from django.utils.safestring import mark_safe
from django import forms
from django.forms.widgets import NumberInput
from pathlib import Path
import json
from decimal import Decimal, InvalidOperation


LANGUAGE_CHOICES = [
    ("en", "English"),
    ("el", "Ελληνικά (Greek)"),
]


class DecimalNumberInput(NumberInput):
    """
    Custom NumberInput widget that formats decimal values
    to exactly 2 decimal places.
    This fixes the issue where 13.00 displays as 13.000 in the input field.
    """

    def format_value(self, value):
        """Format the value to exactly 2 decimal places."""
        if value is None or value == '':
            return None

        try:
            # Convert to Decimal and normalize to 2 decimal places
            decimal_value = Decimal(str(value))
            normalized = decimal_value.quantize(Decimal('0.01'))
            # Return as string with exactly 2 decimal places
            result = f"{normalized:.2f}"
            print(f"DecimalNumberInput.format_value: {value} -> {result}")
            return result
        except (ValueError, TypeError, InvalidOperation) as e:
            print(f"DecimalNumberInput.format_value error: {e}")
            return value


class ImagesAdminForm(forms.ModelForm):
    """Form for uploading listing images to Backblaze."""

    file = forms.FileField(
        widget=forms.ClearableFileInput(attrs={'multiple': False}),
        required=False,
        help_text="Select file to upload."
    )

    class Meta:
        model = Images
        fields = ['listing', 'url', 'is_first', 'order']

    def save(self, commit=True):
        """Upload file to Backblaze and save URL to instance."""
        instance = super().save(commit=False)
        file = self.cleaned_data.get('file')

        if file:
            filename = generate_unique_filename(
                instance.listing.id,
                instance.listing.id + 1
            )
            file_url = upload_to_backblaze(file, filename)
            instance.url = file_url

        if commit:
            instance.save()

        return instance


class ListingLocationAdminForm(forms.ModelForm):
    """
    Admin form with chained location dropdowns and tax configuration.

    Provides cascading region -> county -> municipality selection
    with language support (Greek/English) and integrated tax field
    configuration for Greek short-term rental regulations.

    Tax Rate Storage Strategy:
    Store as percentage (13.25) and convert to decimal (0.1325)
    during calculation.
    """

    language = forms.ChoiceField(
        choices=LANGUAGE_CHOICES,
        required=True,
        label="Language",
        help_text="Select language to load location data"
    )

    region_display = forms.ChoiceField(
        label="Region",
        required=False,
        help_text="Select region first"
    )

    county_display = forms.ChoiceField(
        label="County",
        required=False,
        help_text="County within selected region"
    )

    municipality_display = forms.ChoiceField(
        label="Municipality",
        required=True,
        help_text="Municipality/City"
    )

    class Meta:
        model = ShortTermListing
        fields = "__all__"
        widgets = {
            # Hide actual model fields - populated by JavaScript
            'region_id': forms.HiddenInput(),
            'county_id': forms.HiddenInput(),
            'municipality_id': forms.HiddenInput(),

            # DECIMAL FIELDS WITH CUSTOM WIDGET - THIS IS THE FIX!
            'vat_rate': DecimalNumberInput(attrs={
                'step': '0.01',
                'min': '0',
                'max': '100',
            }),
            'municipality_tax_rate': DecimalNumberInput(attrs={
                'step': '0.01',
                'min': '0',
                'max': '100',
            }),
            'service_fee': DecimalNumberInput(attrs={
                'step': '0.01',
                'min': '0',
                'max': '100',
            }),
            'climate_crisis_fee_per_night': DecimalNumberInput(attrs={
                'step': '0.01',
                'min': '0',
                'placeholder': '1.50'
            }),
            'cleaning_fee': DecimalNumberInput(attrs={
                'step': '0.01',
                'min': '0',
                'placeholder': '0.00'
            }),
            'price': DecimalNumberInput(attrs={
                'step': '0.01',
                'min': '0',
            }),
        }
        help_texts = {
            'vat_rate': 'Enter as percentage (e.g., 13.00 for 13%)',
            'municipality_tax_rate': (
                'Enter as percentage (e.g., 1.50 for 1.5%)'),
            'service_fee': 'Enter as percentage (e.g., 5.00 for 5%)',
            'climate_crisis_fee_per_night': 'Amount in EUR per night',
            'cleaning_fee': 'One-time fee in EUR',
        }

    class Media:
        js = ("listings/chained_location.js",)
        css = {
            'all': ('listings/admin_custom.css',)
        }

    def __init__(self, *args, **kwargs):
        """Initialize form with location data and tax fields."""
        super().__init__(*args, **kwargs)

        # Detect selected language
        selected_lang = self._detect_language()
        self.fields["language"].initial = selected_lang

        # Load location data for selected language
        self.location_data = self._load_location_data(selected_lang)

        # Build choices and municipality map
        self._build_location_choices()

        # Set initial values for existing records
        self._set_initial_values()

    def _detect_language(self):
        """
        Detect language from multiple sources.

        Priority: POST data > instance field > request > default

        Returns:
            str: Language code ('en' or 'el')
        """
        # 1. From POST data (form submission)
        selected_lang = self.data.get("language")

        # 2. From existing instance
        if not selected_lang and self.instance.pk:
            # Infer from municipality_gr field presence
            selected_lang = "el" if self.instance.municipality_gr else "en"

        # 3. From request (if available)
        if not selected_lang and hasattr(self, 'request'):
            selected_lang = self.request.GET.get("language")

            if not selected_lang:
                accept_lang = self.request.META.get(
                    "HTTP_ACCEPT_LANGUAGE", ""
                )
                selected_lang = "el" if accept_lang.startswith("el") else "en"

        # 4. Default fallback
        return selected_lang or "en"

    def _load_location_data(self, language):
        """
        Load JSON location data for specified language.

        Args:
            language (str): Language code ('en' or 'el')

        Returns:
            dict: Location hierarchy data
        """
        json_file = f"regions_{language}.json"
        file_path = (
            Path(__file__).resolve().parent.parent
            / "listings" / "static" / "listings" / json_file
        )

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: {json_file} not found, using empty data")
            return {"regions": []}

    def _build_location_choices(self):
        """
        Build dropdown choices and create municipality mapping.

        Creates self.region_choices, self.county_choices,
        self.municipality_choices, and self.municipality_map
        for JavaScript interaction.
        """
        self.region_choices = [("", "---------")]
        self.county_choices = [("", "---------")]
        self.municipality_choices = [("", "---------")]
        self.municipality_map = {}  # Maps unique_key -> location data

        for region in self.location_data.get("regions", []):
            region_id = region["id"]
            region_name = region["region"]
            self.region_choices.append((region_name, region_name))

            for county in region.get("counties", []):
                county_id = county["id"]
                county_name = county["county"]
                self.county_choices.append((county_name, county_name))

                for municipality in county.get(
                        "municipalities", []):
                    municipality_id = municipality["id"]
                    municipality_name = municipality["municipality"]

                    # Use unique composite key
                    unique_key = (
                        f"{region_id}-{county_id}-{municipality_id}"
                    )

                    display_value = municipality_name

                    self.municipality_choices.append(
                        (unique_key, display_value)
                    )

                    # Store mapping with unique key
                    self.municipality_map[unique_key] = {
                        "region_id": region_id,
                        "region_name": region_name,
                        "county_id": county_id,
                        "county_name": county_name,
                        "municipality_id": municipality_id,
                        "municipality_name": municipality_name,
                    }

        # Apply choices to fields
        self.fields["region_display"].choices = self.region_choices
        self.fields["county_display"].choices = self.county_choices
        self.fields["municipality_display"].choices = (
            self.municipality_choices
        )

    def _set_initial_values(self):
        """Set initial dropdown values when editing existing records."""
        if not self.instance.pk:
            return

        initial_region_name = None
        initial_county_name = None
        initial_municipality_name = None

        # Find names corresponding to saved IDs
        for region in self.location_data.get("regions", []):
            if self.instance.region_id == region["id"]:
                initial_region_name = region["region"]

                for county in region.get("counties", []):
                    if self.instance.county_id == county["id"]:
                        initial_county_name = county["county"]

                        for muni in county.get("municipalities", []):
                            if self.instance.municipality_id == muni["id"]:
                                initial_municipality_name = (
                                    muni["municipality"]
                                )
                                break

        # Set initial values
        self.fields["region_display"].initial = initial_region_name
        self.fields["county_display"].initial = initial_county_name
        self.fields["municipality_display"].initial = (
            initial_municipality_name
        )

        # Store selected municipality for JavaScript
        if initial_municipality_name:
            self.fields["municipality_display"].widget.attrs.update({
                "data-selected": initial_municipality_name
            })

    def render_location_json(self):
        """
        Render JavaScript with location map data.

        Returns:
            SafeString: Script tag with location data as JSON
        """
        location_map_json = json.dumps(self.municipality_map)
        script_content = (
            f"<script>window.locationMap = {location_map_json};</script>"
        )
        return mark_safe(script_content)

    def _lookup_municipality_name_in_language(self, region_id, county_id,
                                              municipality_id, language):
        """
        Look up municipality name from alternate language JSON.

        Args:
            region_id (int): Region ID
            county_id (int): County ID
            municipality_id (int): Municipality ID
            language (str): Language code ('en' or 'el')

        Returns:
            str: Municipality name in requested language, or None if not found
        """
        try:
            # Load the alternate language JSON
            alternate_data = self._load_location_data(language)

            # Find the municipality with matching IDs
            for region in alternate_data.get("regions", []):
                if region["id"] == region_id:
                    for county in region.get("counties", []):
                        if county["id"] == county_id:
                            for municipality in county.get(
                                    "municipalities", []):
                                if municipality["id"] == municipality_id:
                                    return municipality["municipality"]

            return None

        except Exception as e:
            return f"Error loading {language} JSON: {e}"

    def clean_vat_rate(self):
        """Ensure VAT rate is stored with exactly 2 decimal places"""
        value = self.cleaned_data.get('vat_rate')
        if value is not None:
            normalized = Decimal(str(value)).quantize(Decimal('0.01'))
            print(f"clean_vat_rate: {value} -> {normalized}")
            return normalized
        return value

    def clean_municipality_tax_rate(self):
        """
        Ensure municipality tax rate is stored with exactly 2 decimal places
        """
        value = self.cleaned_data.get('municipality_tax_rate')
        if value is not None:
            return Decimal(str(value)).quantize(Decimal('0.01'))
        return value

    def clean_service_fee(self):
        """Ensure service fee rate is stored with exactly 2 decimal places"""
        value = self.cleaned_data.get('service_fee')
        if value is not None:
            return Decimal(str(value)).quantize(Decimal('0.01'))
        return value

    def clean_climate_crisis_fee_per_night(self):
        """Ensure climate crisis fee is stored with exactly 2 decimal places"""
        value = self.cleaned_data.get('climate_crisis_fee_per_night')
        if value is not None:
            return Decimal(str(value)).quantize(Decimal('0.01'))
        return value

    def clean_cleaning_fee(self):
        """Ensure cleaning fee is stored with exactly 2 decimal places"""
        value = self.cleaned_data.get('cleaning_fee')
        if value is not None:
            return Decimal(str(value)).quantize(Decimal('0.01'))
        return value

    def clean_price(self):
        """Ensure price is stored with exactly 2 decimal places"""
        value = self.cleaned_data.get('price')
        if value is not None:
            return Decimal(str(value)).quantize(Decimal('0.01'))
        return value

    def clean(self):
        """
        Validate form and populate hidden ID fields.

        Returns:
            dict: Cleaned form data

        Raises:
            ValidationError: If municipality is invalid or tax rates
                           are out of range
        """
        cleaned_data = super().clean()
        selected_municipality = cleaned_data.get("municipality_display")
        selected_language = cleaned_data.get("language", "en")

        if (selected_municipality and
                selected_municipality in self.municipality_map):
            ids = self.municipality_map[selected_municipality]

            # Populate hidden ID fields
            cleaned_data["region_id"] = ids["region_id"]
            cleaned_data["county_id"] = ids["county_id"]
            cleaned_data["municipality_id"] = ids["municipality_id"]

            # Get municipality name in CURRENT language
            current_language_name = ids["municipality_name"]

            # Look up municipality name in ALTERNATE language
            alternate_language = "en" if selected_language == "el" else "el"
            alternate_name = self._lookup_municipality_name_in_language(
                ids["region_id"],
                ids["county_id"],
                ids["municipality_id"],
                alternate_language
            )

            # Populate BOTH fields with proper language separation
            if selected_language == "el":
                # El selected: municipality_gr = Greek, municipality = English
                cleaned_data["municipality_gr"] = current_language_name
                cleaned_data["municipality"] = (
                    alternate_name if alternate_name else current_language_name
                )
            else:
                # En selected: municipality = English, municipality_gr = Greek
                cleaned_data["municipality"] = current_language_name
                cleaned_data["municipality_gr"] = (
                    alternate_name if alternate_name else current_language_name
                )

        elif selected_municipality:
            # Municipality selected but not in map
            raise forms.ValidationError(
                f"Invalid municipality selected: {selected_municipality}"
            )

        # Validate tax rates
        self._validate_tax_rates(cleaned_data)

        return cleaned_data

    def _validate_tax_rates(self, cleaned_data):
        """
        Validate that tax rates are within acceptable ranges.

        Args:
            cleaned_data (dict): Form cleaned data
        """
        vat_rate = cleaned_data.get("vat_rate")
        if vat_rate is not None and not (0 <= vat_rate <= 100):
            self.add_error(
                "vat_rate",
                "VAT rate must be between 0 and 100"
            )

        municipality_tax_rate = cleaned_data.get("municipality_tax_rate")
        if (municipality_tax_rate is not None and
                not (0 <= municipality_tax_rate <= 100)):
            self.add_error(
                "municipality_tax_rate",
                "Municipality tax rate must be between 0 and 100"
            )

        service_fee = cleaned_data.get("service_fee")
        if (service_fee is not None and
                not (0 <= service_fee <= 100)):
            self.add_error(
                "service_fee",
                "Service fee rate must be between 0 and 100"
            )

        # Validate precision (max 2 decimal places for percentages)
        for field_name in [
            'vat_rate', 'municipality_tax_rate', 'service_fee'
        ]:
            value = cleaned_data.get(field_name)
            if value is not None:
                # Check if more than 2 decimal places
                str_value = str(value)
                if '.' in str_value:
                    decimal_part = str_value.split('.')[1]
                    if len(decimal_part) > 2:
                        self.add_error(
                            field_name,
                            (f"Maximum 2 decimal places allowed. "
                             f"You entered {len(decimal_part)} "
                             f"decimal places.")
                        )
