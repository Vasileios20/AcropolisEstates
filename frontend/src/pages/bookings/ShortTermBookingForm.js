import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useCurrentUser } from 'contexts/CurrentUserContext';
import axios from 'axios';
import Form from "react-bootstrap/Form";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../App.module.css";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { axiosReq } from 'api/axiosDefaults';
import { eachDayOfInterval, parseISO } from "date-fns";
import BookingSuccessMessage from 'pages/bookings/BookingSuccessMessage';
import TermsCheckbox from 'components/TermsCheckbox';


const ShortTermBookingForm = ({ listingId }) => {
    const { t, i18n } = useTranslation();
    const currentUser = useCurrentUser();

    const [bookingData, setBookingData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        check_in: null,
        check_out: null,
    });

    const [phoneValue, setPhoneValue] = useState();
    const { first_name, last_name, email, check_in, check_out } = bookingData;
    const [errors, setErrors] = useState({});

    const [submitted, setSubmitted] = useState(false);
    const [disabledDates, setDisabledDates] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const lng = i18n.language.startsWith('el') ? 'el' : 'en';

    // const handleCheckboxChange = (e) => {
    //     setIsChecked(e.target.checked);
    // };

    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                const { data } = await axiosReq.get(`bookings/unavailable-dates/?listing=${listingId}`);
                const allDisabled = data.flatMap(({ check_in, check_out }) =>
                    eachDayOfInterval({
                        start: parseISO(check_in),
                        end: parseISO(check_out)
                    })
                );
                setDisabledDates(allDisabled);
            } catch (err) {
                // console.error("Failed to fetch unavailable dates", err);
            }
        };

        fetchUnavailableDates();
    }, [listingId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChecked) {
            setErrors({ ...errors, checkbox: [t("contactForm.errorMessage")] });
            setTimeout(() => {
                setErrors({});
            }, 2500);
            return;
        }

        const formData = {
            ...bookingData,
            phone_number: phoneValue,
            check_in: check_in?.toISOString().split('T')[0],
            check_out: check_out?.toISOString().split('T')[0],
            listing: listingId,
            language: lng || 'en',
        };

        if (currentUser) {
            formData.user = currentUser.id;
        }

        try {
            await axios.post('bookings/', formData);
            setSubmitted(true);
        } catch (error) {
            console.error(error.response?.data);
            setErrors(error.response?.data);
            setTimeout(() => {
                setErrors({});
            }, 2500);
        }
    };

    if (submitted) {
        return <BookingSuccessMessage />;
    }

    const datesSelected = check_in && check_out;

    return (

        <Form onSubmit={handleSubmit} className={`d-flex flex-column`}>

            <Form.Group className="mb-3">
                <div className="row g-1 align-items-center justify-content-around mx-auto">

                    <div className={errors.non_field_errors ? 'd-none' : `col-md-6 mb-2`}>
                        <div className="d-flex flex-column">
                            <Form.Label className="text-nowrap me-auto">{t('bookingForm.checkIn')}</Form.Label>
                            <DatePicker
                                className={`${styles.Input} text-start w-100`}
                                selected={check_in}
                                excludeDates={disabledDates}
                                onChange={(date) => setBookingData(prev => ({ ...prev, check_in: date }))}
                                dateFormat="dd-MM-yyyy"
                                minDate={new Date()}
                                placeholderText={t('bookingForm.checkIn')}
                                required
                            />
                        </div>
                    </div>
                    <div className={errors.non_field_errors ? 'd-none' : `col-md-6 mb-2`}>
                        <div className="d-flex flex-column">
                            <Form.Label className="text-nowrap">{t('bookingForm.checkOut')}</Form.Label>
                            <DatePicker
                                className={`${styles.Input} text-start w-100`}
                                selected={check_out}
                                excludeDates={disabledDates}
                                onChange={(date) => setBookingData(prev => ({ ...prev, check_out: date }))}
                                dateFormat="dd-MM-yyyy"
                                minDate={check_in || new Date()}
                                placeholderText={t('bookingForm.checkOut')}
                                required
                            />
                        </div>
                    </div>
                    {errors.non_field_errors && (
                        <span className={styles.ErrorMessage}>
                            {errors.non_field_errors.map((message, idx) => (
                                <span key={idx}>{message}</span>
                            ))}
                        </span>
                    )}
                </div>
            </Form.Group>

            {datesSelected && (
                <>
                    <Form.Group className="mb-3" controlId="formGridFirstName">
                        <Form.Control
                            className={`${styles.Input} text-start`}
                            type="text"
                            name="first_name"
                            placeholder={t('bookingForm.firstName')}
                            value={first_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.first_name && (
                            <span className={styles.ErrorMessage}>
                                {errors.first_name.map((message, idx) => (
                                    <span key={idx}>{message}</span>
                                ))}
                            </span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridLastName">
                        <Form.Control
                            className={`${styles.Input} text-start`}
                            type="text"
                            name="last_name"
                            placeholder={t('bookingForm.lastName')}
                            value={last_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.last_name && (
                            <span className={styles.ErrorMessage}>
                                {errors.last_name.map((message, idx) => (
                                    <span key={idx}>{message}</span>
                                ))}
                            </span>
                        )}
                    </Form.Group>
                    <Form.Group className={`mb-3`} controlId="formGridPhoneNumber">
                        <div className={`form-control p-1 text-start`}>
                            <PhoneInput
                                international
                                defaultCountry="GR"
                                placeholder={t('bookingForm.phone')}
                                value={phoneValue}
                                onChange={setPhoneValue}
                                inputComponent={Form.Control}
                                required
                                style={{ width: '100%', border: 'none' }}
                            />
                        </div>
                        {errors.phone_number && (
                            <span className={styles.ErrorMessage}>
                                {errors.phone_number.map((message, idx) => (
                                    <span key={idx}>{message}</span>
                                ))}
                            </span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridEmail">
                        <Form.Control
                            className={`${styles.Input} text-start`}
                            type="email"
                            name="email"
                            placeholder={t('bookingForm.email')}
                            value={email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && (
                            <span className={styles.ErrorMessage}>
                                {errors.email.map((message, idx) => (
                                    <span key={idx}>{message}</span>
                                ))}
                            </span>
                        )}
                    </Form.Group>

                    <TermsCheckbox errors={errors} isChecked={isChecked} setIsChecked={setIsChecked} />

                    <Row className="justify-content-center align-items-center">
                        <div className="d-flex justify-content-center gap-3 mt-3 w-100">
                            <Button className={`${btnStyles.Button} ${btnStyles.AngryOcean}`} type="submit">
                                {t('bookingForm.submit')}
                            </Button>
                            <Button className={`${btnStyles.Button} ${btnStyles.Remove}`} onClick={() => setBookingData({})}>
                                {t("createEditForm.button.cancel")}
                            </Button>
                        </div>
                    </Row>
                </>
            )}
        </Form>

    );
};

export default ShortTermBookingForm;