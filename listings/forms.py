from django import forms
from .models import Images
from .services import upload_to_backblaze
from .utils import generate_unique_filename


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
