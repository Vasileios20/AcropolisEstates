import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

export const ApprovedFeatureCheckbox = ({
    listingData,
    handleChange,
    handleChecked,
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
                    <Form.Group>
                        <Form.Label>{t("propertyDetails.approved")}</Form.Label>
                        <Form.Check
                            type="checkbox"
                            name="approved"
                            checked={listingData.approved}
                            onChange={handleChecked}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>{t("propertyDetails.featured")}</Form.Label>
                        <Form.Check
                            type="checkbox"
                            name="featured"
                            checked={listingData.featured}
                            onChange={handleChecked}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {errors?.images?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
            {errors?.is_first?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
        </>
    )
}
