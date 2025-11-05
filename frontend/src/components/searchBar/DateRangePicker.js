import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Form } from "react-bootstrap";
import { t } from "i18next";
import styles from "../../styles/SearchBar.module.css";

const DateRangePicker = ({ startDate, endDate, setFilters, errors }) => {

    const formatDateToLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleStartChange = (date) => {
        setFilters((prev) => ({
            ...prev,
            startDate: date ? formatDateToLocal(date) : "",
        }));
    };

    const handleEndChange = (date) => {
        setFilters((prev) => ({
            ...prev,
            endDate: date ? formatDateToLocal(date) : "",
        }));
    };

    return (
        <Col xs={12} lg={6} className="text-start">
            <Form.Group controlId="formGroupDateRange">
                <Row className="g-1 align-items-center justify-content-around mx-auto">
                    <Col xs={12} sm={6} className="pe-1">
                        <div className="d-flex flex-column">
                            <Form.Label className={`${styles.Label} mb-0 text-nowrap`}>{t('bookingForm.checkIn')}</Form.Label>
                            <DatePicker
                                selected={startDate ? new Date(startDate) : null}
                                onChange={handleStartChange}
                                selectsStart
                                startDate={startDate ? new Date(startDate) : null}
                                endDate={endDate ? new Date(endDate) : null}
                                minDate={new Date()} // Exclude past dates
                                dateFormat="dd/MM/yyyy"
                                placeholderText={t("bookingForm.checkIn")}
                                className={`form-control ${styles.DatePicker} me-0`}

                            />
                        </div>
                    </Col>
                    <Col xs={12} sm={6} className="gx-0">
                        <div className="d-flex flex-column">
                            <Form.Label className={`${styles.Label} mb-0 text-nowrap`} >{t('bookingForm.checkOut')}</Form.Label>
                            <DatePicker
                                selected={endDate ? new Date(endDate) : null}
                                onChange={handleEndChange}
                                selectsEnd
                                startDate={startDate ? new Date(startDate) : null}
                                endDate={endDate ? new Date(endDate) : null}
                                minDate={startDate ? new Date(startDate) : new Date()} // Exclude past dates and ensure it is after startDate
                                dateFormat="dd/MM/yyyy"
                                placeholderText={t("bookingForm.checkOut")}
                                className={`form-control ${styles.DatePicker}`}
                            />
                        </div>
                    </Col>
                </Row>
                {errors?.non_field_errors && (
                    <span className={styles.ErrorMessage}>
                        {errors.non_field_errors.map((message, idx) => (
                            <span key={idx}>{message}</span>
                        ))}
                    </span>
                )}
            </Form.Group>
        </Col>
    );
};

export default DateRangePicker;