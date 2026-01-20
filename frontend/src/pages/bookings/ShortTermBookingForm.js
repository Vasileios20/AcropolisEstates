import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useCurrentUser } from 'contexts/CurrentUserContext';
import axios from 'axios';
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import btnStyles from "../../styles/Button.module.css";
import styles from "../../App.module.css";
import { axiosReq } from 'api/axiosDefaults';
import BookingSuccessMessage from 'pages/bookings/BookingSuccessMessage';
import TermsCheckbox from 'components/TermsCheckbox';
import { format, differenceInDays, addDays, isBefore, isEqual } from 'date-fns';

const ShortTermBookingForm = ({
    listingId,
    onPriceUpdate,
    listingTaxRates
}) => {
    const { t, i18n } = useTranslation();
    const currentUser = useCurrentUser();
    const lng = i18n.language.startsWith('el') ? 'el' : 'en';

    // Form state
    const [bookingData, setBookingData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        check_in: null,
        check_out: null,
        adults: 1,
        children: 0,
        message: '',
    });

    // UI state
    const [phoneValue, setPhoneValue] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Data state
    const [availability, setAvailability] = useState([]);
    const [bookedRanges, setBookedRanges] = useState([]); // Store actual booking ranges
    const [maxGuests, setMaxGuests] = useState({ adults: 0, children: 0 });
    const [currency, setCurrency] = useState('€');
    const [loading, setLoading] = useState(true);
    const [priceSummary, setPriceSummary] = useState({
        nights: 0,
        subtotal: null,
        vat: null,
        municipality_tax: null,
        climate_crisis_fee: null,
        total: null
    });

    const { check_in, check_out, adults, children, first_name, last_name, email, message } = bookingData;

    // Memoized values
    const dateRange = useMemo(() => {
        const start = new Date();
        const end = new Date();
        end.setMonth(start.getMonth() + 2);
        return { start, end };
    }, []);

    const availabilityMap = useMemo(() =>
        availability.reduce((acc, day) => {
            acc[day.date] = day;
            return acc;
        }, {}),
        [availability]
    );

    // Calculate disabled dates for check-in (cannot check in on occupied nights)
    const disabledCheckInDates = useMemo(() => {
        return bookedRanges.flatMap(({ check_in, check_out }) => {
            const start = new Date(check_in);
            const end = new Date(check_out);
            const days = [];
            let current = new Date(start);

            // Block all nights EXCEPT the checkout day (which is available for next check-in)
            while (current < end) {
                days.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            return days;
        });
    }, [bookedRanges]);

    // Find the first blocked date after check-in to limit checkout
    const getMaxCheckoutDate = useCallback((checkInDate) => {
        if (!checkInDate) return null;

        // Find the next booking that starts after our check-in
        const nextBooking = bookedRanges
            .map(range => new Date(range.check_in))
            .filter(date => date > checkInDate)
            .sort((a, b) => a - b)[0];

        if (nextBooking) {
            // Allow checkout ON the day of next check-in (same day turnover)
            return nextBooking;
        }

        // No blocking booking found, allow up to 6 months
        return addDays(checkInDate, 180);
    }, [bookedRanges]);

    const maxCheckoutDate = useMemo(() =>
        check_in ? getMaxCheckoutDate(check_in) : null,
        [check_in, getMaxCheckoutDate]
    );

    const datesSelected = Boolean(check_in && check_out);

    const minStayMet = useMemo(() => {
        if (!check_in || !check_out) return true;
        const nights = differenceInDays(check_out, check_in);
        return nights >= 1;
    }, [check_in, check_out]);

    // Filter function for check-in calendar
    const filterCheckInDate = useCallback((date) => {
        const key = format(date, "yyyy-MM-dd");

        // Must be available according to pricing
        if (availabilityMap[key]?.available === false) {
            return false;
        }

        // Cannot check in on a date that's in the middle of a booking
        const isBlocked = disabledCheckInDates.some(blockedDate =>
            isEqual(new Date(blockedDate).setHours(0, 0, 0, 0), new Date(date).setHours(0, 0, 0, 0))
        );

        return !isBlocked;
    }, [availabilityMap, disabledCheckInDates]);

    // Filter function for check-out calendar
    const filterCheckOutDate = useCallback((date) => {
        if (!check_in) return true;

        // Must be after check-in
        if (!isBefore(check_in, date)) return false;

        // Cannot checkout beyond the next booking's check-in
        if (maxCheckoutDate && isBefore(maxCheckoutDate, date)) return false;

        // Check if there's a booking that would conflict
        const hasConflict = bookedRanges.some(({ check_in: bookedIn, check_out: bookedOut }) => {
            const bookedStart = new Date(bookedIn);
            const bookedEnd = new Date(bookedOut);

            // Our checkout must be on or before the next booking's check-in
            // This allows same-day turnover
            return isBefore(bookedStart, date) && isBefore(date, bookedEnd);
        });

        return !hasConflict;
    }, [check_in, bookedRanges, maxCheckoutDate]);

    // Fetch listing info
    useEffect(() => {
        const fetchListingInfo = async () => {
            try {
                const { data } = await axiosReq.get(`/short-term-listings/${listingId}/`);
                setMaxGuests({
                    adults: data.max_adults || 4,
                    children: data.max_children || 2,
                });
                setCurrency(data.currency || '€');
            } catch (err) {
                console.error("Failed to fetch listing info", err);
            }
        };
        fetchListingInfo();
    }, [listingId]);

    // Fetch initial availability and booked dates
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [availabilityRes, bookedRes] = await Promise.all([
                    axiosReq.get(
                        `/short-term-listings/${listingId}/availability/?start=${format(dateRange.start, 'yyyy-MM-dd')}&end=${format(dateRange.end, 'yyyy-MM-dd')}`
                    ),
                    axiosReq.get(`short-term-bookings/unavailable-dates/?listing=${listingId}`)
                ]);

                setAvailability(availabilityRes.data);

                // Store the actual booking ranges (not individual dates)
                setBookedRanges(bookedRes.data);

            } catch (err) {
                console.error("Initial data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [listingId, dateRange.start, dateRange.end]);

    // Calculate price when dates change
    useEffect(() => {
        if (!check_in || !check_out) {
            const emptyPrice = {
                nights: 0,
                subtotal: null,
                vat: null,
                municipality_tax: null,
                climate_crisis_fee: null,
                total: null
            };
            setPriceSummary(emptyPrice);
            if (onPriceUpdate) onPriceUpdate(emptyPrice);
            return;
        }

        const calculatePrice = () => {
            const nights = differenceInDays(check_out, check_in);
            let current = new Date(check_in);
            let subtotal = 0;

            // Calculate subtotal (base accommodation price)
            while (current < check_out) {
                const key = format(current, 'yyyy-MM-dd');
                const dayInfo = availabilityMap[key];
                if (dayInfo?.available) {
                    subtotal += Number(dayInfo.price);
                }
                current = addDays(current, 1);
            }

            // Calculate taxes and fees (matching backend logic)
            const VAT_RATE = listingTaxRates.vatRate;
            const MUNICIPALITY_TAX_RATE = listingTaxRates.municipalityTaxRate;
            const CLIMATE_CRISIS_FEE_PER_NIGHT = listingTaxRates.climateCrisisFeeRate;

            const vat = subtotal * VAT_RATE;
            const municipality_tax = subtotal * MUNICIPALITY_TAX_RATE;
            const climate_crisis_fee = CLIMATE_CRISIS_FEE_PER_NIGHT * nights;
            const total = subtotal + vat + municipality_tax + climate_crisis_fee;

            const priceData = {
                nights,
                subtotal,
                vat,
                municipality_tax,
                climate_crisis_fee,
                total
            };
            setPriceSummary(priceData);
            if (onPriceUpdate) onPriceUpdate(priceData);
        };

        calculatePrice();
    }, [check_in, check_out, availabilityMap, onPriceUpdate, listingTaxRates]);

    // Handle month change in calendar
    const handleMonthChange = useCallback(async (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 6, 0);

        try {
            const { data } = await axiosReq.get(
                `/short-term-listings/${listingId}/availability/?start=${format(start, 'yyyy-MM-dd')}&end=${format(end, 'yyyy-MM-dd')}`
            );

            setAvailability(prev => {
                const combined = [...prev];
                data.forEach(newDay => {
                    if (!combined.find(d => d.date === newDay.date)) {
                        combined.push(newDay);
                    }
                });
                return combined;
            });
        } catch (err) {
            console.error("Failed to fetch month data", err);
        }
    }, [listingId]);

    // Form handlers
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    }, []);

    const clearErrors = useCallback(() => {
        setTimeout(() => setErrors({}), 5000);
    }, []);

    const handleReserveClick = useCallback(() => {
        if (!check_in || !check_out) {
            setErrors({ non_field_errors: [t("bookingForm.requiredDates")] });
            clearErrors();
            return;
        }
        if (check_out <= check_in) {
            setErrors({ non_field_errors: [t("bookingForm.invalidDateRange")] });
            clearErrors();
            return;
        }
        if (!minStayMet) {
            setErrors({ non_field_errors: [t("bookingForm.minimumStay")] });
            clearErrors();
            return;
        }
        setShowDetailsModal(true);
    }, [check_in, check_out, minStayMet, t, clearErrors]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};

        if (!isChecked) validationErrors.checkbox = [t("contactForm.errorMessage")];
        if (!first_name?.trim()) validationErrors.first_name = [t("bookingForm.requiredFirstName")];
        if (!last_name?.trim()) validationErrors.last_name = [t("bookingForm.requiredLastName")];
        if (!email?.trim()) validationErrors.email = [t("bookingForm.requiredEmail")];
        if (!phoneValue?.trim()) validationErrors.phone_number = [t("bookingForm.requiredPhone")];
        if (!adults || adults < 1) validationErrors.adults = [t("bookingForm.requiredAdults")];

        const maxTotal = maxGuests.adults + maxGuests.children;
        const totalGuests = parseInt(adults) + parseInt(children);

        if (totalGuests > maxTotal) {
            validationErrors.non_field_errors = [t("bookingForm.maxGuests", { max: maxTotal })];
        }
        if (parseInt(adults) > maxGuests.adults) {
            validationErrors.adults = [t("bookingForm.maxAdults", { max: maxGuests.adults })];
        }
        if (parseInt(children) > maxGuests.children) {
            validationErrors.children = [t("bookingForm.maxChildren", { max: maxGuests.children })];
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            clearErrors();
            return;
        }

        const formData = {
            ...bookingData,
            phone_number: phoneValue,
            check_in: format(check_in, 'yyyy-MM-dd'),
            check_out: format(check_out, 'yyyy-MM-dd'),
            listing: listingId,
            language: lng,
            adults: parseInt(adults),
            children: parseInt(children),
            message: message?.trim() || '',
        };

        if (currentUser) formData.user = currentUser.id;

        try {
            await axios.post('short-term-bookings/', formData);
            setSubmitted(true);
            setShowDetailsModal(false);
        } catch (error) {
            console.error(error.response?.data);
            setErrors(error.response?.data || { non_field_errors: [t("bookingForm.submitError")] });
            clearErrors();
        }
    };

    // Day content renderer for calendar
    const renderDayContents = useCallback((day, date) => {
        const iso = format(date, 'yyyy-MM-dd');
        const dayInfo = availabilityMap[iso];

        return (
            <div title={dayInfo?.available ? `${currency}${dayInfo.price} / night` : t('bookingForm.unavailable')}>
                <div>{day}</div>
                <small className="text-muted d-block">
                    {!loading && dayInfo?.available ? `${currency}${dayInfo.price}` : '\u00A0'}
                </small>
            </div>
        );
    }, [availabilityMap, loading, t, currency]);

    if (submitted) {
        return <BookingSuccessMessage />;
    }

    return (
        <>
            <div className="d-flex flex-column">
                <div className="row g-2 mb-3">
                    {/* Check-in Date */}
                    <div className="col-6">
                        <Form.Label className="text-nowrap small">
                            {t('bookingForm.checkIn')}
                            {loading && <Spinner animation="border" size="sm" className="ms-2" />}
                        </Form.Label>
                        <DatePicker
                            className={`${styles.Input} text-start w-100`}
                            selected={check_in}
                            selectsStart
                            startDate={check_in}
                            endDate={check_out}
                            minDate={new Date()}
                            placeholderText={t('bookingForm.checkIn')}
                            dateFormat="dd-MM-yyyy"
                            onChange={(date) => setBookingData(prev => ({
                                ...prev,
                                check_in: date,
                                check_out: null,
                            }))}
                            onMonthChange={handleMonthChange}
                            renderDayContents={renderDayContents}
                            filterDate={filterCheckInDate}
                        />
                    </div>

                    {/* Check-out Date */}
                    <div className="col-6">
                        <Form.Label className="text-nowrap small">
                            {t('bookingForm.checkOut')}
                        </Form.Label>
                        <DatePicker
                            className={`${styles.Input} text-start w-100`}
                            selected={check_out}
                            selectsEnd
                            startDate={check_in}
                            endDate={check_out}
                            minDate={check_in ? addDays(check_in, 1) : null}
                            maxDate={maxCheckoutDate}
                            placeholderText={t('bookingForm.checkOut')}
                            dateFormat="dd-MM-yyyy"
                            disabled={!check_in}
                            onChange={(date) => setBookingData(prev => ({ ...prev, check_out: date }))}
                            onMonthChange={handleMonthChange}
                            renderDayContents={renderDayContents}
                            filterDate={filterCheckOutDate}
                        />
                    </div>
                </div>

                {errors.non_field_errors && (
                    <div className={`${styles.ErrorMessage} mb-2`}>
                        {errors.non_field_errors.map((message, idx) => (
                            <div key={idx}>{message}</div>
                        ))}
                    </div>
                )}

                {priceSummary.total !== null && (
                    <div className="p-3 border rounded bg-light mb-3">
                        {/* Accommodation Cost */}
                        <div className="d-flex justify-content-between mb-2 small">
                            <span>
                                {currency}{(priceSummary.subtotal / priceSummary.nights).toFixed(2)} × {priceSummary.nights} {priceSummary.nights > 1 ? t("bookingForm.nights") : t("bookingForm.night")}
                            </span>
                            <span>{currency}{priceSummary.subtotal.toFixed(2)}</span>
                        </div>

                        {/* Total */}
                        <div className="d-flex justify-content-between fw-bold border-top pt-2">
                            <span>{t("bookingForm.total")}</span>
                            <span>{currency}{priceSummary.total.toFixed(2)}</span>

                        </div>
                        <div className="text-center mt-1">
                            <small className="text-muted">{t("bookingForm.includesTaxesAndFees")}</small>
                        </div>
                    </div>
                )}

                <Button
                    className={`${btnStyles.Button} ${btnStyles.AngryOcean} w-100`}
                    onClick={handleReserveClick}
                    disabled={!datesSelected || loading}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            {t('bookingForm.loading')}
                        </>
                    ) : datesSelected ? (
                        t('bookingForm.requestToBook')
                    ) : (
                        t('bookingForm.selectDates')
                    )}
                </Button>

                {datesSelected && (
                    <small className="text-muted text-center mt-2 d-block">
                        <i className="fa-solid fa-circle-info me-1"></i>
                        {t('bookingForm.requiresApproval')}
                    </small>
                )}
            </div>

            {/* Booking Details Modal */}
            <Modal
                show={showDetailsModal}
                onHide={() => setShowDetailsModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('bookingForm.completeBookingRequest')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="bg-light p-3 rounded mb-4">
                        <h6 className="mb-3">{t('bookingForm.bookingSummary')}</h6>

                        {/* Dates */}
                        <div className="d-flex justify-content-between mb-2 small">
                            <div>
                                <strong>{t('bookingForm.checkIn')}:</strong> {check_in?.toLocaleDateString(lng)}
                            </div>
                            <div>
                                <strong>{t('bookingForm.checkOut')}:</strong> {check_out?.toLocaleDateString(lng)}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-top pt-2 mt-2">
                            <div className="d-flex justify-content-between mb-1 small">
                                <span>{priceSummary.nights} {priceSummary.nights > 1 ? t("bookingForm.nights") : t("bookingForm.night")}</span>
                                <span>{currency}{priceSummary.subtotal?.toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between fw-bold border-top pt-2">
                                <span>{t("bookingForm.total")}</span>
                                <span>{currency}{priceSummary.total?.toFixed(2)}</span>
                            </div>
                            <span><small>{t("bookingForm.includesTaxesAndFees")}</small></span>
                        </div>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('bookingForm.firstName')}</Form.Label>
                                    <Form.Control
                                        className={styles.Input}
                                        type="text"
                                        name="first_name"
                                        value={first_name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.first_name}
                                        required
                                    />
                                    {errors.first_name && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.first_name[0]}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('bookingForm.lastName')}</Form.Label>
                                    <Form.Control
                                        className={styles.Input}
                                        type="text"
                                        name="last_name"
                                        value={last_name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.last_name}
                                        required
                                    />
                                    {errors.last_name && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.last_name[0]}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>{t('bookingForm.email')}</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                required
                            />
                            {errors.email && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.email[0]}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t('bookingForm.phone')}</Form.Label>
                            <div className="form-control p-1">
                                <PhoneInput
                                    international
                                    defaultCountry="GR"
                                    value={phoneValue}
                                    onChange={setPhoneValue}
                                    required
                                />
                            </div>
                            {errors.phone_number && (
                                <small className={styles.ErrorMessage}>{errors.phone_number[0]}</small>
                            )}
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('bookingForm.adults')}</Form.Label>
                                    <Form.Control
                                        className={styles.Input}
                                        type="number"
                                        name="adults"
                                        value={adults}
                                        onChange={handleChange}
                                        min={1}
                                        max={maxGuests.adults}
                                        isInvalid={!!errors.adults}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        {t('bookingForm.max')}: {maxGuests.adults}
                                    </Form.Text>
                                    {errors.adults && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.adults[0]}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('bookingForm.children')}</Form.Label>
                                    <Form.Control
                                        className={styles.Input}
                                        type="number"
                                        name="children"
                                        value={children}
                                        onChange={handleChange}
                                        min={0}
                                        max={maxGuests.children}
                                        isInvalid={!!errors.children}
                                    />
                                    <Form.Text className="text-muted">
                                        {t('bookingForm.max')}: {maxGuests.children}
                                    </Form.Text>
                                    {errors.children && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.children[0]}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                {t('bookingForm.message')}
                                <small className="text-muted ms-1">({t('bookingForm.optional')})</small>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                className={styles.Input}
                                name="message"
                                value={message}
                                onChange={handleChange}
                                placeholder={t('bookingForm.messagePlaceholder')}
                            />
                        </Form.Group>

                        <TermsCheckbox
                            errors={errors}
                            isChecked={isChecked}
                            setIsChecked={setIsChecked}
                        />

                        <div className="d-flex gap-2 mt-4">
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.AngryOcean} flex-grow-1`}
                                type="submit"
                            >
                                {t('bookingForm.submitRequest')}
                            </Button>
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.Remove}`}
                                type="button"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                {t('bookingForm.cancel')}
                            </Button>
                        </div>

                        <small className="text-muted d-block text-center mt-3">
                            <i className="fa-solid fa-envelope me-1"></i>
                            {t('bookingForm.confirmationEmail')}
                        </small>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ShortTermBookingForm;