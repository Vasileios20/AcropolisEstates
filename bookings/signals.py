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

    context = {
        'first_name': instance.first_name,
        'last_name': instance.last_name,
        'check_in': instance.check_in.strftime('%d/%m/%Y'),
        'check_out': instance.check_out.strftime('%d/%m/%Y'),
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

    if not created and instance.admin_confirmed:

        context = {
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'check_in': instance.check_in.strftime('%d/%m/%Y'),
            'check_out': instance.check_out.strftime('%d/%m/%Y'),

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
