from datetime import timedelta
from decimal import Decimal
from listings.models import (
    ShortTermPriceOverride,
    ShortTermSeasonalPrice
)


def calculate_booking_price(listing, check_in, check_out):
    """
    Calculate booking price with all taxes and fees based on
    listing configuration.

    Tax rates are stored as percentages (13.25) and converted
    to decimals (0.1325)
    for calculation.

    Returns:
        dict: {
            'subtotal': Decimal,
            'vat': Decimal,
            'municipality_tax': Decimal,
            'climate_crisis_fee': Decimal,
            'cleaning_fee': Decimal,
            'service_fee': Decimal,
            'total': Decimal,
            'nights': int,
            'breakdown': list of (date, price)
        }
    """
    if check_out <= check_in:
        return {
            'subtotal': Decimal("0.00"),
            'vat': Decimal("0.00"),
            'municipality_tax': Decimal("0.00"),
            'climate_crisis_fee': Decimal("0.00"),
            'cleaning_fee': Decimal("0.00"),
            'service_fee': Decimal("0.00"),
            'total': Decimal("0.00"),
            'nights': 0,
            'breakdown': []
        }

    subtotal = Decimal("0.00")
    nights = []
    current_date = check_in

    # Calculate base price for each night
    while current_date < check_out:
        override = ShortTermPriceOverride.objects.filter(
            listing=listing,
            date=current_date
        ).first()

        season = ShortTermSeasonalPrice.objects.filter(
            listing=listing,
            start_date__lte=current_date,
            end_date__gt=current_date
        ).first()

        if override:
            nightly_price = Decimal(override.price)
        elif season:
            nightly_price = Decimal(season.price)
        else:
            nightly_price = Decimal(listing.price)

        nights.append((current_date, nightly_price))
        subtotal += nightly_price
        current_date += timedelta(days=1)

    num_nights = len(nights)

    # Convert percentage rates to decimal for calculation
    # 13.25% -> 0.1325
    vat_rate = Decimal(listing.vat_rate) / Decimal('100')
    municipality_tax_rate = Decimal(
        listing.municipality_tax_rate) / Decimal('100')
    service_fee_rate = Decimal(listing.service_fee_rate) / Decimal('100')

    # Calculate taxes and fees
    vat = subtotal * vat_rate
    municipality_tax = subtotal * municipality_tax_rate
    climate_crisis_fee = Decimal(
        listing.climate_crisis_fee_per_night) * num_nights
    cleaning_fee = Decimal(listing.cleaning_fee)  # One-time fee
    service_fee = subtotal * service_fee_rate

    # Total price
    total = subtotal + vat + municipality_tax + \
        climate_crisis_fee + cleaning_fee + service_fee

    return {
        'subtotal': subtotal,
        'vat': vat,
        'municipality_tax': municipality_tax,
        'climate_crisis_fee': climate_crisis_fee,
        'cleaning_fee': cleaning_fee,
        'service_fee': service_fee,
        'total': total,
        'nights': num_nights,
        'breakdown': nights
    }


def get_listing_availability(listing, start_date, end_date):
    """
    Returns a list of dicts with availability and pricing info.

    Returns:
        list: [
            {
                "date": date,
                "available": bool,
                "price": Decimal,
            }
        ]
    """
    from .models import ShortTermBookingNight

    results = []
    current_date = start_date

    # Fetch booked nights once (fast, safe)
    booked_dates = set(
        ShortTermBookingNight.objects.filter(
            booking__listing=listing,
            date__gte=start_date,
            date__lt=end_date,
        ).values_list("date", flat=True)
    )

    while current_date < end_date:
        # Availability
        is_available = current_date not in booked_dates

        # Pricing
        override = ShortTermPriceOverride.objects.filter(
            listing=listing,
            date=current_date
        ).first()

        season = ShortTermSeasonalPrice.objects.filter(
            listing=listing,
            start_date__lte=current_date,
            end_date__gt=current_date
        ).first()

        if override:
            price = Decimal(override.price)
        elif season:
            price = Decimal(season.price)
        else:
            price = Decimal(listing.price)

        results.append({
            "date": current_date,
            "available": is_available,
            "price": price,
        })

        current_date += timedelta(days=1)

    return results
