import React from 'react'
import { Form } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import styles from '../styles/TermsCheckbox.module.css'

const TermsCheckbox = ({ errors, isChecked, setIsChecked }) => {
    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    return (
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
            />
            {errors.checkbox && (
                <span className={styles.ErrorMessage}>
                    {errors.checkbox[0]}
                </span>
            )}
        </Form.Group>
    )
}

export default TermsCheckbox