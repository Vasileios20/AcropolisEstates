from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from bookings.models import ShortTermBooking


@receiver(post_save, sender=ShortTermBooking)
def send_booking_confirmation_email(sender, instance, created, **kwargs):
    if not created:
        return

    total_guests = instance.adults + instance.children

    context = {
        'first_name': instance.first_name,
        'last_name': instance.last_name,
        'check_in': instance.check_in.strftime('%d/%m/%Y'),
        'check_out': instance.check_out.strftime('%d/%m/%Y'),
        'total_guests': total_guests,
        'reference': instance.reference_number,
    }

    # Set up email
    language = getattr(instance, 'language', 'en')
    if language == 'el':
        subject = 'Αίτημα Κράτησης – Acropolis Estates'
        html_template = 'emails/booking_confirmation_el.html'
    else:
        subject = 'Booking Request – Acropolis Estates'
        html_template = 'emails/booking_confirmation.html'

    html_content = render_to_string(html_template, context)

    email = EmailMultiAlternatives(
        subject,
        html_content,
        settings.DEFAULT_FROM_EMAIL,
        [instance.email]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()


@receiver(post_save, sender=ShortTermBooking)
def notify_guest_when_admin_confirms(sender, instance, created, **kwargs):

    # Only send if booking is now admin-confirmed AND already user-confirmed
    total_guests = instance.adults + instance.children
    if not created and instance.admin_confirmed:

        context = {
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'check_in': instance.check_in.strftime('%d/%m/%Y'),
            'check_out': instance.check_out.strftime('%d/%m/%Y'),
            'total_guests': total_guests,
            'reference': instance.reference_number,

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
        email.send()


@receiver(post_save, sender=ShortTermBooking)
def notify_admin_of_new_booking(sender, instance, created, **kwargs):
    if created:
        total_guests = instance.adults + instance.children

        context = {
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
            'total_price': instance.total_price,
            'total_nights': instance.total_nights,
            'currency': instance.listing.currency,
        }

        language = getattr(instance, 'language', 'en')
        if language == 'el':
            subject = 'Επιβεβαίωση Κράτησης – Acropolis Estates'
            html_template = 'emails/admin_new_booking_notification_el.html'
        else:
            subject = 'New Booking Request Received'
            html_template = 'emails/admin_new_booking_notification.html'

        html_content = render_to_string(html_template, context)

        email = EmailMultiAlternatives(
            subject,
            html_content,
            settings.DEFAULT_FROM_EMAIL,
            [settings.SERVER_EMAIL]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
