"""
File models for listing documents (offers, contracts, inspections, etc.)
Uses default storage backend (Backblaze B2).
"""
from django.db import models
from django.contrib.auth.models import User


# File type choices covering comprehensive real estate documentation
FILE_TYPE_CHOICES = [
    ('offer', 'Offer/Proposal'),
    ('contract', 'Contract'),
    ('inspection', 'Inspection Report'),
    ('appraisal', 'Appraisal/Valuation'),
    ('title_deed', 'Title Deed'),
    ('energy_certificate', 'Energy Performance Certificate'),
    ('floor_plan', 'Floor Plan'),
    ('survey', 'Survey/Topographical Plan'),
    ('permit', 'Building Permit'),
    ('tax_document', 'Tax Document'),
    ('utility_bill', 'Utility Bill'),
    ('insurance', 'Insurance Document'),
    ('correspondence', 'Correspondence/Email'),
    ('note', 'Internal Note'),
    ('photo_additional', 'Additional Photos'),
    ('legal', 'Legal Document'),
    ('financial', 'Financial Statement'),
    ('municipal_approval', 'Municipal Approval'),
    ('zoning', 'Zoning Document'),
    ('environmental', 'Environmental Report'),
    ('structural', 'Structural Report'),
    ('mortgage', 'Mortgage Document'),
    ('lease', 'Lease Agreement'),
    ('other', 'Other'),
]


class ListingFile(models.Model):
    """
    File model for regular listings (sale/rent).
    Stores documents related to a specific listing.
    Files are stored in Backblaze B2 (same as OwnerFile).
    """
    listing = models.ForeignKey(
        'Listing',  # String reference - avoids circular import
        related_name="files",
        on_delete=models.CASCADE,
        help_text="The listing this file belongs to"
    )
    file = models.FileField(
        upload_to="listing_files/%Y/%m/%d/",
        help_text="Upload document file"
    )
    file_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Original filename"
    )
    file_type = models.CharField(
        max_length=50,
        choices=FILE_TYPE_CHOICES,
        default='other',
        help_text="Type of document"
    )
    description = models.TextField(
        blank=True,
        help_text="Optional description or notes about this file"
    )
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_listing_files",
        help_text="Agent who uploaded this file"
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this file was uploaded"
    )

    class Meta:
        verbose_name = "Listing File"
        verbose_name_plural = "Listing Files"
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.get_file_type_display()} for {self.listing}"

    def save(self, *args, **kwargs):
        # Store original filename if not already set
        if self.file and not self.file_name:
            self.file_name = self.file.name
        super().save(*args, **kwargs)


class ShortTermListingFile(models.Model):
    """
    File model for short-term rental listings.
    Stores documents related to a specific short-term listing.
    Files are stored in Backblaze B2 (same as OwnerFile).
    """
    listing = models.ForeignKey(
        'ShortTermListing',  # String reference - avoids circular import
        related_name="files",
        on_delete=models.CASCADE,
        help_text="The short-term listing this file belongs to"
    )
    file = models.FileField(
        upload_to="short_term_listing_files/%Y/%m/%d/",
        help_text="Upload document file"
    )
    file_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Original filename"
    )
    file_type = models.CharField(
        max_length=50,
        choices=FILE_TYPE_CHOICES,
        default='other',
        help_text="Type of document"
    )
    description = models.TextField(
        blank=True,
        help_text="Optional description or notes about this file"
    )
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_short_term_listing_files",
        help_text="Agent who uploaded this file"
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this file was uploaded"
    )

    class Meta:
        verbose_name = "Short Term Listing File"
        verbose_name_plural = "Short Term Listing Files"
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.get_file_type_display()} for {self.listing}"

    def save(self, *args, **kwargs):
        # Store original filename if not already set
        if self.file and not self.file_name:
            self.file_name = self.file.name
        super().save(*args, **kwargs)
