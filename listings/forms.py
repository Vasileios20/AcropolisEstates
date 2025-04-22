from django import forms
from .models import Images, ShortTermListing
from .services import upload_to_backblaze
from .utils import generate_unique_filename
import json
from pathlib import Path
from django.forms import CharField
from django.utils.safestring import mark_safe


class ImagesAdminForm(forms.ModelForm):
    file = forms.FileField(
        widget=forms.ClearableFileInput(attrs={'multiple': False}),
        required=False,
        help_text="Select file to upload."
    )

    class Meta:
        model = Images
        fields = ['listing', 'url', 'is_first', 'order']

    def save(self, commit=True):
        instance = super().save(commit=False)
        file = self.cleaned_data['file']

        if file:
            filename = generate_unique_filename(
                instance.listing.id, instance.listing.id + 1)
            file_url = upload_to_backblaze(file, filename)
            instance.url = file_url
            instance.save()

        if commit:
            instance.save()

        return instance


LANGUAGE_CHOICES = [
    ("en", "English"),
    ("el", "Greek"),
]


class ListingLoacationAdminForm(forms.ModelForm):
    language = forms.ChoiceField(
        choices=LANGUAGE_CHOICES, required=False, label="Language")
    region_display = forms.ChoiceField(label="Region", required=False)
    county_display = forms.ChoiceField(label="County", required=False)
    municipality_display = forms.ChoiceField(
        label="Municipality", required=False)

    class Media:
        js = ("listings/chained_location.js",)

    class Meta:
        model = ShortTermListing
        fields = "__all__"
        widgets = {
            'region': forms.Select(),      # Add these
            'county': forms.Select(),
            'municipality': forms.Select(),
        }

    def render_location_json(self):
        # Used in the admin template to embed the data
        return mark_safe(f"<script>window.locationMap = {json.dumps(self.municipality_map)};</script>")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        selected_lang = self.data.get("language")

        # If not available, try from instance (editing existing record)
        if not selected_lang:
            selected_lang = getattr(self.instance, "language", None)

        # If still none, try to detect from Accept-Language header
        if not selected_lang and hasattr(self, 'request'):
            selected_lang = self.request.GET.get(
                "language")  # ✅ from query param
            if not selected_lang:
                accept_lang = self.request.META.get("HTTP_ACCEPT_LANGUAGE", "")
                if accept_lang.startswith("el"):
                    selected_lang = "el"
                else:
                    selected_lang = "en"

        # Final fallback
        selected_lang = selected_lang or "en"

        # Set the initial language choice
        self.fields["language"].initial = selected_lang

        # Load the correct language-based JSON
        json_file = f"regions_{selected_lang}.json"
        file_path = Path(__file__).resolve().parent.parent / \
            "listings" / "static" / "listings" / json_file
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except FileNotFoundError:
            data = {"regions": []}

        self.location_data = data

        self.region_choices = []
        self.county_choices = []
        self.municipality_choices = []
        self.municipality_map = {}

        # Track initial values
        initial_region_name = None
        initial_county_name = None
        initial_municipality_name = None

        for region in data.get("regions", []):
            region_id = region["id"]
            region_name = region["region"]
            self.region_choices.append((region_name, region_name))

            if self.instance.pk and self.instance.region_id == region_id:
                initial_region_name = region_name

                for county in region.get("counties", []):
                    county_id = county["id"]
                    county_name = county["county"]
                    self.county_choices.append((county_name, county_name))

                    if self.instance.county_id == county_id:
                        initial_county_name = county_name

                    for municipality in county.get("municipalities", []):
                        municipality_id = municipality["id"]
                        municipality_name = municipality["municipality"]
                        self.municipality_choices.append(
                            (municipality_name, municipality_name))

                        self.municipality_map[municipality_name] = {
                            "region_id": region_id,
                            "region_name": region_name,
                            "county_id": county_id,
                            "county_name": county_name,
                            "municipality_id": municipality_id,
                            "municipality_name": municipality_name,
                        }

                        if self.instance.municipality_id == municipality_id:
                            initial_municipality_name = municipality_name
            else:
                # Still populate municipality_map even if this isn't the selected region
                for county in region.get("counties", []):
                    county_id = county["id"]
                    county_name = county["county"]
                    for municipality in county.get("municipalities", []):
                        municipality_id = municipality["id"]
                        municipality_name = municipality["municipality"]
                        self.municipality_map[municipality_name] = {
                            "region_id": region_id,
                            "region_name": region_name,
                            "county_id": county_id,
                            "county_name": county_name,
                            "municipality_id": municipality_id,
                        }

        self.fields["region_display"].choices = self.region_choices
        self.fields["county_display"].choices = self.county_choices
        self.fields["municipality_display"].choices = self.municipality_choices

        self.fields["region_display"].initial = initial_region_name
        self.fields["county_display"].initial = initial_county_name
        self.fields["municipality_display"].initial = initial_municipality_name

        self.fields["municipality_display"].widget.attrs.update({
            "data-selected": initial_municipality_name
        })

        # Hide actual model fields
        # self.fields["region_id"].widget = forms.HiddenInput()
        # self.fields["county_id"].widget = forms.HiddenInput()
        # self.fields["municipality_id"].widget = forms.HiddenInput()

    def clean(self):
        cleaned_data = super().clean()
        selected = cleaned_data.get("municipality_display")

        if selected and selected in self.municipality_map:
            ids = self.municipality_map[selected]
            cleaned_data["region_id"] = ids["region_id"]
            cleaned_data["county_id"] = ids["county_id"]
            cleaned_data["municipality_id"] = ids["municipality_id"]

            cleaned_data["municipality_gr"] = ids["municipality_name"]

        return cleaned_data

# class ShortTermListingAdminForm(forms.ModelForm):
    # language = forms.ChoiceField(
    #     choices=LANGUAGE_CHOICES, required=False, label="Language")
    # municipality_display = forms.ChoiceField(
    #     label="Municipality", required=False)

    # class Meta:
    #     model = ShortTermListing
    #     fields = "__all__"

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)

    #     # Set default language to English
    #     selected_lang = self.data.get("language") or "en"
    #     self.fields["language"].initial = selected_lang

    #     # Load correct JSON
    #     json_file = f"regions_{selected_lang}.json"
    #     file_path = Path(__file__).resolve().parent.parent / \
    #         "listings" / "static" / "listings" / json_file

    #     try:
    #         with open(file_path, "r", encoding="utf-8") as f:
    #             # ✅ Access the "regions" array
    #             data = json.load(f)
    #     except FileNotFoundError:
    #         data = []

    #     municipality_choices = []
    #     self.municipality_map = {}

    #     for region in data.get("regions", []):
    #         region_id = region["id"]
    #         for county in region.get("counties", []):
    #             county_id = county["id"]
    #             raw_municipalities = county.get("municipalities", [])

    #             municipalities = []
    #             for item in raw_municipalities:
    #                 if isinstance(item, list):
    #                     municipalities.extend(item)
    #                 elif isinstance(item, dict):
    #                     municipalities.append(item)

    #             for municipality in municipalities:
    #                 municipality_id = municipality["id"]
    #                 name = municipality["municipality"]

    #                 municipality_choices.append((name, name))
    #                 self.municipality_map[name] = {
    #                     "region_id": region_id,
    #                     "county_id": county_id,
    #                     "municipality_id": municipality_id,
    #                 }

    #     self.fields["municipality_display"].choices = municipality_choices

    #     current_region = None
    #     current_county = None

    #     if self.instance and self.instance.pk:
    #         current_region = self.instance.region_id
    #         current_county = self.instance.county_id
    #         current_municipality = self.instance.municipality
    #         self.initial["municipality_display"] = current_municipality

    #     self.fields["region_display"] = CharField(
    #         label="Region", required=False, disabled=True
    #     )
    #     self.fields["county_display"] = CharField(
    #         label="County", required=False, disabled=True
    #     )

    #     self.initial["region_display"] = next(
    #         (r["region"] for r in data.get("regions", [])
    #          if r["id"] == current_region),
    #         ""
    #     )
    #     for region in data.get("regions", []):
    #         if region["id"] == current_region:
    #             for county in region.get("counties", []):
    #                 if county["id"] == current_county:
    #                     self.initial["county_display"] = county["county"]
    #                     break

    #     if self.instance and self.instance.pk:
    #         current_region = self.instance.region_id
    #         current_county = self.instance.county_id
    #         current_municipality = self.instance.municipality_id

    #         for name, ids in self.municipality_map.items():
    #             if (
    #                 ids["region_id"] == current_region
    #                 and ids["county_id"] == current_county
    #                 and ids["municipality_id"] == current_municipality
    #             ):
    #                 self.initial["municipality_display"] = name
    #                 break

    #     # Hide the actual database fields
    #     self.fields["region_id"].widget = forms.HiddenInput()
    #     self.fields["county_id"].widget = forms.HiddenInput()
    #     self.fields["municipality_id"].widget = forms.HiddenInput()

    # def clean(self):
    #     cleaned_data = super().clean()
    #     selected = cleaned_data.get("municipality_display")

    #     if selected and selected in self.municipality_map:
    #         ids = self.municipality_map[selected]
    #         cleaned_data["region_id"] = ids["region_id"]
    #         cleaned_data["county_id"] = ids["county_id"]
    #         cleaned_data["municipality_id"] = ids["municipality_id"]

    #     return cleaned_data


class ListingHeatingSystemAdminForm(forms.ModelForm):
    class Meta:
        model = ShortTermListing
        fields = "__all__"
        widgets = {
            'heating_system': forms.Select(),
        }
        labels = {
            'heating_system': 'Heating System',
        }
        help_texts = {
            'heating_system': 'Select the heating system for the listing.',
        }
        error_messages = {
            'heating_system': {
                'required': 'Please select a heating system.',
            },
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['heating_system'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Select Heating System',
        })
        self.fields['heating_system'].label = 'Heating System'
        self.fields['heating_system'].help_text = 'Select the heating system for the listing.'
        self.fields['heating_system'].error_messages = {
            'required': 'Please select a heating system.',
        }
        self.fields['heating_system'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Select Heating System',
        })
