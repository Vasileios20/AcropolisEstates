import React from 'react';
import { useTranslation } from 'react-i18next';

const BookingSuccessMessage = () => {
    const { t } = useTranslation();

    return (
        <div className="text-center p-4">
            <i className="fa-solid fa-circle-check text-success fa-3x mb-3"></i>
            <h4>{t('bookingForm.requestSent')}</h4>
            <p>{t('bookingForm.requestSentMessage')}</p>
            <small className="text-muted">
                {t('bookingForm.checkEmailForUpdates')}
            </small>
        </div>
    );
};

export default BookingSuccessMessage;