from datetime import timedelta
from decimal import Decimal
from listings.models import ShortTermPriceOverride, ShortTermSeasonalPrice


def calculate_booking_price(listing, check_in, check_out):
    """
    Returns:
        total_nights (int)
        total_price (Decimal)
        nights (list of (date, price))
    """
    if check_out <= check_in:
        return 0, Decimal("0.00"), []

    total_price = Decimal("0.00")
    nights = []

    current_date = check_in

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
        total_price += nightly_price
        current_date += timedelta(days=1)

    return len(nights), total_price, nights
