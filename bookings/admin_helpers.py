"""
Helper functions for Django admin UI components
Keeps admin.py clean by separating HTML rendering logic
"""

from django.http import HttpResponse
from django.urls import reverse
from django.utils.safestring import mark_safe


def get_csrf_token(request):
    """Get CSRF token from request"""
    from django.middleware.csrf import get_token
    return get_token(request)


def render_discount_form(request, booking):
    """
    Render the discount application form as HTML popup

    Args:
        request: Django request object
        booking: ShortTermBooking instance

    Returns:
        HttpResponse with HTML form
    """
    csrf = get_csrf_token(request)

    html = f'''
<!DOCTYPE html>
<html>
<head>
    <title>Apply Discount - {booking.reference_number}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f5f5f5;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            margin-top: 0;
            color: #212529;
            font-size: 24px;
        }}
        .info-box {{
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 25px;
            border-left: 4px solid #2196F3;
        }}
        .info-box p {{
            margin: 5px 0;
            color: #0d47a1;
        }}
        .field {{
            margin-bottom: 20px;
        }}
        label {{
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #212529;
        }}
        label .required {{
            color: #dc3545;
        }}
        input, select {{
            width: 100%;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }}
        input:focus, select:focus {{
            outline: none;
            border-color: #28a745;
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        }}
        small {{
            display: block;
            margin-top: 5px;
            color: #6c757d;
            font-size: 13px;
        }}
        .btn-group {{
            display: flex;
            gap: 10px;
            margin-top: 25px;
        }}
        .btn {{
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            flex: 1;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            transition: all 0.2s;
        }}
        .btn-primary {{
            background: #28a745;
            color: white;
        }}
        .btn-primary:hover {{
            background: #218838;
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }}
        .btn-secondary {{
            background: #6c757d;
            color: white;
        }}
        .btn-secondary:hover {{
            background: #5a6268;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 Apply Discount</h1>

        <div class="info-box">
            <p><strong>Booking:</strong> {booking.reference_number}</p>
            <p><strong>Guest:</strong> {booking.first_name} {booking.last_name}</p>
            <p><strong>Dates:</strong> {booking.check_in} to {booking.check_out} ({booking.total_nights} nights)</p>
            <p><strong>Current Total:</strong> €{booking.total_price:.2f}</p>
        </div>

        <form method="post">
            <input type="hidden" name="csrfmiddlewaretoken" value="{csrf}">
            <input type="hidden" name="action" value="apply">
            <div class="field">
                <label>
                    Discount Type <span class="required">*</span>
                </label>
                <select name="discount_type" required id="type-select">
                    <option value="">Select discount type...</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (€)</option>
                </select>
            </div>

            <div class="field">
                <label>
                    Discount Value <span class="required">*</span>
                </label>
                <input type="number" 
                       name="discount_value" 
                       id="value-input"
                       step="0.01" 
                       min="0.01" 
                       required 
                       placeholder="Enter value">
                <small id="help-text">Select a type first</small>
            </div>

            <div class="field">
                <label>Reason (Optional)</label>
                <input type="text" 
                       name="discount_reason" 
                       placeholder="e.g., VIP customer, Early bird, Compensation">
            </div>

            <div class="btn-group">
                <button type="submit" class="btn btn-primary">
                    Apply Discount
                </button>
                <a href="javascript:window.close()" class="btn btn-secondary">
                    Cancel
                </a>
            </div>
        </form>
    </div>

    <script>
        // Update help text based on discount type
        const typeSelect = document.getElementById('type-select');
        const valueInput = document.getElementById('value-input');
        const helpText = document.getElementById('help-text');

        typeSelect.addEventListener('change', function() {{
            if (this.value === 'percentage') {{
                valueInput.placeholder = 'e.g., 15 for 15%';
                valueInput.max = '100';
                helpText.textContent = 'Enter percentage (0-100). Example: 15 for 15% off';
            }} else if (this.value === 'fixed') {{
                valueInput.placeholder = 'e.g., 50 for €50';
                valueInput.removeAttribute('max');
                helpText.textContent = 'Enter amount in EUR. Example: 50 for €50 off';
            }} else {{
                valueInput.placeholder = 'Enter value';
                valueInput.removeAttribute('max');
                helpText.textContent = 'Select a type first';
            }}
        }});
    </script>
</body>
</html>'''

    return HttpResponse(html)


def render_discount_controls(obj, request):
    """
    Render discount controls panel for admin change form

    Args:
        obj: ShortTermBooking instance
        request: Django request object (for CSRF token)

    Returns:
        SafeString with HTML
    """
    # Get CSRF token
    csrf_token = ''
    if request:
        csrf_token = get_csrf_token(request)

    # Get discount URL
    url = reverse(
        'admin:bookings_shorttermbooking_discount',
        args=[obj.pk]
    )

    html = (
        '<div style="background: #f8f9fa; padding: 20px; '
        'border-radius: 5px;">'
    )

    # Show current discount if exists
    if obj.has_discount:
        discount_symbol = '%' if obj.discount_type == 'percentage' else '€'

        html += (
            '<div style="background: #fff3cd; padding: 15px; '
            'border-radius: 5px; margin-bottom: 15px; '
            'border-left: 4px solid #ffc107;">'
            '<h3 style="margin-top: 0; color: #856404;">🎟️ Active Discount</h3>'
            f'<p style="margin: 5px 0;"><strong>Type:</strong> '
            f'{obj.get_discount_type_display()}</p>'
            f'<p style="margin: 5px 0;"><strong>Value:</strong> '
            f'{obj.discount_value}{discount_symbol}</p>'
            f'<p style="margin: 5px 0;"><strong>Amount:</strong> '
            f'<span style="color: #dc3545; font-weight: bold;">'
            f'-€{obj.discount_amount:.2f}</span></p>'
        )

        if obj.discount_reason:
            html += (
                f'<p style="margin: 5px 0;"><strong>Reason:</strong> '
                f'{obj.discount_reason}</p>'
            )

        if obj.discount_applied_by:
            html += (
                f'<p style="margin: 5px 0; font-size: 12px; color: #6c757d;">'
                f'Applied by {obj.discount_applied_by.username}'
            )
            if obj.discount_applied_at:
                html += f' on {obj.discount_applied_at.strftime("%Y-%m-%d %H:%M")}'
            html += '</p>'

        # Remove button
        html += f'<form method="post" action="{url}" style="margin-top: 10px;">'
        if csrf_token:
            html += (
                f'<input type="hidden" name="csrfmiddlewaretoken" '
                f'value="{csrf_token}">'
            )
        html += '<input type="hidden" name="action" value="remove">'
        html += (
            '<button type="submit" '
            'onclick="return confirm(\'Are you sure you want to remove this discount?\')" '
            'style="background: #dc3545; color: white; padding: 8px 16px; '
            'border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">'
            '🗑️ Remove Discount'
            '</button>'
            '<input name="action" value="remove">'
        )
        html += '</form></div>'
    else:
        html += (
            '<div style="background: #d1ecf1; padding: 15px; '
            'border-radius: 5px; margin-bottom: 15px; '
            'border-left: 4px solid #17a2b8;">'
            '<p style="margin: 0; color: #0c5460;">'
            '<strong>ℹ️ No discount applied</strong></p>'
            '</div>'
        )

    # Apply/Modify button
    if obj.can_apply_discount:
        button_text = '✏️ Modify Discount' if obj.has_discount else '➕ Apply Discount'
        html += (
            f'<a href="{url}" target="_blank" '
            'style="background: #28a745; color: white; padding: 12px 24px; '
            'text-decoration: none; border-radius: 4px; display: inline-block; '
            f'font-weight: 600;">{button_text}</a>'
        )
    else:
        html += (
            '<div style="background: #f8d7da; padding: 15px; '
            'border-radius: 5px; border-left: 4px solid #dc3545;">'
            '<p style="margin: 0; color: #721c24;">'
            '<strong>⚠️ Cannot apply discount</strong><br>'
            'Discounts can only be applied to pending or confirmed bookings.<br>'
            f'Current status: <strong>{obj.get_status_display()}</strong>'
            '</p></div>'
        )

    html += '</div>'

    return mark_safe(html)
