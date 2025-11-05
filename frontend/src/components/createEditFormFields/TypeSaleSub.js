import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/ListingCreateEditForm.module.css";


const TypeSaleSub = ({
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
            <Row className={"justify-content-center"}>
                <Col md={6}>
                    <Form.Group controlId="sale_type">
                        <Form.Label>{t("propertyDetails.typeField")}</Form.Label>
                        <Form.Control
                            className={`${styles.Input}`}
                            as="select"
                            name="sale_type"
                            value={listingData.sale_type}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="rent">{t("propertyDetails.typeRent")}</option>
                            <option value="sale">{t("propertyDetails.typeSale")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.sale_type?.map((message, idx) => (
                        <Alert variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>

            <Row className={"justify-content-center"}>
                <Col md={6}>
                    <Form.Group controlId="type">
                        <Form.Label>{t("propertyDetails.types.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="type"
                            value={listingData.type}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="land">{t("propertyDetails.types.land")}</option>
                            <option value="commercial">{t("propertyDetails.types.commercial")}</option>
                            <option value="residential">{t("propertyDetails.types.residential")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.type?.map((message, idx) => (
                        <Alert variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className={"justify-content-center"}>
                <Col md={6}>
                    <Form.Group controlId="sub_type">
                        <Form.Label>{t("propertyDetails.subTypes.title")}</Form.Label>
                        <Form.Control
                            className={`${styles.Input}`}
                            as="select"
                            name="sub_type"
                            value={listingData.sub_type}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="apartment">{t("propertyDetails.subTypes.apartment")}</option>
                            <option value="house">{t("propertyDetails.subTypes.house")}</option>
                            <option value="maisonette">{t("propertyDetails.subTypes.maisonette")}</option>
                            <option value="bungalow">{t("propertyDetails.subTypes.bungalow")}</option>
                            <option value="villa">{t("propertyDetails.subTypes.villa")}</option>
                            <option value="hotel">{t("propertyDetails.subTypes.hotel")}</option>
                            <option value="office">{t("propertyDetails.subTypes.office")}</option>
                            <option value="retail">{t("propertyDetails.subTypes.retail")}</option>
                            <option value="warehouse">{t("propertyDetails.subTypes.warehouse")}</option>
                            <option value="mixed_use">{t("propertyDetails.subTypes.mixed_use")}</option>
                            <option value="industrial">{t("propertyDetails.subTypes.industrial")}</option>
                            <option value="other">{t("propertyDetails.subTypes.other")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.sub_type?.map((message, idx) => (
                        <Alert variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
        </>
    )
}

export default TypeSaleSub