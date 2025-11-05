import React from 'react';
import { useTranslation } from 'react-i18next';

const BookingSuccessMessage = () => {
    const { t } = useTranslation();

    return (
        <div className="alert alert-success d-flex align-items-center rounded shadow-sm" role="alert">
            <i className="fa-solid fa-circle-check me-2 fs-4"></i>
            <div className="fw-medium">{t('bookingForm.success')}</div>
        </div>
    );
};

export default BookingSuccessMessage;