import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Container from "react-bootstrap/Container";

import { Link, useHistory, useLocation } from "react-router-dom";

import styles from "../../styles/ContactForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import axios from "axios";

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Trans, useTranslation } from "react-i18next";

function ContactForm({ listing_id }) {
  /**
   * The ContactForm component is a functional component that renders a form for sending a message to the site admin.
   * It contains input fields for the name, email, subject, and message of the contact form.
   * It also contains a submit button that sends a request to the API to send the message.
   * @returns {JSX.Element} - The JSX for the component.
   */

  const { t, i18n } = useTranslation();
  const [languageChanged, setLanguageChanged] = useState(false);

  const [contactData, setContactData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const { first_name, last_name, email, subject, message } = contactData;
  const [success, setSuccess] = useState(false);
  const [messageDeleted, setMessageDeleted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const history = useHistory();

  const message_form = `${t("contactForm.listingMessage")}${listing_id}`;
  const path = useLocation().pathname;

  const [phoneValue, setPhoneValue] = useState();

  const listingPagePath = path === `/listings/${listing_id}`;

  contactData.message =
    listingPagePath && !messageDeleted
      ? message_form
      : contactData.message;


  const handleChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "message") {
      setMessageDeleted(true);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      setErrors({ ...errors, checkbox: [t("contactForm.errorMessage")] });
      return;
    }
    contactData.phone_number = phoneValue;
    try {
      await axios.post("/contact/", contactData);
      setSuccess(true);

      setTimeout(() => {
        path === `/listings/${listing_id}`
          ? window.location.reload()
          : history.push("/");
      }, 2000);
    } catch (err) {
      setErrors(err.response?.data);
      console.log(err.response?.data);
      setTimeout(() => {
        setErrors({});
      }, 2500);
    }
  };

  useEffect(() => {
    setLanguageChanged(true);
    setTimeout(() => setLanguageChanged(false), 500);
  }, [i18n.language]);

  return (
    <Row>
      <Col className="m-auto"
        md={listingPagePath ? 12 : 8}
        lg={listingPagePath ? 12 : 6}
        xl={listingPagePath ? 12 : 4}
      >
        <Container className={`${appStyles.Content} p-3 p-md-4 rounded shadow`}>
          <h1 className={styles.Header}>{t("contactForm.title")}</h1>
          <Form
            onSubmit={handleSubmit}
            className={`d-flex flex-column ${styles.ContactForm}`}
          >
            <Form.Group controlId="first_name" className="">
              <Form.Label className={styles.FormLabel}>
                {t("contactForm.name")}<span>* {errors.first_name?.map((message, idx) => (
                  <span className={styles.ErrorMessage} key={idx}>
                    {message}
                  </span>
                ))}</span>
              </Form.Label>
              <Form.Control
                className={`${styles.Input} text-start`}
                type="text"
                placeholder={t("contactForm.namePlaceholder")}
                name="first_name"
                value={first_name}
                onChange={handleChange}
                disabled={success ? true : false}
              />
            </Form.Group>


            <Form.Group controlId="last_name">
              <Form.Label className={styles.FormLabel}>
                {t("contactForm.lastName")}<span>* {errors.last_name?.map((message, idx) => (
                  <span className={styles.ErrorMessage} key={idx}>
                    {message}
                  </span>
                ))}</span>
              </Form.Label>
              <Form.Control
                className={`${styles.Input} text-start`}
                type="text"
                placeholder={t("contactForm.lastNamePlaceholder")}
                name="last_name"
                value={last_name}
                onChange={handleChange}
                disabled={success ? true : false}
              />
            </Form.Group>


            <Form.Group controlId="email">
              <Form.Label className={styles.FormLabel}>
                {t("contactForm.email")}<span>* {errors.email?.map((message, idx) => (
                  <span className={styles.ErrorMessage} key={idx}>
                    {message}
                  </span>
                ))}</span>
              </Form.Label>
              <Form.Control
                className={`${styles.Input} text-start`}
                type="email"
                placeholder={t("contactForm.emailPlaceholder")}
                name="email"
                value={email}
                onChange={handleChange}
                disabled={success ? true : false}
              />
            </Form.Group>

            <Form.Group controlId="phone_number">
              <Form.Label className={styles.FormLabel}>{t("contactForm.phone")}<span>* {errors.phone_number?.map((message, idx) => (
                <span className={styles.ErrorMessage} key={idx}>
                  {message}
                </span>
              ))}</span></Form.Label>
              <PhoneInput
                style={{ paddingLeft: "0.5rem" }}
                className={`${styles.Input} text-start`}
                international
                defaultCountry="GR"
                placeholder="Enter phone number"
                value={phoneValue}
                onChange={setPhoneValue}
                inputComponent={Form.Control}
                containerComponent={Form.Group}
                disabled={success ? true : false} />
            </Form.Group>


            <Form.Group controlId="subject">
              <Form.Label className={styles.FormLabel}>
                {t("contactForm.subject")}<span>* {errors.subject?.map((message, idx) => (
                  <span className={styles.ErrorMessage} key={idx}>
                    {message}
                  </span>
                ))}</span>
              </Form.Label>
              <Form.Control
                className={`${styles.Input} text-start`}
                type="text"
                placeholder={t("contactForm.subject")}
                name="subject"
                value={subject}
                onChange={handleChange}
                disabled={success ? true : false}
              />
            </Form.Group>


            <Form.Group controlId="message">
              <Form.Label className={styles.FormLabel}>
                {t("contactForm.message")}<span>* {errors.message?.map((message, idx) => (
                  <span className={styles.ErrorMessage} key={idx}>
                    {message}
                  </span>
                ))}</span>
              </Form.Label>
              <Form.Control
                className={`${styles.Input} text-start`}
                as="textarea"
                rows={6}
                placeholder={
                  listingPagePath && (!messageDeleted || languageChanged)
                    ? message_form
                    : t("contactForm.messagePlaceholder")
                }
                name="message"
                value={message}
                onChange={handleChange}
                disabled={success ? true : false}
              />
            </Form.Group>
            <Form.Group controlId="checkbox">
              <Form.Check
                className={`${styles.Checkbox}`}
                type="checkbox"
                label={<div>
                  <Trans i18nKey="contactForm.acceptText"
                    components={{
                      1: <Link to="/terms" style={{ textDecoration: "underline" }} target="_blank" />,
                      2: <Link to="/privacyPolicy" style={{ textDecoration: "underline" }} target="_blank" />
                    }}
                  />
                </div>}
                checked={isChecked}
                onChange={handleCheckboxChange}
                disabled={success ? true : false}
              />
              {errors.checkbox && (
                <span className={styles.ErrorMessage}>
                  {errors.checkbox[0]}
                </span>
              )}
            </Form.Group>

            <Button
              className={`${btnStyles.Button} ${btnStyles.AngryOcean} mt-3`}
              type="submit"
            >
              {t("contactForm.btnSend")}
            </Button>
            {success && (
              <Alert variant="success" className="mt-3">
                {t("contactForm.successMessage")}
              </Alert>
            )}
            {errors.non_field_errors?.map((message, idx) => (
              <Alert variant="warning" key={idx} className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
      </Col>
    </Row>
  );
}

export default ContactForm;
