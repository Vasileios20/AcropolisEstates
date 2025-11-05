import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/ListingCreateEditForm.module.css";

const Description = ({
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
            <Row className="justify-content-center mt-4">
                <Col md={6}>
                    <Form.Group controlId="description">
                        <Form.Label>{t("propertyDetails.description")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="textarea"
                            rows={3}
                            name="description"
                            value={listingData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.description?.map((message, idx) => (
                        <Alert variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
                <Col md={6}>
                    <Form.Group controlId="description_gr">
                        <Form.Label>{t("propertyDetails.description_gr")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="textarea"
                            rows={3}
                            name="description_gr"
                            value={listingData.description_gr}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.description?.map((message, idx) => (
                        <Alert variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
        </>
    )
}

export default Description