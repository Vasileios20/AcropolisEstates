def get_discount_styles():
    """Return CSS styles for discount management UI"""
    return """
        <style>
            .discount-container {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont,
                             "Segoe UI", Roboto, sans-serif;
            }
            .discount-active {
                background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 15px;
                border-left: 5px solid #ffc107;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .discount-active h3 {
                margin: 0 0 15px 0;
                color: #856404;
                font-size: 18px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .discount-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
                margin-bottom: 15px;
            }
            .discount-info-item {
                background: rgba(255,255,255,0.6);
                padding: 10px;
                border-radius: 5px;
            }
            .discount-info-item strong {
                display: block;
                color: #856404;
                font-size: 12px;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .discount-info-item span {
                color: #333;
                font-size: 16px;
                font-weight: 600;
            }
            .discount-amount {
                color: #dc3545 !important;
                font-size: 20px !important;
            }
            .discount-meta {
                background: rgba(255,255,255,0.4);
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 12px;
                color: #6c757d;
                margin-top: 10px;
            }
            .discount-none {
                background: #e7f3ff;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                border-left: 5px solid #17a2b8;
                color: #0c5460;
            }
            .discount-form {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #28a745;
                margin-bottom: 15px;
                box-shadow: 0 2px 8px rgba(40,167,69,0.1);
            }
            .discount-form h4 {
                margin: 0 0 15px 0;
                color: #28a745;
                font-size: 16px;
            }
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
            }
            .form-group {
                display: flex;
                flex-direction: column;
            }
            .form-group.full-width {
                grid-column: 1 / -1;
            }
            .form-group label {
                font-weight: 600;
                margin-bottom: 5px;
                font-size: 13px;
                color: #495057;
            }
            .form-group label .required {
                color: #dc3545;
            }
            .form-group input,
            .form-group select {
                padding: 8px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
            }
            .form-group input:focus,
            .form-group select:focus {
                outline: none;
                border-color: #28a745;
                box-shadow: 0 0 0 0.2rem rgba(40,167,69,0.25);
            }
            .form-group small {
                margin-top: 4px;
                font-size: 12px;
                color: #6c757d;
            }
            .btn-remove {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(220,53,69,0.3);
            }
            .btn-remove:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(220,53,69,0.4);
            }
            .btn-apply-inline {
                background: linear-gradient(135deg, #28a745 0%, #218838 100%);
                color: white;
                padding: 10px 24px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(40,167,69,0.3);
            }
            .btn-apply-inline:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(40,167,69,0.4);
            }
            .discount-blocked {
                background: #ffe5e5;
                padding: 15px;
                border-radius: 8px;
                border-left: 5px solid #dc3545;
                color: #721c24;
            }
        </style>
    """


def get_unsaved_booking_message():
    """Return HTML for unsaved booking message"""
    return """
        <div style="padding: 15px; background: #fff3cd;
                    border-radius: 5px; color: #856404;">
            ⚠️ Save booking first to manage discounts
        </div>
    """


def get_active_discount_html(obj):
    """
    Generate HTML for active discount display.

    Args:
        obj: ShortTermBooking instance with active discount

    Returns:
        str: HTML string for active discount display
    """
    symbol = '%' if obj.discount_type == 'percentage' else '€'

    html_parts = [
        '<div class="discount-active">',
        '    <h3>',
        '        Active Discount',
        '    </h3>',
        '    <div class="discount-info">',
        '        <div class="discount-info-item">',
        '            <strong>Type</strong>',
        f'            <span>{obj.get_discount_type_display()}</span>',
        '        </div>',
        '        <div class="discount-info-item">',
        '            <strong>Value</strong>',
        f'            <span>{obj.discount_value}{symbol}</span>',
        '        </div>',
        '        <div class="discount-info-item">',
        '            <strong>Discount Amount</strong>',
        '            <span class="discount-amount">',
        f'                -€{obj.discount_amount:.2f}',
        '            </span>',
        '        </div>',
    ]

    # Add reason if exists
    if obj.discount_reason:
        html_parts.extend([
            '        <div class="discount-info-item" '
            'style="grid-column: 1 / -1;">',
            '            <strong>Reason</strong>',
            f'            <span>{obj.discount_reason}</span>',
            '        </div>',
        ])

    html_parts.append('    </div>')

    # Add metadata if exists
    if obj.discount_applied_by:
        applied_text = (
            f'Applied by <strong>{obj.discount_applied_by.username}</strong>'
        )
        if obj.discount_applied_at:
            applied_text += (
                f' on {obj.discount_applied_at.strftime("%B %d, %Y at %H:%M")}'
            )
        html_parts.append(
            f'    <div class="discount-meta">{applied_text}</div>'
        )

    html_parts.append('</div>')

    return '\n'.join(html_parts)


def get_no_discount_html():
    """Return HTML for no discount message"""
    return """
        <div class="discount-none">
            <strong style="display: block; margin-bottom: 5px;
                           font-size: 14px;">
                No Discount Applied
            </strong>
            <span style="font-size: 13px;">
                Use the form below to add a discount
            </span>
        </div>
    """


def get_discount_form_html(obj, url):
    """
    Generate HTML for discount application form.

    Args:
        obj: ShortTermBooking instance
        url: URL for form submission

    Returns:
        str: HTML string for discount form
    """
    button_text = 'Modify Discount' if obj.has_discount else 'Apply Discount'

    html_parts = [
        f'<div class="discount-form" id="discountForm_{obj.pk}">',
        f'    <h4>{button_text}</h4>',
        '    <div class="form-row">',
        '        <div class="form-group">',
        '            <label>',
        '                Discount Type <span class="required">*</span>',
        '            </label>',
        f'            <select id="discountType_{obj.pk}" required '
        'style="padding: 5px;">',
        '                <option value="">Select type...</option>',
        '                <option value="percentage">Percentage (%)</option>',
        '                <option value="fixed">Fixed Amount (€)</option>',
        '            </select>',
        '        </div>',
        '        <div class="form-group">',
        '            <label>',
        '                Discount Value <span class="required">*</span>',
        '            </label>',
        f'            <input type="number" id="discountValue_{obj.pk}"',
        '                   step="0.01" min="0.01"',
        '                   placeholder="Enter value" required>',
        f'            <small id="helpText_{obj.pk}">Select type first</small>',
        '        </div>',
        '    </div>',
        '    <div class="form-row">',
        '        <div class="form-group full-width">',
        '            <label>Reason (Optional)</label>',
        f'            <input type="text" id="discountReason_{obj.pk}"',
        '                   placeholder="e.g., VIP customer, Early bird">',
        '        </div>',
        '    </div>',
        f'    <button type="button" onclick="applyDiscount_{obj.pk}()"',
        '            class="btn-apply-inline">',
        f'        {button_text}',
        '    </button>',
        '</div>',
    ]

    return '\n'.join(html_parts)


def get_discount_form_javascript(obj, url):
    """
    Generate JavaScript for discount form functionality.

    Args:
        obj: ShortTermBooking instance
        url: URL for form submission

    Returns:
        str: JavaScript code as string
    """
    return f"""
        <script>
        // Update help text when type changes
        document.getElementById('discountType_{obj.pk}')
            .addEventListener('change', function() {{
                var valueInput = document.getElementById(
                    'discountValue_{obj.pk}'
                );
                var helpText = document.getElementById('helpText_{obj.pk}');

                if (this.value === 'percentage') {{
                    valueInput.placeholder = 'e.g., 15 for 15%';
                    valueInput.max = '100';
                    helpText.textContent = 'Enter percentage (0-100)';
                }} else if (this.value === 'fixed') {{
                    valueInput.placeholder = 'e.g., 50 for €50';
                    valueInput.removeAttribute('max');
                    helpText.textContent = 'Enter amount in EUR';
                }} else {{
                    valueInput.placeholder = 'Enter value';
                    helpText.textContent = 'Select type first';
                }}
            }});

        // Submit discount
        function applyDiscount_{obj.pk}() {{
            var type = document.getElementById('discountType_{obj.pk}').value;
            var value = document.getElementById(
                'discountValue_{obj.pk}'
            ).value;
            var reason = document.getElementById(
                'discountReason_{obj.pk}'
            ).value;

            if (!type || !value) {{
                alert('Please fill in type and value');
                return;
            }}

            var csrfToken = document.querySelector(
                '[name=csrfmiddlewaretoken]'
            ).value;
            var form = document.createElement('form');
            form.method = 'POST';
            form.action = '{url}';

            var csrf = document.createElement('input');
            csrf.type = 'hidden';
            csrf.name = 'csrfmiddlewaretoken';
            csrf.value = csrfToken;
            form.appendChild(csrf);

            var actionInput = document.createElement('input');
            actionInput.type = 'hidden';
            actionInput.name = 'action';
            actionInput.value = 'apply';
            form.appendChild(actionInput);

            var typeInput = document.createElement('input');
            typeInput.type = 'hidden';
            typeInput.name = 'discount_type';
            typeInput.value = type;
            form.appendChild(typeInput);

            var valueInput = document.createElement('input');
            valueInput.type = 'hidden';
            valueInput.name = 'discount_value';
            valueInput.value = value;
            form.appendChild(valueInput);

            var reasonInput = document.createElement('input');
            reasonInput.type = 'hidden';
            reasonInput.name = 'discount_reason';
            reasonInput.value = reason;
            form.appendChild(reasonInput);

            document.body.appendChild(form);
            form.submit();
        }}
        </script>
    """


def get_remove_discount_button_html(obj, url):
    """
    Generate HTML and JavaScript for remove discount button.

    Args:
        obj: ShortTermBooking instance
        url: URL for removal action

    Returns:
        str: HTML string with button and JavaScript
    """
    return f"""
        <button type="button"
                onclick="removeDiscount_{obj.pk}()"
                class="btn-remove">
            Remove Discount
        </button>

        <script>
        function removeDiscount_{obj.pk}() {{
            if (!confirm('Remove this discount?')) return;

            var csrfToken = document.querySelector(
                '[name=csrfmiddlewaretoken]'
            ).value;
            var form = document.createElement('form');
            form.method = 'POST';
            form.action = '{url}';

            var csrf = document.createElement('input');
            csrf.type = 'hidden';
            csrf.name = 'csrfmiddlewaretoken';
            csrf.value = csrfToken;
            form.appendChild(csrf);

            var action = document.createElement('input');
            action.type = 'hidden';
            action.name = 'action';
            action.value = 'remove';
            form.appendChild(action);

            document.body.appendChild(form);
            form.submit();
        }}
        </script>
    """


def get_discount_blocked_html(obj):
    """
    Generate HTML for discount blocked message.

    Args:
        obj: ShortTermBooking instance

    Returns:
        str: HTML string for blocked message
    """
    return f"""
        <div class="discount-blocked">
            <strong style="display: block; margin-bottom: 8px;">
                Cannot Apply Discount
            </strong>
            <p style="margin: 0; font-size: 13px;">
                Discounts can only be applied to <strong>pending</strong>
                or <strong>confirmed</strong> bookings.<br>
                Current status: <strong>{obj.get_status_display()}</strong>
            </p>
        </div>
    """


def get_price_breakdown_table_html(obj):
    """
    Generate HTML for price breakdown table.

    Args:
        obj: ShortTermBooking instance

    Returns:
        str: HTML string for price breakdown table
    """
    html_parts = [
        '<table style="width: 100%; border-collapse: collapse;">',
    ]

    # Base price
    html_parts.append(
        f'<tr>'
        f'<td style="padding: 8px;">Base ({obj.total_nights} nights)</td>'
        f'<td style="text-align: right;">'
        f'{obj.listing.currency}{obj.subtotal:.2f}</td>'
        f'</tr>'
    )

    # Discount row
    if obj.has_discount:
        html_parts.extend([
            '<tr style="background: #ffe6e6;">',
            '<td style="padding: 8px; color: #e74c3c;">',
            '<strong>Discount</strong></td>',
            '<td style="text-align: right; color: #e74c3c;">',
            f'<strong>-{obj.listing.currency}{obj.discount_amount:.2f}'
            '</strong></td>',
            '</tr>',
            '<tr>',
            '<td style="padding: 8px;">Subtotal After Discount</td>',
            '<td style="text-align: right;">',
            f'€{obj.discounted_subtotal:.2f}</td>',
            '</tr>',
        ])

    # Taxes and fees
    vat_rate = round(obj.listing.vat_rate, 2)
    html_parts.extend([
        f'<tr><td style="padding: 8px;">VAT ({vat_rate}%)</td>',
        f'<td style="text-align: right;">'
        f'{obj.listing.currency}{obj.vat:.2f}</td></tr>',
        '<tr><td style="padding: 8px;">Municipality Tax</td>',
        f'<td style="text-align: right;">'
        f'{obj.listing.currency}{obj.municipality_tax:.2f}</td></tr>',
        '<tr><td style="padding: 8px;">Climate Fee</td>',
        f'<td style="text-align: right;">'
        f'{obj.listing.currency}{obj.climate_crisis_fee:.2f}</td></tr>',
        '<tr><td style="padding: 8px;">Cleaning Fee</td>',
        f'<td style="text-align: right;">'
        f'{obj.listing.currency}{obj.cleaning_fee:.2f}</td></tr>',
        '<tr><td style="padding: 8px;">Service Fee</td>',
        f'<td style="text-align: right;">'
        f'{obj.listing.currency}{obj.service_fee:.2f}</td></tr>',
    ])

    # Total
    html_parts.extend([
        '<tr style="border-top: 2px solid #333; background: #f0f0f0;">',
        '<td style="padding: 8px; color: #212529;">',
        '<strong>TOTAL</strong></td>',
        '<td style="text-align: right; color: #212529;">',
        f'<strong>{obj.listing.currency}{obj.total_price:.2f}</strong></td>',
        '</tr>',
        '</table>',
    ])

    # Savings box
    if obj.has_discount:
        html_parts.extend([
            '<div style="margin-top: 15px; background: #d4edda; ',
            'padding: 10px; border-left: 4px solid #28a745; ',
            'color: #155724;">',
            f'<strong>Savings: {obj.listing.currency}'
            f'{obj.discount_amount:.2f}</strong>',
            '</div>',
        ])

    return '\n'.join(html_parts)
