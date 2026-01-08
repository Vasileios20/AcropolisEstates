from datetime import timedelta
from decimal import Decimal
from listings.models import ShortTermPriceOverride


def calculate_booking_price(listing, check_in, check_out):
    """
    Returns (total_nights, total_price)
    """
    if check_out <= check_in:
        return 0, Decimal("0.00")

    total_price = Decimal("0.00")
    nights = (check_out - check_in).days

    current_date = check_in
    while current_date < check_out:
        override = ShortTermPriceOverride.objects.filter(
            listing=listing,
            date=current_date
        ).first()

        nightly_price = (
            Decimal(override.price)
            if override
            else Decimal(listing.price)
        )

        total_price += nightly_price
        current_date += timedelta(days=1)

    return nights, total_price
