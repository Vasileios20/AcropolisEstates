import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/ListingCreateEditForm.module.css";

const CurrencyPriceAvailability = ({
    listingData,
    handleChange,
    handleShow,
    handleClose,
    show,
    owners,
    errors,
    t,
}) => {
    return (
        <>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="currency">
                        <Form.Label>{t("propertyDetails.currency")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="currency"
                            value={listingData.currency}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="€">€ EUR</option>
                            <option value="$">$ USD</option>
                            <option value="£">£ GBP</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.currency?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="price">
                        <Form.Label>{t("propertyDetails.price")} {listingData.currency === "---" ? "" : listingData.currency}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="price"
                            value={listingData.price}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.price?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className={"justify-content-center"}>
                <Col md={6}>
                    <Form.Group controlId="availability">
                        <Form.Label>{t("propertyDetails.availability")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="date"
                            name="availability"
                            value={listingData.availability || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.availability?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
        </>
    )
}

export default CurrencyPriceAvailability