from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from bookings.models import ShortTermBooking


@receiver(post_save, sender=ShortTermBooking)
def send_booking_confirmation_email(sender, instance, created, **kwargs):
    """Send initial booking request email to guest"""
    if not created:
        return

    if instance.language == 'el' and instance.listing.title_gr:
        listing_title = instance.listing.title_gr
    elif instance.listing.title:
        listing_title = instance.listing.title
    else:
        listing_title = f"Property ST{str(instance.listing.id).zfill(6)}"

    total_guests = instance.adults + instance.children

    # Calculate original price (without discount) for comparison
    original_total = instance.subtotal + instance.vat + \
        instance.municipality_tax + instance.climate_crisis_fee + \
        instance.cleaning_fee + instance.service_fee

    context = {
        'first_name': instance.first_name,
        'last_name': instance.last_name,
        'check_in': instance.check_in.strftime('%d/%m/%Y'),
        'check_out': instance.check_out.strftime('%d/%m/%Y'),
        'total_guests': total_guests,
        'reference': instance.reference_number,
        'total_nights': instance.total_nights,
        'listing': instance.listing,
        'listing_title': listing_title,
        'currency': instance.listing.currency,

        # Pricing details
        'subtotal': round(instance.subtotal, 2),
        'vat': round(instance.vat, 2),
        'municipality_tax': round(instance.municipality_tax, 2),
        'climate_crisis_fee': round(instance.climate_crisis_fee, 2),
        'cleaning_fee': round(instance.cleaning_fee, 2),
        'service_fee': round(instance.service_fee, 2),
        'total_price': round(instance.total_price, 2),

        # Discount information
        'has_discount': instance.has_discount,
        'discount_type': instance.discount_type,
        'discount_value': round(instance.discount_value, 2),
        'discount_amount': round(instance.discount_amount, 2),
        'discount_reason': instance.discount_reason,
        'discounted_subtotal': round(instance.discounted_subtotal, 2),
        'original_total': round(original_total, 2),

    }

    # Set up email
    language = getattr(instance, 'language', 'en')
    if language == 'el':
        subject = 'Αίτημα Κράτησης – Acropolis Estates'
        html_template = 'emails/booking_request_el.html'
    else:
        subject = 'Booking Request – Acropolis Estates'
        html_template = 'emails/booking_request.html'

    html_content = render_to_string(html_template, context)

    email = EmailMultiAlternatives(
        subject,
        html_content,
        settings.DEFAULT_FROM_EMAIL,
        [instance.email]
    )
    email.attach_alternative(html_content, "text/html")

    try:
        email.send()
    except Exception as e:
        # Log error but don't block booking creation
        print(f"Error sending booking confirmation email: {e}")


@receiver(post_save, sender=ShortTermBooking)
def notify_guest_when_admin_confirms(sender, instance, created, **kwargs):
    """Send confirmation email when admin confirms the booking"""

    # Only send if booking is now admin-confirmed AND not a new creation
    if created:
        return

    # Check if status changed to confirmed or if admin_confirmed was just set
    if not instance.admin_confirmed:
        return

    if instance.language == 'el' and instance.listing.title_gr:
        listing_title = instance.listing.title_gr
    elif instance.listing.title:
        listing_title = instance.listing.title
    else:
        listing_title = f"Property ST{str(instance.listing.id).zfill(6)}"

    total_guests = instance.adults + instance.children

    # Calculate original price (without discount) for comparison
    original_total = instance.subtotal + instance.vat + \
        instance.municipality_tax + instance.climate_crisis_fee + \
        instance.cleaning_fee + instance.service_fee

    context = {
        'first_name': instance.first_name,
        'last_name': instance.last_name,
        'check_in': instance.check_in.strftime('%d/%m/%Y'),
        'check_out': instance.check_out.strftime('%d/%m/%Y'),
        'total_guests': total_guests,
        'reference': instance.reference_number,
        'total_nights': instance.total_nights,
        'listing': instance.listing,
        'listing_title': listing_title,
        'currency': instance.listing.currency,

        # Pricing details
        'subtotal': round(instance.subtotal, 2),
        'vat': round(instance.vat, 2),
        'municipality_tax': round(instance.municipality_tax, 2),
        'climate_crisis_fee': round(instance.climate_crisis_fee, 2),
        'cleaning_fee': round(instance.cleaning_fee, 2),
        'service_fee': round(instance.service_fee, 2),
        'total_price': round(instance.total_price, 2),

        # Discount information
        'has_discount': instance.has_discount,
        'discount_type': instance.discount_type,
        'discount_value': instance.discount_value,
        'discount_amount': round(instance.discount_amount, 2),
        'discount_reason': instance.discount_reason,
        'discounted_subtotal': round(instance.discounted_subtotal, 2),
        'original_total': round(original_total, 2),

    }

    # Set up email
    language = getattr(instance, 'language', 'en')
    if language == 'el':
        subject = 'Επιβεβαίωση Κράτησης – Acropolis Estates'
        html_template = 'emails/booking_confirmed_el.html'
    else:
        subject = 'Booking Confirmation – Acropolis Estates'
        html_template = 'emails/booking_confirmed.html'

    html_content = render_to_string(html_template, context)

    email = EmailMultiAlternatives(
        subject,
        html_content,
        settings.DEFAULT_FROM_EMAIL,
        [instance.email]
    )
    email.attach_alternative(html_content, "text/html")

    try:
        email.send()
    except Exception as e:
        # Log error but don't block booking update
        print(f"Error sending booking confirmation email: {e}")


@receiver(post_save, sender=ShortTermBooking)
def notify_admin_of_new_booking(sender, instance, created, **kwargs):
    """Send notification to admin when new booking is created"""
    if not created:
        return

    total_guests = instance.adults + instance.children

    # Calculate original price (without discount) for comparison
    original_total = instance.subtotal + instance.vat + \
        instance.municipality_tax + instance.climate_crisis_fee + \
        instance.cleaning_fee + instance.service_fee

    context = {
        'id': instance.id,
        'first_name': instance.first_name,
        'last_name': instance.last_name,
        'check_in': instance.check_in.strftime('%d/%m/%Y'),
        'check_out': instance.check_out.strftime('%d/%m/%Y'),
        'total_guests': total_guests,
        'adults': instance.adults,
        'children': instance.children,
        'reference': instance.reference_number,
        'listing': instance.listing,
        'email': instance.email,
        'phone_number': instance.phone_number,
        'message': instance.message,
        'total_nights': instance.total_nights,
        'currency': instance.listing.currency,

        # Pricing details
        'subtotal': round(instance.subtotal, 2),
        'vat': round(instance.vat, 2),
        'municipality_tax': round(instance.municipality_tax, 2),
        'climate_crisis_fee': round(instance.climate_crisis_fee, 2),
        'cleaning_fee': round(instance.cleaning_fee, 2),
        'service_fee': round(instance.service_fee, 2),
        'total_price': round(instance.total_price, 2),

        # Discount information
        'has_discount': instance.has_discount,
        'discount_type': instance.discount_type,
        'discount_value': round(instance.discount_value, 2),
        'discount_amount': round(instance.discount_amount, 2),
        'discount_reason': instance.discount_reason,
        'discount_applied_by': instance.discount_applied_by,
        'discount_applied_at': instance.discount_applied_at,
        'discounted_subtotal': round(instance.discounted_subtotal, 2),
        'original_total': round(original_total, 2),

        # Tax rates for display
        'vat_rate': round(instance.listing.vat_rate, 2),
        'municipality_tax_rate': round(
            instance.listing.municipality_tax_rate, 2
        ),
    }

    language = getattr(instance, 'language', 'en')
    if language == 'el':
        subject = 'Νέα Κράτηση – Acropolis Estates'
        html_template = 'emails/admin_new_booking_notification_el.html'
    else:
        subject = 'New Booking Request Received – Acropolis Estates'
        html_template = 'emails/admin_new_booking_notification.html'

    html_content = render_to_string(html_template, context)

    email = EmailMultiAlternatives(
        subject,
        html_content,
        settings.DEFAULT_FROM_EMAIL,
        [settings.SERVER_EMAIL]
    )
    email.attach_alternative(html_content, "text/html")

    try:
        email.send()
    except Exception as e:
        # Log error but don't block booking creation
        print(f"Error sending admin notification email: {e}")
