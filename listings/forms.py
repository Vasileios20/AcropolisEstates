from .utils import generate_unique_filename
from .services import upload_to_backblaze
from .models import Images, ShortTermListing
from django.utils.safestring import mark_safe
from django import forms
from pathlib import Path
import json


LANGUAGE_CHOICES = [
    ("en", "English"),
    ("el", "Ελληνικά (Greek)"),
]


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

    # Override tax rate fields to ensure proper validation
    vat_rate = forms.DecimalField(
        label="VAT Rate (%)",
        min_value=0,
        max_value=100,
        max_digits=5,
        decimal_places=2,  # Allows 13.25
        required=False,
        initial=13.00,
        help_text="Enter as percentage (e.g., 13 or 13.25 for 13.25%)"
    )

    municipality_tax_rate = forms.DecimalField(
        label="Municipality Tax Rate (%)",
        min_value=0,
        max_value=100,
        max_digits=5,
        decimal_places=2,  # Allows 1.25
        required=False,
        initial=1.50,
        help_text="Enter as percentage (e.g., 1.5 or 1.25 for 1.25%)"
    )

    service_fee_rate = forms.DecimalField(
        label="Service Fee Rate (%)",
        min_value=0,
        max_value=100,
        max_digits=5,
        decimal_places=2,  # Allows 5.50
        required=False,
        initial=0.00,
        help_text="Enter as percentage (e.g., 5 or 5.5 for 5.5%)"
    )

    class Meta:
        model = ShortTermListing
        fields = "__all__"
        widgets = {
            # Hide actual model fields - populated by JavaScript
            'region_id': forms.HiddenInput(),
            'county_id': forms.HiddenInput(),
            'municipality_id': forms.HiddenInput(),
            'municipality_gr': forms.HiddenInput(),

            # Non-percentage fee fields (EUR amounts)
            'climate_crisis_fee_per_night': forms.NumberInput(attrs={
                'step': '0.01',
                'min': '0',
                'placeholder': '1.50'
            }),
            'cleaning_fee': forms.NumberInput(attrs={
                'step': '0.01',
                'min': '0',
                'placeholder': '0.00'
            }),
        }
        help_texts = {
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
        self.municipality_map = {}

        for region in self.location_data.get("regions", []):
            region_id = region["id"]
            region_name = region["region"]
            self.region_choices.append((region_name, region_name))

            for county in region.get("counties", []):
                county_id = county["id"]
                county_name = county["county"]
                self.county_choices.append((county_name, county_name))

                for municipality in county.get("municipalities", []):
                    municipality_id = municipality["id"]
                    municipality_name = municipality["municipality"]

                    self.municipality_choices.append(
                        (municipality_name, municipality_name)
                    )

                    # Store mapping for JavaScript
                    self.municipality_map[municipality_name] = {
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

        if (selected_municipality and
                selected_municipality in self.municipality_map):
            ids = self.municipality_map[selected_municipality]

            # Populate hidden fields
            cleaned_data["region_id"] = ids["region_id"]
            cleaned_data["county_id"] = ids["county_id"]
            cleaned_data["municipality_id"] = ids["municipality_id"]
            cleaned_data["municipality_gr"] = ids["municipality_name"]

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

        service_fee_rate = cleaned_data.get("service_fee_rate")
        if (service_fee_rate is not None and
                not (0 <= service_fee_rate <= 100)):
            self.add_error(
                "service_fee_rate",
                "Service fee rate must be between 0 and 100"
            )

        # Validate precision (max 2 decimal places for percentages)
        for field_name in [
            'vat_rate', 'municipality_tax_rate', 'service_fee_rate'
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
                            (f"Maximum 2 decimal places allowed."
                             f"You entered {len(decimal_part)} "
                             f"decimal places.")
                        )
