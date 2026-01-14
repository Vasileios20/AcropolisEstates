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
import { format, differenceInDays } from 'date-fns';

const ShortTermBookingForm = ({ listingId, onPriceUpdate }) => {
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
    const [disabledDates, setDisabledDates] = useState([]);
    const [maxGuests, setMaxGuests] = useState({ adults: 0, children: 0 });
    const [loading, setLoading] = useState(true);
    const [priceSummary, setPriceSummary] = useState({ nights: 0, total: null });

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

    const datesSelected = Boolean(check_in && check_out);
    
    const minStayMet = useMemo(() => {
        if (!check_in || !check_out) return true;
        const nights = differenceInDays(check_out, check_in);
        // You can add minimum stay logic here
        return nights >= 1;
    }, [check_in, check_out]);

    // Fetch listing info (max guests, etc.)
    useEffect(() => {
        const fetchListingInfo = async () => {
            try {
                const { data } = await axiosReq.get(`/short-term-listings/${listingId}/`);
                setMaxGuests({
                    adults: data.max_adults || 4,
                    children: data.max_children || 2,
                });
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
                        `/short-term-listings/${listingId}/availability/?start=${dateRange.start.toISOString().split("T")[0]}&end=${dateRange.end.toISOString().split("T")[0]}`
                    ),
                    axiosReq.get(`bookings/unavailable-dates/?listing=${listingId}`)
                ]);

                setAvailability(availabilityRes.data);

                // Process booked dates
                const disabled = bookedRes.data.flatMap(({ check_in, check_out }) => {
                    const start = new Date(check_in);
                    const end = new Date(check_out);
                    const days = [];
                    let current = new Date(start);

                    while (current < end) {
                        days.push(new Date(current));
                        current.setDate(current.getDate() + 1);
                    }
                    return days;
                });

                setDisabledDates(disabled);
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
            const emptyPrice = { nights: 0, total: null };
            setPriceSummary(emptyPrice);
            if (onPriceUpdate) onPriceUpdate(emptyPrice);
            return;
        }

        const calculatePrice = () => {
            const nights = differenceInDays(check_out, check_in);
            let current = new Date(check_in);
            let total = 0;

            while (current < check_out) {
                const key = format(current, 'yyyy-MM-dd');
                const dayInfo = availabilityMap[key];
                if (dayInfo?.available) {
                    total += Number(dayInfo.price);
                }
                current.setDate(current.getDate() + 1);
            }

            const priceData = { nights, total };
            setPriceSummary(priceData);
            if (onPriceUpdate) onPriceUpdate(priceData);
        };

        calculatePrice();
    }, [check_in, check_out, availabilityMap, onPriceUpdate]);

    // Handle month change in calendar
    const handleMonthChange = useCallback(async (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 2, 0);

        try {
            const { data } = await axiosReq.get(
                `/short-term-listings/${listingId}/availability/?start=${start.toISOString().split("T")[0]}&end=${end.toISOString().split("T")[0]}`
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
            await axios.post('bookings/', formData);
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
            <div title={dayInfo?.available ? `€${dayInfo.price} / night` : t('bookingForm.unavailable')}>
                <div>{day}</div>
                <small className="text-muted d-block">
                    {!loading && dayInfo?.available ? `€${dayInfo.price}` : '\u00A0'}
                </small>
            </div>
        );
    }, [availabilityMap, loading, t]);

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
                            excludeDates={disabledDates}
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
                            filterDate={(date) => {
                                const key = format(date, "yyyy-MM-dd");
                                return availabilityMap[key]?.available !== false;
                            }}
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
                            excludeDates={disabledDates}
                            selectsEnd
                            startDate={check_in}
                            endDate={check_out}
                            minDate={check_in || new Date()}
                            placeholderText={t('bookingForm.checkOut')}
                            dateFormat="dd-MM-yyyy"
                            disabled={!check_in}
                            onChange={(date) => setBookingData(prev => ({ ...prev, check_out: date }))}
                            onMonthChange={handleMonthChange}
                            renderDayContents={renderDayContents}
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
                        <div className="d-flex justify-content-between mb-2 small">
                            <span>
                                €{(priceSummary.total / priceSummary.nights).toFixed(2)} × {priceSummary.nights} {priceSummary.nights > 1 ? t("bookingForm.nights") : t("bookingForm.night")}
                            </span>
                            <span>€{priceSummary.total.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold border-top pt-2">
                            <span>{t("bookingForm.total")}</span>
                            <span>€{priceSummary.total.toFixed(2)}</span>
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
                        <div className="d-flex justify-content-between mb-2">
                            <div>
                                <strong>{t('bookingForm.checkIn')}:</strong> {check_in?.toLocaleDateString(lng)}
                            </div>
                            <div>
                                <strong>{t('bookingForm.checkOut')}:</strong> {check_out?.toLocaleDateString(lng)}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between fw-bold">
                            <span>{priceSummary.nights} {priceSummary.nights > 1 ? t("bookingForm.nights") : t("bookingForm.night")}</span>
                            <span>€{priceSummary.total?.toFixed(2)}</span>
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